import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Layers, 
  Activity, 
  Info, 
  ShieldAlert,
  HelpCircle,
  FlaskConical,
  Binary
} from 'lucide-react';

export default function Header({
  llmMode,
  onRunBatch,
  onRunBaseline,
  onRunRuleBaseline,
  onReset,
  loadingBatch,
  loadingBaseline,
  loadingRuleBaseline,
  loadingReset
}) {
  const isLlm = Boolean(
    llmMode && 
    (llmMode.includes("LLM Mode") || llmMode.includes("gemini") || llmMode.includes("openai") || llmMode.includes("gpt")) && 
    !llmMode.includes("Fallback")
  );

  const statusLabel = isLlm ? "AI Advisory Active" : "AI Advisory • Demo Fallback";
  const statusTooltip = isLlm
    ? "Live LLM advisory layer active — recommendations are validated by the deterministic Policy Engine."
    : "LLM unavailable — deterministic fallback active for reproducible simulation. Policy Engine is the sole execution authority.";

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-3.5 sm:px-6 py-3 sm:py-3.5 w-full max-w-full">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 sm:gap-4 w-full min-w-0">
        
        {/* Brand & Subtitle */}
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-bold text-lg sm:text-xl shrink-0">
            R
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">RecoverAI</h1>
              
              {/* Dynamic Contextual AI Advisory Status Badge */}
              <div 
                title={statusTooltip}
                className={`flex items-center gap-1.5 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold border max-w-full min-w-0 cursor-help ${
                  isLlm 
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700' 
                    : 'bg-slate-950/90 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${isLlm ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`}></span>
                <span className="truncate">{statusLabel}</span>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-tight sm:leading-normal">
              AI-Assisted Revenue Recovery with Deterministic Policy Guardrails
            </p>
          </div>
        </div>

        {/* Global CTA Actions */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end min-w-0">
          <button
            onClick={onReset}
            disabled={loadingReset || loadingBatch || loadingBaseline || loadingRuleBaseline}
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded-lg transition disabled:opacity-50 shadow-sm w-full sm:w-auto min-w-0"
            title="Reset dataset with 100 fresh synthetic failed payments"
          >
            <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${loadingReset ? 'animate-spin' : ''}`} />
            <span className="truncate">Reset (100)</span>
          </button>

          <button
            onClick={onRunBaseline}
            disabled={loadingReset || loadingBatch || loadingBaseline || loadingRuleBaseline}
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 active:bg-amber-800 border border-amber-700/80 rounded-lg transition disabled:opacity-50 shadow-sm w-full sm:w-auto min-w-0"
            title="Simulate blind 3x retries without diagnosis or guardrails"
          >
            <Layers className={`w-3.5 h-3.5 shrink-0 ${loadingBaseline ? 'animate-spin' : ''}`} />
            <span className="truncate">1. Blind Retry</span>
          </button>

          <button
            onClick={onRunRuleBaseline}
            disabled={loadingReset || loadingBatch || loadingBaseline || loadingRuleBaseline}
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-purple-200 bg-purple-950/70 hover:bg-purple-900/80 active:bg-purple-800 border border-purple-700/80 rounded-lg transition disabled:opacity-50 shadow-sm w-full sm:w-auto min-w-0"
            title="Simulate simple static rule-based recovery"
          >
            <Binary className={`w-3.5 h-3.5 shrink-0 ${loadingRuleBaseline ? 'animate-spin' : ''}`} />
            <span className="truncate">2. Rule Baseline</span>
          </button>

          <button
            onClick={onRunBatch}
            disabled={loadingReset || loadingBatch || loadingBaseline || loadingRuleBaseline}
            className="flex items-center justify-center gap-1 px-3 sm:px-3.5 py-2 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:from-sky-700 active:to-indigo-700 rounded-lg shadow-md shadow-sky-600/30 transition disabled:opacity-50 w-full sm:w-auto min-w-0"
            title="Run AI Diagnosis & Policy Recovery across all 100 records"
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${loadingBatch ? 'animate-spin' : ''}`} />
            <span className="truncate">{loadingBatch ? 'Simulating...' : '3. Run RecoverAI'}</span>
          </button>
        </div>

      </div>

      {/* Why AI & Safety Banner */}
      <div className="max-w-7xl mx-auto mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-slate-400 gap-2 w-full min-w-0">
        <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="font-semibold text-sky-400 flex items-center gap-1 shrink-0">
            <Info className="w-3.5 h-3.5 shrink-0" /> Core Principle:
          </span>
          <span className="text-[11px] sm:text-xs leading-tight font-medium text-slate-300">AI Recommends. Economics Evaluates. Policy Engine Decides.</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-800 text-[11px] max-w-full min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="leading-tight">Zero-Trust AI Boundary: Policy Engine is the sole execution authority</span>
        </div>
      </div>
    </header>
  );
}
