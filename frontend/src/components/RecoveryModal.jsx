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
  Binary,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Scale
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
        return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'ALTERNATE_PAYMENT':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'REMINDER':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      case 'ESCALATE':
        return 'bg-purple-950 text-purple-300 border-purple-700';
      case 'NO_ACTION':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRiskLevelBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-orange-300 border border-orange-800">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">MEDIUM RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">LOW RISK</span>;
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
                Live Decision Pipeline Trace: <span className="text-sky-400 font-mono">{payment?.transaction_id}</span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                5-Stage Architecture: Ingestion → AI Diagnosis → Economics → Policy Authorization → Outcome
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
        <div className="bg-gradient-to-r from-sky-950/90 via-slate-900 to-indigo-950/90 px-3.5 sm:px-6 py-2 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs min-w-0">
          <span className="font-bold text-sky-300 tracking-wide flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs min-w-0">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" /> AI RECOMMENDS.</span>
            <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-amber-400 shrink-0 sm:ml-1" /> ECONOMICS EVALUATES.</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 sm:ml-1" /> POLICY ENGINE DECIDES.</span>
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
              <p className="text-sm font-semibold text-slate-300">Executing 5-Stage Recovery Pipeline...</p>
              <p className="text-xs text-slate-500">Risk Assessment → LLM Root Cause → Candidate Economics → Policy Guardrails</p>
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

              {/* STAGE 1: Failed Payment Context & Structured Risk Assessment */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-slate-800 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center text-[10px] shrink-0 font-mono">1</span>
                    <span className="truncate">Ingestion & Structured Risk Profile</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {pipelineResult.risk_profile && getRiskLevelBadge(pipelineResult.risk_profile.risk_level)}
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 font-mono font-semibold truncate">
                      {payment?.error_code}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs mt-3 min-w-0">
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Customer:</span>
                    <div className="font-semibold text-white truncate text-[11px] sm:text-xs">{payment?.customer_name}</div>
                    <span className="text-[9px] sm:text-[10px] text-sky-400 font-medium">{payment?.customer_tier} Tier</span>
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

                {/* Gateway Message */}
                <div className="mt-2.5 text-xs bg-slate-900/80 p-2 sm:p-2.5 rounded border border-slate-800/80 text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-500 font-mono text-[10px] sm:text-xs">Gateway Telemetry: </span>
                    <span className="text-slate-200 text-[11px] sm:text-xs break-words">{payment?.error_message}</span>
                  </div>
                  {pipelineResult.event_id && (
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono break-all sm:shrink-0">Event: {pipelineResult.event_id}</span>
                  )}
                </div>

                {/* Structured Risk Factors */}
                {pipelineResult.risk_profile && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 text-[10px] min-w-0">
                    <span className="text-slate-400 font-medium">Risk Factors:</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                      Risk Score: {(pipelineResult.risk_profile.risk_score * 100).toFixed(0)}/100
                    </span>
                    {pipelineResult.risk_profile.is_high_risk && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                        High Risk Flag
                      </span>
                    )}
                    {pipelineResult.risk_profile.flags?.map((flag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* STAGE 2: AI Diagnostic Layer (Advisory Only) */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-sky-900/50 relative min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-300 border border-sky-700 flex items-center justify-center text-[10px] font-mono shrink-0">2</span>
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
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 truncate max-w-full font-mono">
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

                <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs bg-slate-900/50 p-2 sm:p-2.5 rounded border border-slate-800 min-w-0">
                  <span className="text-slate-400 text-[11px] sm:text-xs">AI Advisory Recommendation:</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold border self-start sm:self-auto ${getActionBadgeClass(pipelineResult.llm_diagnosis.recommended_action)}`}>
                      {pipelineResult.llm_diagnosis.recommended_action}
                    </span>
                    <span className="text-[10px] text-slate-500 italic hidden sm:inline">(Zero direct financial authority)</span>
                  </div>
                </div>
              </div>

              {/* STAGE 3: Candidate Economic Evaluation */}
              {pipelineResult.economic_evaluation && (
                <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-amber-900/40 relative min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-300 border border-amber-700 flex items-center justify-center text-[10px] font-mono shrink-0">3</span>
                        Candidate Economic Evaluation
                      </span>
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700 font-medium">
                        Expected Value Analysis
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400">
                      Optimal Payoff Action: <strong className="text-amber-300 font-bold">{pipelineResult.economic_evaluation.optimal_economic_action}</strong> ({formatINR(pipelineResult.economic_evaluation.optimal_expected_net)})
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800 leading-relaxed break-words">
                    <strong className="text-slate-200">Economic Valuation Rationale: </strong>
                    {pipelineResult.economic_evaluation.why_this_action}
                  </p>

                  {/* Candidate Actions Economics Table */}
                  {pipelineResult.economic_evaluation.candidate_actions && pipelineResult.economic_evaluation.candidate_actions.length > 0 && (
                    <div className="mt-2.5 overflow-x-auto w-full max-w-full min-w-0">
                      <table className="w-full min-w-[500px] text-left text-[11px] text-slate-300">
                        <thead className="bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                          <tr>
                            <th className="px-2.5 py-1.5">Candidate Action</th>
                            <th className="px-2.5 py-1.5">Est. Prob</th>
                            <th className="px-2.5 py-1.5">Exp. Gross</th>
                            <th className="px-2.5 py-1.5">Cost</th>
                            <th className="px-2.5 py-1.5 font-bold text-white">Exp. Net</th>
                            <th className="px-2.5 py-1.5 text-right">Policy Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {pipelineResult.economic_evaluation.candidate_actions.map((cand, idx) => {
                            const isAiChoice = cand.action === pipelineResult.llm_diagnosis.recommended_action;
                            const isOptimal = cand.action === pipelineResult.economic_evaluation.optimal_economic_action;
                            return (
                              <tr key={idx} className={`hover:bg-slate-900/60 ${isAiChoice ? 'bg-sky-950/30' : ''}`}>
                                <td className="px-2.5 py-1.5 font-semibold flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeClass(cand.action)}`}>
                                    {cand.action}
                                  </span>
                                  {isAiChoice && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-sky-900 text-sky-200 font-medium">AI Choice</span>
                                  )}
                                  {isOptimal && !isAiChoice && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-900 text-amber-200 font-medium">Max Net</span>
                                  )}
                                </td>
                                <td className="px-2.5 py-1.5 font-mono">{(cand.success_probability * 100).toFixed(0)}%</td>
                                <td className="px-2.5 py-1.5 font-mono">{formatINR(cand.expected_gross_recovery)}</td>
                                <td className="px-2.5 py-1.5 font-mono text-slate-400">{formatINR(cand.intervention_cost)}</td>
                                <td className="px-2.5 py-1.5 font-mono font-bold text-emerald-400">{formatINR(cand.expected_net_recovery)}</td>
                                <td className="px-2.5 py-1.5 text-right">
                                  {cand.is_policy_eligible ? (
                                    <span className="text-emerald-400 font-semibold text-[10px]">Eligible</span>
                                  ) : (
                                    <span className="text-rose-400 font-semibold text-[10px]" title={cand.policy_notes || 'Restricted by guardrails'}>
                                      Restricted
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 4: Deterministic Policy Engine (THE FINAL AUTHORITY) */}
              <div className={`rounded-xl p-3 sm:p-4 border min-w-0 ${
                pipelineResult.policy_evaluation.is_overridden 
                  ? 'bg-amber-950/30 border-amber-600/70' 
                  : 'bg-emerald-950/30 border-emerald-700/60'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center justify-center text-[10px] font-mono shrink-0">4</span>
                      Deterministic Policy Engine
                    </span>
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-700 font-bold">
                      THE FINAL AUTHORITY
                    </span>
                  </div>
                  {pipelineResult.policy_evaluation.is_overridden ? (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-600 font-semibold self-start sm:self-auto shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" /> Policy Guardrail Override
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-semibold self-start sm:self-auto shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" /> Approved by Policy
                    </span>
                  )}
                </div>

                {/* Overridden Callout */}
                {pipelineResult.policy_evaluation.is_overridden ? (
                  <div className="bg-amber-950/80 border border-amber-600/90 p-2.5 sm:p-3 rounded-lg text-xs text-amber-100 my-2 leading-relaxed break-words min-w-0 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Guardrail Intervention Enforced</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2 rounded border border-amber-900/60">
                      <div>
                        <span className="text-slate-400 block text-[10px]">AI Proposed (Advisory):</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border inline-block mt-0.5 line-through opacity-75 ${getActionBadgeClass(pipelineResult.llm_diagnosis.recommended_action)}`}>
                          {pipelineResult.llm_diagnosis.recommended_action}
                        </span>
                      </div>
                      <div>
                        <span className="text-amber-300 font-semibold block text-[10px]">Policy Enforced (Final Authority):</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border inline-block mt-0.5 shadow-sm ${getActionBadgeClass(pipelineResult.policy_evaluation.approved_action)}`}>
                          {pipelineResult.policy_evaluation.approved_action}
                        </span>
                      </div>
                    </div>
                    <p className="text-amber-200 text-[11px] pt-1">
                      <strong>Intervention Reason: </strong>{pipelineResult.policy_evaluation.override_reason}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 my-2 text-xs bg-slate-950/60 p-2 sm:p-3 rounded-lg border border-slate-800 min-w-0">
                    <span className="text-slate-300 font-medium text-[11px] sm:text-xs">Final Policy-Authorized Action:</span>
                    <div className={`px-2.5 sm:px-3 py-1 rounded text-xs font-bold border self-start sm:self-auto ${getActionBadgeClass(pipelineResult.policy_evaluation.approved_action)}`}>
                      {pipelineResult.policy_evaluation.approved_action}
                    </div>
                  </div>
                )}

                {/* Applied Policy Rules List */}
                <div className="mt-2 flex flex-wrap gap-1.5 min-w-0">
                  {pipelineResult.policy_evaluation.applied_rules?.map((rule, idx) => (
                    <span key={idx} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700 font-mono break-all">
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* STAGE 5: Simulated Execution & Outcome */}
              <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-slate-800 min-w-0">
                <div className="flex items-center justify-between mb-2 gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center text-[10px] font-mono shrink-0">5</span>
                    <span className="truncate">Simulated Execution & Outcome</span>
                  </span>
                  <span className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                    pipelineResult.simulation_outcome.status === 'RECOVERED'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : pipelineResult.simulation_outcome.status === 'DUPLICATE_BLOCKED'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : pipelineResult.simulation_outcome.status === 'FRAUD_BLOCKED'
                      ? 'bg-purple-950 text-purple-300 border-purple-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {pipelineResult.simulation_outcome.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs mt-2.5 bg-slate-900/80 p-2.5 sm:p-3 rounded border border-slate-800 min-w-0">
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Simulated Recovered:</span>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5 truncate">
                      {formatINR(pipelineResult.simulation_outcome.recovered_amount)}
                    </div>
                  </div>
                  {pipelineResult.simulation_outcome.fraud_loss_prevented > 0 && (
                    <div className="min-w-0">
                      <span className="text-slate-500 text-[10px] sm:text-[11px] block">Fraud Loss Prevented:</span>
                      <div className="text-sm font-bold text-purple-400 mt-0.5 truncate">
                        {formatINR(pipelineResult.simulation_outcome.fraud_loss_prevented)}
                      </div>
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Intervention Cost:</span>
                    <div className="text-sm font-bold text-slate-300 mt-0.5 truncate">
                      {formatINR(pipelineResult.simulation_outcome.intervention_cost)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-500 text-[10px] sm:text-[11px] block">Simulated Prob:</span>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">
                      {(pipelineResult.simulation_outcome.simulated_probability * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 italic break-words leading-relaxed">
                  * {pipelineResult.simulation_outcome.notes} (Simulated outcome generated under controlled model assumptions).
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

