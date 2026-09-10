from typing import List
from app.models import PaymentRecord
from app.schemas import RiskProfile

class RiskEngine:
    """
    Deterministic & Explainable Multi-Factor Risk Assessment Engine.
    
    Evaluates:
    - Financial Exposure (transaction value & high-value thresholds)
    - Customer Tier Importance & LTV risk (STANDARD, VIP, ENTERPRISE)
    - Failure / Switch Category Feasibility
    - Retry Velocity & Customer Touchpoint Fatigue
    - Security / Fraud Anomaly Exposure
    - Operational Urgency
    """

    @staticmethod
    def evaluate_risk(payment: PaymentRecord) -> RiskProfile:
        key_factors: List[str] = []
        amount = payment.amount
        tier = payment.customer_tier
        code = payment.error_code
        retries = payment.retry_count

        # 1. Financial Exposure Evaluation
        financial_exposure = float(amount)
        is_high_exposure = amount >= 50000.0
        if is_high_exposure:
            key_factors.append(f"High financial exposure (₹{amount:,.2f} >= ₹50,000 threshold)")
        elif amount >= 20000.0:
            key_factors.append(f"Moderate financial exposure (₹{amount:,.2f})")

        # 2. Customer Tier Weighting
        if tier == "ENTERPRISE":
            key_factors.append("Enterprise customer tier — elevated commercial impact")
        elif tier == "VIP":
            key_factors.append("VIP tier customer — priority customer experience")

        # 3. Customer Fatigue Risk
        if retries >= 2:
            customer_fatigue_risk = "HIGH"
            key_factors.append(f"Elevated customer fatigue ({retries} previous failed attempts)")
        elif retries == 1:
            customer_fatigue_risk = "MEDIUM"
            key_factors.append("Single prior retry attempt recorded")
        else:
            customer_fatigue_risk = "LOW"

        # 4. Security / Fraud Risk
        if code == "SUSPECTED_FRAUD":
            security_risk = "CRITICAL"
            key_factors.append("Automated fraud detection rule triggered — zero-tolerance policy")
        elif code == "LIMIT_EXCEEDED" and is_high_exposure:
            security_risk = "HIGH"
            key_factors.append("Large volume limit breach requires security validation")
        elif code == "DO_NOT_HONOR":
            security_risk = "MEDIUM"
            key_factors.append("Issuer generic decline — potential cardholder restriction")
        else:
            security_risk = "LOW"

        # 5. Recovery Feasibility Base Mapping
        if code in ["BANK_SERVER_DOWN", "NETWORK_TIMEOUT"]:
            base_feasibility = 0.88
            urgency = "HIGH"
            key_factors.append("Transient issuer switch / network issue — high recovery feasibility")
        elif code == "AUTHENTICATION_FAILED_3DS":
            base_feasibility = 0.82
            urgency = "HIGH" if (is_high_exposure or tier in ["VIP", "ENTERPRISE"]) else "MEDIUM"
            key_factors.append("User checkout friction (3DS drop-off) — recoverable via reminder")
        elif code == "INSUFFICIENT_FUNDS":
            base_feasibility = 0.75
            urgency = "HIGH" if (is_high_exposure or tier in ["VIP", "ENTERPRISE"]) else "MEDIUM"
            key_factors.append("Account balance insufficiency — recoverable via soft reminder/alternate")
        elif code == "CARD_EXPIRED":
            base_feasibility = 0.84 # via alternate payment
            urgency = "LOW"
            key_factors.append("Permanent card expiration — recoverable strictly via alternate instrument")
        elif code == "LIMIT_EXCEEDED":
            base_feasibility = 0.70
            urgency = "HIGH" if (is_high_exposure or tier in ["VIP", "ENTERPRISE"]) else "MEDIUM"
            key_factors.append("Instrument limit exceeded — split payment or alternate channel feasible")
        elif code == "DO_NOT_HONOR":
            base_feasibility = 0.45
            urgency = "HIGH" if tier in ["VIP", "ENTERPRISE"] else "MEDIUM"
            key_factors.append("Generic card decline — requires account investigation")
        elif code == "SUSPECTED_FRAUD":
            base_feasibility = 0.00
            urgency = "CRITICAL"
            key_factors.append("Fraudulent transaction — intentional zero-recovery containment")
        else:
            base_feasibility = 0.50
            urgency = "MEDIUM"

        # Tier bonus / retry penalty for recovery feasibility (only for non-fraud)
        feasibility = base_feasibility
        if code != "SUSPECTED_FRAUD":
            if tier == "ENTERPRISE":
                feasibility = min(0.98, feasibility + 0.05)
            elif tier == "VIP":
                feasibility = min(0.95, feasibility + 0.03)

            if retries > 0:
                feasibility = max(0.10, feasibility - (retries * 0.15))

        # 6. Composite Risk Score (0.0 to 1.0)
        # Weighted factors: Security (40%), Exposure (25%), Retries/Fatigue (20%), Base Error (15%)
        sec_weight = {"CRITICAL": 1.0, "HIGH": 0.7, "MEDIUM": 0.4, "LOW": 0.1}[security_risk]
        exp_weight = min(1.0, amount / 100000.0)
        fatigue_weight = min(1.0, retries / 3.0)
        feasibility_gap = 1.0 - feasibility

        composite_risk = (
            (sec_weight * 0.40) +
            (exp_weight * 0.25) +
            (fatigue_weight * 0.20) +
            (feasibility_gap * 0.15)
        )
        composite_risk = round(min(0.99, max(0.05, composite_risk)), 2)

        # 7. Risk Level Classification
        if composite_risk >= 0.80 or security_risk == "CRITICAL":
            risk_level = "CRITICAL"
        elif composite_risk >= 0.60:
            risk_level = "HIGH"
        elif composite_risk >= 0.35:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return RiskProfile(
            risk_score=composite_risk,
            risk_level=risk_level,
            recovery_feasibility=round(feasibility, 2),
            urgency=urgency,
            customer_fatigue_risk=customer_fatigue_risk,
            financial_exposure=financial_exposure,
            security_risk=security_risk,
            key_risk_factors=key_factors
        )
