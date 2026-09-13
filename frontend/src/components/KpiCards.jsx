import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Zap, 
  FlaskConical,
  Percent
} from 'lucide-react';

export default function KpiCards({ overview, comparison }) {
  const atRisk = overview?.revenue_at_risk ?? comparison?.ai_strategy?.total_revenue_at_risk ?? 0;
  const aiRecovered = overview?.recovered_revenue_ai ?? comparison?.ai_strategy?.total_recovered_revenue ?? 0;
  const aiTxRate = overview?.transaction_recovery_rate_ai ?? comparison?.ai_strategy?.transaction_recovery_rate_pct ?? 0;
  const baseRecovered = overview?.recovered_revenue_baseline ?? comparison?.baseline_strategy?.total_recovered_revenue ?? 0;
  const baseTxRate = overview?.transaction_recovery_rate_baseline ?? comparison?.baseline_strategy?.transaction_recovery_rate_pct ?? 0;
  const overrides = overview?.policy_override_count ?? comparison?.ai_strategy?.overrides_enforced ?? 0;
  const uplift = comparison?.uplift_revenue ?? (aiRecovered - baseRecovered > 0 ? aiRecovered - baseRecovered : 0);
  const retriesSaved = comparison?.retries_saved ?? 0;
  
  // Dynamically calculated Revenue Recovery Rate: (simulated recovered revenue / total revenue at risk) * 100
  const revenueRecoveryRate = atRisk > 0 ? (aiRecovered / atRisk) * 100 : (overview?.revenue_recovery_rate_ai || 0);
  const baseRevenueRate = atRisk > 0 ? (baseRecovered / atRisk) * 100 : (overview?.revenue_recovery_rate_baseline || 0);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-4 min-w-0 max-w-full">
      
      {/* Prominent Simulation Mode Banner */}
      <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-start sm:items-center gap-2.5 text-xs text-sky-200 min-w-0 max-w-full">
        <FlaskConical className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-relaxed min-w-0 flex-1 break-words">
          <strong className="text-sky-300 font-semibold">SIMULATION MODE — </strong>
          <span>Synthetic payment data only. No real money, payment credentials, or live transactions are used. All financial figures represent simulated recovery outcomes.</span>
        </div>
      </div>

      {/* 5 KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 min-w-0 max-w-full">
        
        {/* 1. Revenue At Risk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue at Risk</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-2.5">
              <div className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">{formatINR(atRisk)}</div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Across 100 failed transactions</p>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-slate-500">
            Total unrecovered failure exposure
          </div>
        </div>

        {/* 2. Simulated AI Recovery */}
        <div className="bg-slate-900/90 border border-sky-800/60 rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-sky-400 uppercase tracking-wider">Simulated AI Recovery</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-950/80 border border-sky-700/60 flex items-center justify-center text-sky-400 shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-2.5">
              <div className="text-lg sm:text-xl font-bold text-sky-300 tracking-tight truncate">{formatINR(aiRecovered)}</div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className="font-semibold text-emerald-400 text-xs sm:text-sm">{aiTxRate.toFixed(1)}%</span>
                <span className="text-slate-300 text-[10px] sm:text-[11px]">transaction recovery</span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-slate-400">Revenue Recovery:</span>
            <span className="font-semibold text-sky-300">{revenueRecoveryRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* 3. Naive Baseline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider">Naive Baseline</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-2.5">
              <div className="text-lg sm:text-xl font-bold text-slate-300 tracking-tight truncate">{formatINR(baseRecovered)}</div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                <span className="font-semibold text-amber-400 text-xs sm:text-sm">{baseTxRate.toFixed(1)}%</span>
                <span className="text-slate-400 text-[10px] sm:text-[11px]">blind 3x retry rate</span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-slate-400">Revenue Recovery:</span>
            <span className="font-semibold text-amber-300/80">{baseRevenueRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* 4. Simulated Uplift */}
        <div className="bg-slate-900/90 border border-emerald-800/60 rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider">Simulated Uplift</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-2.5">
              <div className="text-lg sm:text-xl font-bold text-emerald-300 tracking-tight truncate">+{formatINR(uplift)}</div>
              <p className="text-[10px] sm:text-[11px] text-emerald-400/90 mt-0.5 font-medium">
                Simulated Revenue Uplift vs. Naive Baseline
              </p>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-slate-400">Blind retries saved:</span>
            <span className="font-semibold text-emerald-300">{retriesSaved}</span>
          </div>
        </div>

        {/* 5. Policy Overrides & Guardrails */}
        <div className="bg-slate-900/90 border border-indigo-800/60 rounded-xl p-3.5 sm:p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-semibold text-indigo-400 uppercase tracking-wider">Policy Overrides</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="mt-2 sm:mt-2.5">
              <div className="text-lg sm:text-xl font-bold text-indigo-300 tracking-tight truncate">{overrides} Interventions</div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Deterministic Safety Guardrails</p>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-indigo-300/80">
            Unsafe/excessive retries blocked
          </div>
        </div>

      </div>
    </div>
  );
}
