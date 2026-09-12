import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { StatusBadge } from '../common/StatusBadge';
import { UsageSimulatorModal } from '../usage/UsageSimulatorModal';
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  User as UserIcon,
  Sliders,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';

export const UserLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getUserPlan, getUserSubscription } = useSubscription();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xs border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <UserIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
            <p className="text-sm text-slate-600">
              Please log in to view and manage your user subscription dashboard.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Sign In to Account
              </Link>
              <button
                onClick={() => {
                  navigate('/');
                }}
                className="w-full py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPlan = getUserPlan(currentUser.id);
  const currentSub = getUserSubscription(currentUser.id);

  const navItems = [
    { to: '/dashboard', label: 'User Dashboard', icon: LayoutDashboard, end: true },
    { to: '/billing', label: 'Subscription & Plans', icon: CreditCard },
    { to: '/billing-history', label: 'Billing History', icon: Receipt },
    { to: '/profile', label: 'Account Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>Dashboard Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{currentPlan.name} Plan</span>
            <StatusBadge status={currentSub?.status || 'active'} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Sidebar */}
          <aside
            className={`lg:col-span-1 space-y-4 ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4">
              {/* User Profile Mini Snippet */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </NavLink>
                  );
                })}
              </nav>

              {/* Current Plan Mini Card */}
              <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Current Plan
                  </span>
                  <StatusBadge status={currentSub?.status || 'active'} className="scale-90 origin-right" />
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-bold">{currentPlan.name}</div>
                  <div className="text-sm text-slate-300 font-medium">
                    ${currentPlan.price}<span className="text-xs text-slate-400">/mo</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentSub?.cancelAtPeriodEnd
                    ? 'Cancels at end of current period'
                    : `Next billing: ${
                        currentSub?.nextBillingDate
                          ? new Date(currentSub.nextBillingDate).toLocaleDateString()
                          : 'Active'
                      }`}
                </p>

                <div className="pt-1 flex gap-1.5">
                  <Link
                    to="/billing"
                    className="flex-1 text-center py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Change Plan
                  </Link>
                </div>
              </div>

              {/* Interactive Demo Usage Simulator Trigger */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  id="open-usage-simulator-btn"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Usage & Limits</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Test limit warnings & progress bar reactivity
                </p>
              </div>
            </div>
          </aside>

          {/* Main User Content View */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>

      <UsageSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <Footer />
    </div>
  );
};
