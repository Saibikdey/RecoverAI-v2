import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle, 
  Zap, 
  Activity, 
  Cpu,
  Lock,
  Binary
} from 'lucide-react';

export default function RecoveryModal({ 
  isOpen, 
  onClose, 
  payment, 
  pipelineResult, 
  isProcessing 
}) {
  if (!isOpen) return null;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'RETRY':
        return 'bg-blue-950 text-blue-400 border-blue-700';
      case 'ALTERNATE_PAYMENT':
        return 'bg-emerald-950 text-emerald-400 border-emerald-700';
      case 'REMINDER':
        return 'bg-amber-950 text-amber-400 border-amber-700';
      case 'ESCALATE':
        return 'bg-purple-950 text-purple-400 border-purple-700';
      case 'NO_ACTION':
        return 'bg-rose-950 text-rose-400 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto w-full max-w-full min-w-0">
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto min-w-0 max-w-full">
        
        {/* Modal Header */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 gap-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-base font-bold text-white truncate">
                Live Recovery Pipeline Trace: <span className="text-sky-400 font-mono">{payment?.transaction_id}</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                AI Diagnosis → Policy Authorization → Outcome Simulation
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0 ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Boundary Anchor Banner */}
        <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 px-3.5 sm:px-6 py-2 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs min-w-0">
          <span className="font-bold text-sky-300 tracking-wide flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs min-w-0">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" /> AI RECOMMENDS.</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 sm:ml-2" /> POLICY ENGINE DECIDES.</span>
          </span>
          <span className="text-[9px] sm:text-[11px] text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800 max-w-full">
            Deterministic Final Authority
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-3 sm:p-6 space-y-3.5 sm:space-y-5 max-h-[75vh] overflow-y-auto min-w-0 max-w-full">
          
          {isProcessing ? (
            <div className="py-12 sm:py-16 text-center space-y-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-300">Executing Recovery Workflow...</p>
              <p className="text-xs text-slate-500">Evaluating LLM Root-Cause & Deterministic Safety Rules</p>
            </div>
          ) : pipelineResult ? (
            <>
              {/* Idempotency Duplicate Alert Banner if duplicate */}
              {pipelineResult.is_duplicate && (
                <div className="bg-rose-950/80 border border-rose-600 rounded-xl p-3 sm:p-3.5 text-xs text-rose-200 flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
                  <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-rose-100 block">IDEMPOTENCY GUARD: DUPLICATE EXECUTION BLOCKED</span>
                    <p className="text-rose-300 mt-0.5 leading-relaxed break-words">{pipelineResult.message}</p>
                  </div>
                </div>
              )}

              {/* Stage 1: Failed Payment Context */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-slate-800 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span className="truncate">Payment Context</span>
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-mono font-semibold truncate shrink-0">
                    {payment?.error_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs mt-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Customer:</span>
                    <div className="font-semibold text-white truncate text-[11px] sm:text-xs">{payment?.customer_name}</div>
                    <span className="text-[9px] sm:text-[10px] text-sky-400">{payment?.customer_tier} Tier</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Amount at Risk:</span>
                    <div className="font-semibold text-white truncate text-[11px] sm:text-xs">{formatINR(payment?.amount)}</div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Payment Method:</span>
                    <div className="font-semibold text-slate-300 truncate text-[11px] sm:text-xs">{payment?.payment_method}</div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Prior Retries:</span>
                    <div className="font-semibold text-slate-300 text-[11px] sm:text-xs">{payment?.retry_count} / 3 max</div>
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 text-xs bg-slate-900/80 p-2 sm:p-2.5 rounded border border-slate-800/80 text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-500 font-mono text-[10px] sm:text-xs">Gateway Message: </span>
                    <span className="text-slate-200 text-[11px] sm:text-xs break-words">{payment?.error_message}</span>
                  </div>
                  {pipelineResult.event_id && (
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono break-all sm:shrink-0">Event: {pipelineResult.event_id}</span>
                  )}
                </div>
              </div>

              {/* Stage 2: AI Diagnostic Layer (Advisory Only) */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-sky-900/40 relative min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-300 border border-sky-700 flex items-center justify-center text-[10px] shrink-0">2</span>
                      AI Diagnostic Layer
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-700 font-medium">
                      Advisory Recommendation Only
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className="text-[11px] sm:text-xs text-slate-400"
                      title="Internal decision signal used by the policy confidence threshold — not a calibrated real-world accuracy probability."
                    >
                      Confidence: <strong className="text-sky-300 font-bold">{(pipelineResult.llm_diagnosis.confidence * 100).toFixed(0)}%</strong>
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 truncate max-w-full">
                      {pipelineResult.llm_mode}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 mt-2 bg-slate-900/80 p-2.5 sm:p-3 rounded border border-slate-800 min-w-0">
                  <p className="font-medium text-slate-100 text-[11px] sm:text-xs leading-relaxed break-words">{pipelineResult.llm_diagnosis.root_cause_diagnosis}</p>
                  <p className="text-slate-400 mt-1.5 text-[10px] sm:text-[11px] leading-relaxed break-words">
                    <strong className="text-slate-300">Contextual Rationale: </strong>{pipelineResult.llm_diagnosis.rationale}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs bg-slate-900/50 p-2 sm:p-2.5 rounded border border-slate-800 min-w-0">
                  <span className="text-slate-400 text-[11px] sm:text-xs">AI Advisory Recommendation:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold border self-start sm:self-auto ${getActionBadgeClass(pipelineResult.llm_diagnosis.recommended_action)}`}>
                    {pipelineResult.llm_diagnosis.recommended_action}
                  </span>
                </div>
              </div>

              {/* Stage 3: Deterministic Policy Engine (FINAL AUTHORITY) */}
              <div className={`rounded-xl p-3 sm:p-4 border min-w-0 ${
                pipelineResult.policy_evaluation.is_overridden 
                  ? 'bg-amber-950/30 border-amber-700/60' 
                  : 'bg-emerald-950/30 border-emerald-700/60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center justify-center text-[10px] shrink-0">3</span>
                      Deterministic Policy Engine
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-700 font-bold">
                      THE FINAL AUTHORITY
                    </span>
                  </div>
                  {pipelineResult.policy_evaluation.is_overridden ? (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600 font-semibold self-start sm:self-auto shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Policy Guardrail Override
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-semibold self-start sm:self-auto shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Approved by Policy
                    </span>
                  )}
                </div>

                {pipelineResult.policy_evaluation.is_overridden && (
                  <div className="bg-amber-950/70 border border-amber-700/90 p-2.5 sm:p-3 rounded-lg text-xs text-amber-200 my-2 leading-relaxed break-words min-w-0">
                    <strong className="text-amber-100">Guardrail Intervention Reason: </strong>
                    {pipelineResult.policy_evaluation.override_reason}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 my-2 text-xs bg-slate-950/60 p-2 sm:p-3 rounded-lg border border-slate-800 min-w-0">
                  <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Final Policy-Authorized Action:</span>
                  <div className={`px-2.5 sm:px-3 py-1 rounded text-xs font-bold border self-start sm:self-auto ${getActionBadgeClass(pipelineResult.policy_evaluation.approved_action)}`}>
                    {pipelineResult.policy_evaluation.approved_action}
                  </div>
                </div>

                {/* Applied Policy Rules List */}
                <div className="mt-2 flex flex-wrap gap-1.5 min-w-0">
                  {pipelineResult.policy_evaluation.applied_rules?.map((rule, idx) => (
                    <span key={idx} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700 font-mono break-all">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stage 4: Simulated Execution & Outcome */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-slate-800 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] shrink-0">4</span>
                    <span className="truncate">Simulated Outcome</span>
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                    pipelineResult.simulation_outcome.status === 'RECOVERED'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : pipelineResult.simulation_outcome.status === 'DUPLICATE_BLOCKED'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {pipelineResult.simulation_outcome.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs mt-2.5 sm:mt-3 bg-slate-900/80 p-2.5 sm:p-3 rounded border border-slate-800 min-w-0">
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Simulated Recovered Amount:</span>
                    <div className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 truncate">
                      {formatINR(pipelineResult.simulation_outcome.recovered_amount)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Simulated Success Probability:</span>
                    <div className="text-sm sm:text-base font-bold text-white mt-0.5 truncate">
                      {(pipelineResult.simulation_outcome.simulated_probability * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 italic break-words leading-relaxed">
                  * {pipelineResult.simulation_outcome.notes}
                </p>
              </div>

            </>
          ) : null}

        </div>

        {/* Modal Footer */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end min-w-0">
          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
