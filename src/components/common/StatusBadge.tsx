import React from 'react';
import { SubscriptionStatus, TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: SubscriptionStatus | TransactionStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';
  let label = status;

  if (normalized === 'active' || normalized === 'paid') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
    label = normalized === 'active' ? 'Active' : 'Paid';
  } else if (normalized === 'canceled' || normalized === 'failed') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
    label = normalized === 'canceled' ? 'Canceled' : 'Failed';
  } else if (normalized === 'pending' || normalized === 'past_due' || normalized === 'trialing') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
    label = normalized === 'past_due' ? 'Past Due' : normalized === 'trialing' ? 'Trialing' : 'Pending';
  } else if (normalized === 'admin') {
    bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotClass = 'bg-indigo-500';
    label = 'Admin';
  } else if (normalized === 'user') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
    dotClass = 'bg-blue-500';
    label = 'Customer';
  }

  return (
    <span
      id={`status-badge-${normalized}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
};
