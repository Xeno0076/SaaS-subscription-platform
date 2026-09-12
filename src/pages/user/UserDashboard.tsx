import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatCard } from '../../components/common/StatCard';
import { UsageSimulatorModal } from '../../components/usage/UsageSimulatorModal';
import {
  CreditCard,
  FolderGit2,
  HardDrive,
  Users,
  Calendar,
  ArrowUpRight,
  Receipt,
  AlertTriangle,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    getUserPlan,
    getUserSubscription,
    getUserTransactions,
    getUserUsage,
  } = useSubscription();
  const navigate = useNavigate();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  if (!currentUser) return null;

  const currentPlan = getUserPlan(currentUser.id);
  const currentSub = getUserSubscription(currentUser.id);
  const transactions = getUserTransactions(currentUser.id);
  const usage = getUserUsage(currentUser.id);

  // Calculate project limit percentages
  const isProjectsUnlimited = currentPlan.limits.projects === -1;
  const projectPct = isProjectsUnlimited
    ? 25
    : Math.round((usage.projectsUsed / currentPlan.limits.projects) * 100);
  const storagePct = Math.round((usage.storageUsedGB / currentPlan.limits.storageGB) * 100);
  const memberPct = Math.round((usage.teamMembersUsed / currentPlan.limits.teamMembers) * 100);

  const isNearLimit = (!isProjectsUnlimited && projectPct >= 80) || storagePct >= 80 || memberPct >= 80;

  // Mock activity chart data for Recharts
  const activityData = [
    { day: 'Mon', requests: 120, storageMB: 310 },
    { day: 'Tue', requests: 190, storageMB: 480 },
    { day: 'Wed', requests: 240, storageMB: 520 },
    { day: 'Thu', requests: 310, storageMB: 610 },
    { day: 'Fri', requests: 420, storageMB: 750 },
    { day: 'Sat', requests: 280, storageMB: 690 },
    { day: 'Sun', requests: 360, storageMB: 820 },
  ];

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Plan Summary Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Hello, {currentUser.name}
              </h1>
              <StatusBadge status={currentSub?.status || 'active'} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Workspace: <span className="font-semibold text-slate-700">{currentUser.company || 'Personal'}</span> • ID: {currentUser.id}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="dash-simulate-btn"
              onClick={() => setIsSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate Usage Metrics</span>
            </button>
            <Link
              to="/billing"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Manage Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Warning Banner if Near Limit */}
        {isNearLimit && (
          <div className="mt-5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Quota Alert:</span> You are approaching your plan limits ({Math.max(projectPct, storagePct, memberPct)}% reached). Upgrade to prevent interruptions.
              </div>
            </div>
            <Link
              to="/billing"
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shrink-0 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>

      {/* Subscription KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Plan"
          value={currentPlan.name}
          icon={CreditCard}
          subtitle={`$${currentPlan.price}/month • ${currentPlan.billingCycle}`}
          colorScheme="blue"
        />
        <StatCard
          title="Subscription Status"
          value={currentSub?.status === 'active' ? 'Active' : 'Canceled'}
          icon={CheckCircle2}
          subtitle={
            currentSub?.cancelAtPeriodEnd
              ? 'Ends at period end'
              : 'Auto-renews monthly'
          }
          colorScheme={currentSub?.status === 'active' ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Next Billing Date"
          value={
            currentSub?.nextBillingDate
              ? new Date(currentSub.nextBillingDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'
          }
          icon={Calendar}
          subtitle={currentPlan.price === 0 ? 'Free tier (no charge)' : `$${currentPlan.price}.00 due`}
          colorScheme="indigo"
        />
        <StatCard
          title="Total Paid to Date"
          value={`$${transactions.reduce((acc, t) => acc + (t.status === 'paid' ? t.amount : 0), 0)}`}
          icon={Receipt}
          subtitle={`${transactions.length} total invoice transactions`}
          colorScheme="emerald"
        />
      </div>

      {/* Usage Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Progress Meters */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Resource Quota Tracking</h2>
              <p className="text-xs text-slate-500">
                Live consumption calculated against your {currentPlan.name} plan maximums
              </p>
            </div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" /> Adjust Metrics
            </button>
          </div>

          <div className="space-y-5">
            <ProgressBar
              id="usage-progress-projects"
              label="Active Projects"
              current={usage.projectsUsed}
              max={currentPlan.limits.projects}
              unit="projects"
              subtext={
                isProjectsUnlimited
                  ? 'Unlimited projects allowed on this tier'
                  : `${currentPlan.limits.projects - usage.projectsUsed} projects remaining`
              }
            />

            <ProgressBar
              id="usage-progress-storage"
              label="Cloud Storage Space"
              current={usage.storageUsedGB}
              max={currentPlan.limits.storageGB}
              unit="GB"
              subtext={`${(currentPlan.limits.storageGB - usage.storageUsedGB).toFixed(1)} GB available`}
            />

            <ProgressBar
              id="usage-progress-members"
              label="Team Member Seats"
              current={usage.teamMembersUsed}
              max={currentPlan.limits.teamMembers}
              unit="seats"
              subtext={`${currentPlan.limits.teamMembers - usage.teamMembersUsed} seats remaining`}
            />
          </div>

          {/* Activity Mini Chart */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Weekly Platform API Requests
              </span>
              <span className="text-xs text-slate-400">Past 7 Days</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions & Subscription Summary Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/billing"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors text-xs font-medium text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Upgrade or Change Plan</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/billing-history"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors text-xs font-medium text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>View All Invoices & Receipts</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                onClick={() => setIsSimulatorOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors text-xs font-medium text-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Simulate Usage & Limits</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <Link
                to="/profile"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors text-xs font-medium text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Update Profile & Company</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Current Tier Perk Recap */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-blue-200">
                Your Included Perks
              </span>
              <Sparkles className="w-4 h-4 text-blue-200" />
            </div>
            <h3 className="text-lg font-bold">{currentPlan.name} Plan Tier</h3>
            <ul className="text-xs text-blue-100 space-y-1.5">
              {currentPlan.features.slice(0, 4).map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {currentPlan.price < 29 && (
              <div className="pt-2">
                <Link
                  to="/billing"
                  className="block w-full text-center py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Explore Higher Tier
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices & Transactions Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Simulated invoice charges and billing history</p>
          </div>
          <Link
            to="/billing-history"
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All ({transactions.length}) →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No transactions yet. Select a paid plan to simulate your first billing invoice.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{tx.planName}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${tx.amount}.00</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500">{tx.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UsageSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};
