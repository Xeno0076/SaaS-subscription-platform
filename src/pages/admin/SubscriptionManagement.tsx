import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Subscription } from '../../types';
import {
  CreditCard,
  Search,
  Filter,
  XCircle,
  RotateCcw,
  Check,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const SubscriptionManagement: React.FC = () => {
  const { users } = useAuth();
  const {
    subscriptions,
    plans,
    adminCancelSubscription,
    subscribeToPlan,
    reactivateSubscription,
  } = useSubscription();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [selectedSubToChange, setSelectedSubToChange] = useState<Subscription | null>(null);
  const [newPlanSelection, setNewPlanSelection] = useState('plan_pro');

  const filtered = subscriptions.filter(sub => {
    const user = users.find(u => u.id === sub.userId);
    const plan = plans.find(p => p.id === sub.planId);
    const userName = user?.name || '';
    const userEmail = user?.email || '';
    const planName = plan?.name || '';

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAdminCancel = (sub: Subscription) => {
    if (window.confirm(`Cancel subscription ${sub.id}?`)) {
      adminCancelSubscription(sub.id);
      setFeedback(`Subscription ${sub.id} canceled.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleAdminReactivate = (sub: Subscription) => {
    reactivateSubscription(sub.userId);
    setFeedback(`Subscription ${sub.id} reactivated.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleChangePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubToChange) return;

    await subscribeToPlan(
      selectedSubToChange.userId,
      newPlanSelection,
      'Admin Override Provisioning'
    );
    setSelectedSubToChange(null);
    setFeedback(`User subscription updated to new plan!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Subscription Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View all active and historical tenant subscriptions with manual override capabilities
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-subscriptions-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer, email, plan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            id="filter-subscriptions-status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active Only</option>
            <option value="canceled">Canceled Only</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-6">Subscriber</th>
                <th className="py-3.5 px-6">Plan Tier</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Started Date</th>
                <th className="py-3.5 px-6">Next Billing</th>
                <th className="py-3.5 px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-xs">
              {filtered.map(sub => {
                const user = users.find(u => u.id === sub.userId);
                const plan = plans.find(p => p.id === sub.planId) || plans[0];
                const isCanceled = sub.status === 'canceled' || sub.cancelAtPeriodEnd;

                return (
                  <tr key={sub.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-white">{user?.name || 'Unknown User'}</div>
                      <div className="text-[11px] text-slate-400">{user?.email}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-slate-200">
                        {plan.name}
                        <span className="text-slate-400 text-[11px]"> (${plan.price}/mo)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{sub.id}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-slate-300 font-medium">
                      {sub.nextBillingDate
                        ? new Date(sub.nextBillingDate).toLocaleDateString()
                        : 'Lifetime'}
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <button
                        id={`admin-change-plan-${sub.id}`}
                        onClick={() => {
                          setSelectedSubToChange(sub);
                          setNewPlanSelection(sub.planId);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        Change Plan
                      </button>
                      {isCanceled ? (
                        <button
                          onClick={() => handleAdminReactivate(sub)}
                          className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Reactivate
                        </button>
                      ) : plan.price > 0 ? (
                        <button
                          onClick={() => handleAdminCancel(sub)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Plan Admin Modal */}
      <Modal
        isOpen={Boolean(selectedSubToChange)}
        onClose={() => setSelectedSubToChange(null)}
        title="Admin Plan Override"
        subtitle="Manually switch this user to a different subscription plan"
        maxWidth="md"
        id="admin-change-plan-modal"
      >
        <form onSubmit={handleChangePlanSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select New Tier</label>
            <select
              value={newPlanSelection}
              onChange={e => setNewPlanSelection(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price}/mo) — Limits: {p.limits.projects === -1 ? 'Unlimited' : p.limits.projects} projects, {p.limits.storageGB} GB
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-700">
            This will update the user's active subscription, calculate new quota limits, and reflect immediately on their customer dashboard.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedSubToChange(null)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Apply Plan Change
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
