import json
import logging
import httpx
from typing import Dict, Any, Tuple, Optional
from pydantic import ValidationError

from app.config import settings, get_effective_llm_mode
from app.schemas import LLMDiagnosisOutput, RecoveryActionEnum, RiskProfile
from app.models import PaymentRecord

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are RecoverAI's diagnostic intelligence sub-system.
Your role is to diagnose the root cause of failed digital payments (Razorpay/UPI/Cards/NetBanking/NACH) and recommend the most effective recovery action.

CRITICAL SAFETY DIRECTIVE:
You are an advisory diagnostic agent ONLY. You CANNOT execute financial transactions or modify user balances.
The deterministic Policy Engine has final authority over execution.
Your output must be strictly structured JSON adhering to the schema below.

Allowed recommended_action values:
- RETRY : For transient errors (e.g. gateway timeout, temporary bank switch outage).
- ALTERNATE_PAYMENT : For permanent instrument decline (e.g. expired card, daily limit hit, where switching to UPI/Cards is needed).
- REMINDER : For user-actionable friction (e.g. 3DS OTP dropout, temporary insufficient balance).
- ESCALATE : For VIP/Enterprise accounts, complex declines, repeated failures, or ambiguous reasons requiring support.
- NO_ACTION : For high-risk fraud flags, blocked accounts, or impossible recoveries to avoid financial loss or penalty fees.

JSON Response Schema:
{
  "root_cause_diagnosis": "<detailed contextual diagnosis of the failure>",
  "confidence": <float between 0.0 and 1.0>,
  "recommended_action": "<RETRY | ALTERNATE_PAYMENT | REMINDER | ESCALATE | NO_ACTION>",
  "rationale": "<reasoning for recommendation>",
  "key_factors": ["<factor 1>", "<factor 2>"]
}
"""

class LLMService:
    @staticmethod
    def _deterministic_fallback_diagnosis(
        payment: PaymentRecord, 
        risk_profile: Optional[RiskProfile] = None
    ) -> LLMDiagnosisOutput:
        """
        Deterministic, rule-backed contextual heuristic engine used when no external LLM API key
        is configured or when the API call fails/times out.
        """
        code = payment.error_code
        tier = payment.customer_tier
        retries = payment.retry_count
        amount = payment.amount

        if code == "SUSPECTED_FRAUD":
            return LLMDiagnosisOutput(
                root_cause_diagnosis="Transaction triggered automated security anomaly: high-velocity IP/device mismatch.",
                confidence=0.96,
                recommended_action=RecoveryActionEnum.NO_ACTION,
                rationale="Immediate freeze recommended to prevent chargeback loss and merchant penalty.",
                key_factors=[
                    "Automated fraud velocity rule tripped",
                    "Zero-tolerance security protocol enforced",
                    "Immediate freeze prevents chargeback loss"
                ]
            )
        elif code == "CARD_EXPIRED":
            if tier in ["VIP", "ENTERPRISE"]:
                return LLMDiagnosisOutput(
                    root_cause_diagnosis=f"Customer's primary card expired. High-tier customer ({tier}) with high LTV.",
                    confidence=0.92,
                    recommended_action=RecoveryActionEnum.ALTERNATE_PAYMENT,
                    rationale="Direct prompt to add a new card or fallback to saved UPI handle.",
                    key_factors=[
                        f"High-value {tier} account with high LTV",
                        "Permanent card expiration on primary instrument",
                        "Switching to alternate payment method or UPI is required"
                    ]
                )
            return LLMDiagnosisOutput(
                root_cause_diagnosis="Card expiry date is in the past. Re-attempting will fail identically.",
                confidence=0.88,
                recommended_action=RecoveryActionEnum.ALTERNATE_PAYMENT,
                rationale="Notify customer to update payment instrument or select alternate method.",
                key_factors=[
                    "Card validity date expired in issuer database",
                    "Automated retries on expired card are guaranteed to fail",
                    "Customer must provide alternate card or payment method"
                ]
            )
        elif code in ["BANK_SERVER_DOWN", "NETWORK_TIMEOUT"]:
            if retries >= settings.MAX_RETRIES:
                return LLMDiagnosisOutput(
                    root_cause_diagnosis="Issuer switch outage persisted across multiple retry attempts.",
                    confidence=0.78,
                    recommended_action=RecoveryActionEnum.ESCALATE,
                    rationale="Max retry threshold reached; human review or alternate route required.",
                    key_factors=[
                        f"Retry limit ({retries}/{settings.MAX_RETRIES}) reached during bank outage",
                        "Switch outage persisting longer than standard cooldown",
                        "Human operations escalation required"
                    ]
                )
            return LLMDiagnosisOutput(
                root_cause_diagnosis=f"Transient infrastructure error ({code}). Core bank switch temporarily unavailable.",
                confidence=0.89,
                recommended_action=RecoveryActionEnum.RETRY,
                rationale="High probability of success once issuer switch recovers after cooldown.",
                key_factors=[
                    "Transient bank switch infrastructure timeout (HTTP 504/91)",
                    f"Retry budget available ({retries}/{settings.MAX_RETRIES})",
                    "Exponential cooldown retry expected to succeed"
                ]
            )
        elif code == "AUTHENTICATION_FAILED_3DS":
            return LLMDiagnosisOutput(
                root_cause_diagnosis="Customer abandoned OTP entry screen or entered invalid 3DS passcode.",
                confidence=0.84,
                recommended_action=RecoveryActionEnum.REMINDER,
                rationale="Send contextual WhatsApp/SMS payment link with 1-click retry to resume checkout.",
                key_factors=[
                    "User 3D-Secure friction / OTP session timeout",
                    "Payment intent verified; user drop-off occurred at verification",
                    "Contextual WhatsApp/SMS reminder with 1-click retry"
                ]
            )
        elif code == "INSUFFICIENT_FUNDS":
            if amount > 25000:
                return LLMDiagnosisOutput(
                    root_cause_diagnosis="High-ticket transaction debit failed due to insufficient account balance.",
                    confidence=0.75,
                    recommended_action=RecoveryActionEnum.REMINDER,
                    rationale="Send scheduled reminder for salary/deposit cycle or offer split/alternate payment.",
                    key_factors=[
                        f"Large transaction (₹{amount:,.2f}) balance failure",
                        "Customer fatigue prevention avoids immediate blind retry",
                        "Scheduled notification or split payment offer"
                    ]
                )
            return LLMDiagnosisOutput(
                root_cause_diagnosis="Insufficient account balance at time of debit attempt.",
                confidence=0.80,
                recommended_action=RecoveryActionEnum.REMINDER,
                rationale="Trigger soft notification reminder or NACH re-presentment in 24 hours.",
                key_factors=[
                    "Account balance insufficient at transaction time",
                    "Customer reminder or NACH re-presentment schedule advised",
                    "Prevents debit failure penalty fees"
                ]
            )
        elif code == "LIMIT_EXCEEDED":
            return LLMDiagnosisOutput(
                root_cause_diagnosis=f"Transaction of ₹{amount:,.2f} exceeded instrument's per-transaction limit.",
                confidence=0.82,
                recommended_action=RecoveryActionEnum.ALTERNATE_PAYMENT,
                rationale="Prompt customer to split payment or switch to NetBanking/RTGS.",
                key_factors=[
                    f"Transaction amount ₹{amount:,.2f} exceeds per-transaction or daily limit",
                    "Retry on same instrument will fail identically",
                    "Dynamic checkout prompt for NetBanking/alternate card"
                ]
            )
        elif code == "DO_NOT_HONOR":
            if tier in ["VIP", "ENTERPRISE"]:
                return LLMDiagnosisOutput(
                    root_cause_diagnosis=f"Generic issuing bank decline (Code 05) on high-value {tier} account.",
                    confidence=0.70,
                    recommended_action=RecoveryActionEnum.ESCALATE,
                    rationale="Priority relationship manager escalation to assist customer directly.",
                    key_factors=[
                        f"Generic decline Code 05 on high-tier {tier} customer",
                        "High commercial value warrants personal outreach",
                        "Dedicated desk to assist card issuer authorization"
                    ]
                )
            return LLMDiagnosisOutput(
                root_cause_diagnosis="Generic card issuer decline without specific reason.",
                confidence=0.62, # Low confidence to test confidence threshold guardrails
                recommended_action=RecoveryActionEnum.RETRY,
                rationale="Initial retry attempt or customer bank verification.",
                key_factors=[
                    "Generic decline Code 05 from issuing switch",
                    "Low diagnostic confidence (0.62)",
                    "Requires cautious retry or customer verification"
                ]
            )
        else:
            return LLMDiagnosisOutput(
                root_cause_diagnosis=f"Unclassified payment failure: {payment.error_message}",
                confidence=0.55,
                recommended_action=RecoveryActionEnum.ESCALATE,
                rationale="Unknown failure signature requires manual escalation.",
                key_factors=[
                    f"Unclassified error message: {payment.error_message}",
                    "Low confidence (0.55) triggers human review guardrail"
                ]
            )

    @classmethod
    def diagnose_payment(
        cls, 
        payment: PaymentRecord, 
        risk_profile: Optional[RiskProfile] = None
    ) -> Tuple[LLMDiagnosisOutput, str]:
        """
        Diagnoses a payment failure.
        Returns a tuple of (LLMDiagnosisOutput, mode_string) where mode_string is
        'LLM Mode' or 'Deterministic Fallback Mode'.
        """
        mode = get_effective_llm_mode()
        
        if mode == "llm":
            # Attempt live LLM call if API key is present
            try:
                diagnosis = cls._call_live_llm(payment, risk_profile=risk_profile)
                return diagnosis, "LLM Mode"
            except (json.JSONDecodeError, ValidationError) as e:
                logger.warning(f"Malformed LLM output received ({str(e)}), safely falling back.")
                fallback = cls._deterministic_fallback_diagnosis(payment, risk_profile=risk_profile)
                return fallback, "Deterministic Fallback Mode (Malformed LLM Output)"
            except httpx.TimeoutException:
                logger.warning("LLM API call timed out, safely falling back to deterministic engine.")
                fallback = cls._deterministic_fallback_diagnosis(payment, risk_profile=risk_profile)
                return fallback, "Deterministic Fallback Mode (API Timeout Fallback)"
            except Exception as e:
                logger.warning(f"Live LLM call failed ({str(e)}), falling back to deterministic engine.")
                fallback = cls._deterministic_fallback_diagnosis(payment, risk_profile=risk_profile)
                return fallback, f"Deterministic Fallback Mode (API Error: {type(e).__name__})"
        
        # Default: Deterministic Fallback Mode
        return cls._deterministic_fallback_diagnosis(payment, risk_profile=risk_profile), "Deterministic Fallback Mode"

    @classmethod
    def _call_live_llm(
        cls, 
        payment: PaymentRecord, 
        risk_profile: Optional[RiskProfile] = None
    ) -> LLMDiagnosisOutput:
        """Invokes external LLM API (Gemini or OpenAI compatible) with enriched risk context and strict JSON parsing."""
        context_payload: Dict[str, Any] = {
            "transaction_id": payment.transaction_id,
            "customer_id": payment.customer_id,
            "customer_name": payment.customer_name,
            "customer_tier": payment.customer_tier,
            "amount": payment.amount,
            "currency": payment.currency,
            "payment_method": payment.payment_method,
            "error_code": payment.error_code,
            "error_message": payment.error_message,
            "retry_count": payment.retry_count,
            "risk_score": payment.risk_score,
            "risk_level": payment.risk_level
        }

        # Inject enriched multi-factor risk assessment (Phase 2 & 3)
        if risk_profile:
            context_payload.update({
                "financial_exposure": risk_profile.financial_exposure,
                "recovery_feasibility": risk_profile.recovery_feasibility,
                "operational_urgency": risk_profile.urgency,
                "customer_fatigue_risk": risk_profile.customer_fatigue_risk,
                "security_risk": risk_profile.security_risk,
                "key_risk_factors": risk_profile.key_risk_factors
            })
        
        prompt_text = (
            f"Analyze this failed payment transaction with its structured risk profile:\n"
            f"{json.dumps(context_payload, indent=2)}\n\n"
            f"Provide the root cause diagnosis, confidence (0.0-1.0), recommended action, rationale, and key factors in JSON format."
        )

        # Support Gemini API
        if settings.GEMINI_API_KEY:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
            headers = {"Content-Type": "application/json"}
            body = {
                "contents": [{"parts": [{"text": prompt_text}]}],
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, headers=headers, json=body)
                res.raise_for_status()
                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_text)
                return LLMDiagnosisOutput(**parsed)

        # Support OpenAI API
        elif settings.OPENAI_API_KEY:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            body = {
                "model": settings.OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_text}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.1
            }
            with httpx.Client(timeout=10.0) as client:
                res = client.post(url, headers=headers, json=body)
                res.raise_for_status()
                data = res.json()
                raw_text = data["choices"][0]["message"]["content"]
                parsed = json.loads(raw_text)
                return LLMDiagnosisOutput(**parsed)

        raise ValueError("No LLM API Key configured")
