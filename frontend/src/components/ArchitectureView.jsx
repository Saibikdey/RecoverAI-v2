import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Database,
  Binary,
  FlaskConical
} from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-4 sm:space-y-6 min-w-0 max-w-full">
      
      {/* Core Principle Card */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 min-w-0 max-w-full">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white">System Architecture & Safety Invariant</h3>
            <p className="text-[11px] sm:text-xs text-sky-300/80">Built for Razorpay AI Buildathon Track 03: AI Revenue Recovery Agent</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 sm:mt-4 break-words">
          <strong className="text-white">Why AI + Rules?</strong> Traditional payment recovery relies on rigid, blind retries that repeatedly trigger issuer declines, cause customer fatigue, and waste transaction fees. RecoverAI introduces contextual intelligence: 
          <span className="text-sky-300 font-medium"> AI performs contextual root-cause diagnosis and recommends an action; deterministic rules validate and authorize the action.</span>
        </p>

        {/* Invariant Alert */}
        <div className="mt-3.5 sm:mt-4 bg-emerald-950/40 border border-emerald-700/60 rounded-xl p-3.5 sm:p-4 flex items-start gap-2.5 sm:gap-3 min-w-0">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-200 leading-relaxed min-w-0 flex-1 break-words">
            <strong className="text-emerald-100 font-semibold block text-xs sm:text-sm mb-0.5">
              Zero-Trust Execution Invariant
            </strong>
            The LLM is strictly isolated as an advisory diagnostic agent. It has ZERO permission to execute payments or alter financial state directly. Every recommendation is passed through a deterministic Policy Engine which acts as the sole, final authority.
          </div>
        </div>
      </div>

      {/* 4-Stage Recovery Pipeline Visual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-0 max-w-full">
        <h4 className="text-xs sm:text-sm font-bold text-white mb-4 sm:mb-6 uppercase tracking-wider text-slate-400">
          The 4-Stage Autonomous Recovery Pipeline
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 relative min-w-0 max-w-full">
          
          {/* Stage 1 */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 relative min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs mb-2.5 sm:mb-3">
              1
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-white">Idempotency & Ingest</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
              Checks unique event_id to block duplicate execution, then evaluates risk score and customer tier.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-sky-900/50 relative min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-950 text-sky-400 border border-sky-700 flex items-center justify-center font-bold text-xs mb-2.5 sm:mb-3">
              2
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-sky-300">LLM Diagnosis</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
              Produces structured JSON with root-cause analysis, confidence score, and advisory recovery action.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-emerald-900/50 relative min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center font-bold text-xs mb-2.5 sm:mb-3">
              3
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-emerald-300">Deterministic Policy</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
              Enforces Max Retries, Confidence Thresholds, Fraud Zero-Tolerance, and VIP Escalation with override logging.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-indigo-900/50 relative min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-700 flex items-center justify-center font-bold text-xs mb-2.5 sm:mb-3">
              4
            </div>
            <h5 className="text-xs sm:text-sm font-bold text-indigo-300">Simulate & Audit</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
              Simulates recovery outcome under synthetic assumptions, persists event_id, and writes immutable audit log.
            </p>
          </div>

        </div>
      </div>

      {/* Allowed Actions & Guardrails Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Allowed Actions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Whitelisted Recovery Actions</span>
          </h4>
          <div className="space-y-2.5 sm:space-y-3 text-xs">
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-blue-400">RETRY</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Automated re-attempt for transient server downtime and network timeouts.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">ALTERNATE_PAYMENT</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Prompt customer to switch from expired card or hit limit to UPI/NetBanking.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-amber-400">REMINDER</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">1-click notification prompt for 3DS OTP dropouts or balance top-ups.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-purple-400">ESCALATE</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Route VIP/Enterprise accounts or low-confidence declines to human support.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-rose-400">NO_ACTION</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Immediate freeze on suspected fraud to prevent chargeback penalties.</p>
            </div>
          </div>
        </div>

        {/* Guardrail Rules */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Deterministic Policy Rules</span>
          </h4>
          <div className="space-y-2.5 sm:space-y-3 text-xs">
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">1. Idempotency Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Blocks duplicate executions for identical event_ids, logging DUPLICATE_BLOCKED.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">2. Max Retries Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">If retry count $\ge 3$, blocks further retries $\rightarrow$ overrides to ALTERNATE_PAYMENT or ESCALATE.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">3. Confidence Threshold Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">If LLM confidence &lt; 0.65, overrides autonomous action $\rightarrow$ routes to ESCALATE.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">4. Fraud Zero-Tolerance Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">If SUSPECTED_FRAUD, strictly prohibits RETRY and REMINDER $\rightarrow$ enforces NO_ACTION.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">5. Expired Card Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Re-attempting an expired card is guaranteed to fail $\rightarrow$ forces ALTERNATE_PAYMENT.</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200">6. High-Value / VIP Guard</span>
              <p className="text-slate-400 mt-0.5 leading-relaxed">Transactions $\ge$ ₹50,000 or VIP tiers with complex decline get white-glove ESCALATION.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
