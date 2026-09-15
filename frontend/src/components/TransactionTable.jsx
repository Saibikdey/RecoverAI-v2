import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  Flame
} from 'lucide-react';

export default function TransactionTable({ 
  payments, 
  onDiagnosePayment, 
  loadingPaymentId 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [errorFilter, setErrorFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState('ALL'); // 'ALL', 'OVERRIDES', 'FRAUD', 'RECOVERED'

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const isPolicyOverride = (p) => {
    return (
      p.error_code === 'DO_NOT_HONOR' || 
      p.error_code === 'SUSPECTED_FRAUD' || 
      p.error_code === 'CARD_EXPIRED' ||
      p.retry_count >= 3 ||
      (p.amount >= 50000 && p.customer_tier === 'VIP')
    );
  };

  const getOverrideBadge = (payment) => {
    if (payment.error_code === 'DO_NOT_HONOR') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-0.5 shrink-0" title="Confidence < 0.65 triggers automatic Confidence Threshold override to ESCALATE">
          <ShieldAlert className="w-2.5 h-2.5 shrink-0" /> Confidence Override
        </span>
      );
    }
    if (payment.error_code === 'SUSPECTED_FRAUD') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-0.5 shrink-0" title="Fraud Zero-Tolerance Guard enforces NO_ACTION and blocks all retries">
          <Lock className="w-2.5 h-2.5 shrink-0" /> Fraud Guard
        </span>
      );
    }
    if (payment.error_code === 'CARD_EXPIRED') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-950 text-sky-300 border border-sky-700 flex items-center gap-0.5 shrink-0" title="Expired Card Guard strictly prevents retries, routing to ALTERNATE_PAYMENT">
          <ShieldCheck className="w-2.5 h-2.5 shrink-0" /> Expired Guard
        </span>
      );
    }
    if (payment.retry_count >= 3) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-700 flex items-center gap-0.5 shrink-0" title="Max Retries Guard blocks further retry attempts">
          <ShieldAlert className="w-2.5 h-2.5 shrink-0" /> Max Retries Guard
        </span>
      );
    }
    return null;
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-orange-300 border border-orange-800">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">LOW</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> RECOVERED</span>;
      case 'FRAUD_BLOCKED':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/70 border border-purple-800/80 px-2 py-0.5 rounded-full"><Lock className="w-3 h-3" /> FRAUD BLOCKED</span>;
      case 'FAILED':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/70 border border-rose-800/80 px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3" /> FAILED</span>;
      case 'PERMANENTLY_FAILED':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full"><XCircle className="w-3 h-3" /> PERMANENT FAIL</span>;
      default:
        return <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  const getActionBadge = (action) => {
    if (!action) return <span className="text-slate-500 italic text-[11px]">Pending</span>;
    switch (action) {
      case 'RETRY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">RETRY</span>;
      case 'ALTERNATE_PAYMENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">ALT_PAYMENT</span>;
      case 'REMINDER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">REMINDER</span>;
      case 'ESCALATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800">ESCALATE</span>;
      case 'NO_ACTION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">NO_ACTION</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">{action}</span>;
    }
  };

  // Compute counts for quick pills
  const overrideCount = payments.filter(isPolicyOverride).length;
  const fraudCount = payments.filter(p => p.error_code === 'SUSPECTED_FRAUD').length;
  const recoveredCount = payments.filter(p => p.status === 'RECOVERED').length;

  // Filter & search logic
  const filtered = payments.filter((p) => {
    const matchesSearch = 
      p.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.error_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesError = errorFilter === 'ALL' || p.error_code === errorFilter;
    const matchesTier = tierFilter === 'ALL' || p.customer_tier === tierFilter;

    let matchesQuick = true;
    if (quickFilter === 'OVERRIDES') {
      matchesQuick = isPolicyOverride(p);
    } else if (quickFilter === 'FRAUD') {
      matchesQuick = p.error_code === 'SUSPECTED_FRAUD';
    } else if (quickFilter === 'RECOVERED') {
      matchesQuick = p.status === 'RECOVERED';
    }

    return matchesSearch && matchesStatus && matchesError && matchesTier && matchesQuick;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-md overflow-hidden w-full max-w-full min-w-0">
      
      {/* Quick Filter Pill Buttons */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Quick Filters:
        </span>
        <button
          onClick={() => setQuickFilter('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            quickFilter === 'ALL'
              ? 'bg-slate-700 text-white font-semibold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All ({payments.length})
        </button>
        <button
          onClick={() => setQuickFilter('OVERRIDES')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
            quickFilter === 'OVERRIDES'
              ? 'bg-amber-900 text-amber-100 font-semibold border border-amber-600'
              : 'bg-amber-950/40 text-amber-300 hover:bg-amber-950/70 border border-amber-800/60'
          }`}
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Policy Overrides ({overrideCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('FRAUD')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
            quickFilter === 'FRAUD'
              ? 'bg-rose-900 text-rose-100 font-semibold border border-rose-600'
              : 'bg-rose-950/40 text-rose-300 hover:bg-rose-950/70 border border-rose-800/60'
          }`}
        >
          <Lock className="w-3 h-3 text-rose-400" />
          <span>Fraud Contained ({fraudCount})</span>
        </button>
        <button
          onClick={() => setQuickFilter('RECOVERED')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
            quickFilter === 'RECOVERED'
              ? 'bg-emerald-900 text-emerald-100 font-semibold border border-emerald-600'
              : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-800/60'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Recovered ({recoveredCount})</span>
        </button>
      </div>

      {/* Table Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search transaction, customer, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-600"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2 w-full md:w-auto min-w-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="FAILED">Failed</option>
            <option value="RECOVERED">Recovered</option>
            <option value="FRAUD_BLOCKED">Fraud Blocked</option>
          </select>

          {/* Error Code Filter */}
          <select
            value={errorFilter}
            onChange={(e) => setErrorFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">All Failure Reasons</option>
            <option value="INSUFFICIENT_FUNDS">Insufficient Funds</option>
            <option value="CARD_EXPIRED">Card Expired</option>
            <option value="BANK_SERVER_DOWN">Bank Server Down</option>
            <option value="NETWORK_TIMEOUT">Network Timeout</option>
            <option value="AUTHENTICATION_FAILED_3DS">3DS Failed</option>
            <option value="LIMIT_EXCEEDED">Limit Exceeded</option>
            <option value="SUSPECTED_FRAUD">Suspected Fraud</option>
            <option value="DO_NOT_HONOR">Do Not Honor</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">All Customer Tiers</option>
            <option value="STANDARD">Standard</option>
            <option value="VIP">VIP</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>

          <span className="text-xs text-slate-500 w-full sm:w-auto text-left sm:text-right md:ml-auto col-span-1 sm:col-span-3 md:col-span-1">
            Showing <strong className="text-slate-300">{filtered.length}</strong> of {payments.length}
          </span>
        </div>

      </div>

      {/* Table Element */}
      <div className="overflow-x-auto w-full max-w-full min-w-0">
        <table className="w-full min-w-[760px] text-left text-xs text-slate-300">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Tx ID / Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Failure Reason</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3">Authorized Action</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Inspect Pipeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-slate-500">
                  No payment records match the current filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((payment) => {
                const isLoading = loadingPaymentId === payment.id;
                const overrideBadge = getOverrideBadge(payment);
                const isDemoExample = payment.id === 46 || payment.transaction_id === 'pay_fail_046_5050';

                return (
                  <tr 
                    key={payment.id} 
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isDemoExample ? 'bg-sky-950/20 border-l-2 border-l-sky-500' : ''
                    }`}
                  >
                    {/* Tx & Customer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-sky-400 font-medium">
                          {payment.transaction_id}
                        </span>
                        {isDemoExample && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-900 text-sky-200 border border-sky-600">
                            DEMO OVERRIDE
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                        {payment.customer_name}
                        {payment.customer_tier === 'VIP' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800">VIP</span>
                        )}
                        {payment.customer_tier === 'ENTERPRISE' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">ENT</span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatINR(payment.amount)}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3 text-slate-400">
                      {payment.payment_method}
                    </td>

                    {/* Failure Reason & Override Tag */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] text-rose-300 font-medium">
                          {payment.error_code}
                        </span>
                        {overrideBadge}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                        {payment.error_message}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="px-4 py-3">
                      {getRiskBadge(payment.risk_level)}
                    </td>

                    {/* AI Action Taken */}
                    <td className="px-4 py-3">
                      {getActionBadge(payment.recovery_action_taken)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {getStatusBadge(payment.status)}
                    </td>

                    {/* Trigger Button */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDiagnosePayment(payment)}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition disabled:opacity-50 ${
                          isDemoExample 
                            ? 'text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30'
                            : 'text-sky-300 bg-sky-950/80 hover:bg-sky-900 active:bg-sky-800 border border-sky-700/80'
                        }`}
                      >
                        <Sparkles className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Diagnosing...' : 'Diagnose'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
