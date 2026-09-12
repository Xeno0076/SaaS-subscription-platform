import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Layers,
  ArrowUpRight,
  Shield,
  Activity,
  UserPlus,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { users } = useAuth();
  const { plans, subscriptions, transactions } = useSubscription();

  // 1. Total Users
  const totalUsersCount = users.length;

  // 2. Active Subscriptions
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const activeSubsCount = activeSubs.length;

  // 3. Monthly Recurring Revenue (MRR) calculation:
  // sum of prices of active paid plans
  const mrr = activeSubs.reduce((acc, sub) => {
    const plan = plans.find(p => p.id === sub.planId);
    return acc + (plan?.price || 0);
  }, 0);

  // 4. Total Revenue: sum of all paid transactions
  const totalRevenue = transactions.reduce((acc, tx) => {
    return acc + (tx.status === 'paid' ? tx.amount : 0);
  }, 0);

  // 5. Subscription Distribution by Plan
  const planDistribution = plans.map(plan => {
    const count = subscriptions.filter(s => s.planId === plan.id && s.status === 'active').length;
    return {
      name: plan.name,
      value: count,
      price: plan.price,
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];

  // Monthly Revenue Trend (Mock 6-month data)
  const revenueTrendData = [
    { month: 'Apr', revenue: 45, mrr: 38 },
    { month: 'May', revenue: 58, mrr: 47 },
    { month: 'Jun', revenue: 76, mrr: 67 },
    { month: 'Jul', revenue: 95, mrr: 85 },
    { month: 'Aug', revenue: 114, mrr: 95 },
    { month: 'Sep', revenue: totalRevenue, mrr: mrr },
  ];

  const recentTransactions = transactions.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Telemetry & Revenue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant monitoring of customer subscriptions, MRR, and platform metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/plans"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Plans</span>
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Directory</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalUsersCount}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">↑ 100%</span> Active directory
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Subscriptions</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activeSubsCount}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Across {plans.length} subscription tiers
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Recurring (MRR)</p>
              <h3 className="text-2xl font-bold text-white mt-1">${mrr}.00</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">↑ 18.4%</span> vs previous cycle
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue Collected</p>
              <h3 className="text-2xl font-bold text-white mt-1">${totalRevenue}.00</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {transactions.length} total processed invoices
          </div>
        </div>
      </div>

      {/* Charts Row: Plan Distribution & Revenue Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Distribution Donut Chart */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Subscription Distribution by Plan</h2>
              <p className="text-xs text-slate-400">Active customer distribution across tier offerings</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {activeSubsCount} Active Subscriptions
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MRR & Revenue Growth Bar Chart */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Monthly Revenue Trajectory</h2>
              <p className="text-xs text-slate-400">Revenue and MRR run-rate trend (USD)</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
              Live Simulated
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Total Revenue ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mrr" name="MRR ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Tables Grid: Recent Subscriptions / Users & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Accounts Overview */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Registered Users</h2>
            <Link
              to="/admin/users"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage Users ({users.length}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-700/60 text-xs">
            {recentUsers.map(u => {
              const userSub = subscriptions.find(s => s.userId === u.id);
              const userPlan = plans.find(p => p.id === userSub?.planId) || plans[0];

              return (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 font-bold flex items-center justify-center">
                        {u.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-semibold">
                      {userPlan.name}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5 capitalize">{u.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Transactions</h2>
            <Link
              to="/admin/subscriptions"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              All Subscriptions →
            </Link>
          </div>

          <div className="divide-y divide-slate-700/60 text-xs">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-indigo-400">{tx.invoiceNumber}</div>
                  <div className="text-[11px] text-slate-400">{tx.planName}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">${tx.amount}.00</div>
                  <StatusBadge status={tx.status} className="mt-0.5 scale-90 origin-right" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
