import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { StatusBadge } from '../common/StatusBadge';
import {
  Shield,
  Users,
  CreditCard,
  Layers,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'admin';

  const adminNavItems = [
    { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/plans', label: 'Plan Management', icon: Layers },
    { to: '/admin/subscriptions', label: 'Subscription Management', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Navbar />

      {/* Admin Subheader Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                SaaS Admin Control Center
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Administrator Access
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage all customer subscriptions, tier limits, pricing schemas, and revenue telemetry.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentUser ? (
          <div className="max-w-md mx-auto my-12 p-8 bg-slate-800/90 rounded-2xl border border-slate-700 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Administrator Sign-In Required</h3>
            <p className="text-sm text-slate-300">
              Please sign in with the protected administrator account to view and manage system operations.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
              >
                Sign In to Admin Account
              </Link>
            </div>
          </div>
        ) : !isAdmin ? (
          <div className="max-w-xl mx-auto my-12 p-8 bg-slate-800/90 rounded-2xl border border-rose-500/30 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                Access Denied (403)
              </span>
              <h3 className="text-xl font-bold text-white">Administrator Privileges Required</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              You are currently authenticated as <span className="font-semibold text-white">{currentUser.name}</span> with a customer account (<code className="text-rose-300 bg-rose-950/50 px-1.5 py-0.5 rounded text-xs">{currentUser.email}</code>). Standard customer accounts are strictly forbidden from accessing the SaaS administration console.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                Return to Customer Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm transition-all cursor-pointer"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Admin Mobile Navigation Toggle */}
            <div className="lg:hidden flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700 mb-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span>Admin Navigation</span>
              </button>
              <span className="text-xs text-indigo-400 font-semibold">Admin Active</span>
            </div>

            {/* Admin Navigation Sidebar */}
            <aside
              className={`lg:col-span-1 space-y-4 ${
                mobileMenuOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Admin Modules
                </div>
                <nav className="space-y-1">
                  {adminNavItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs text-slate-400 space-y-1.5">
                  <div className="font-semibold text-slate-300">Live Mock Engine</div>
                  <p className="text-[11px] leading-relaxed">
                    Changes to plans, subscriptions, and users immediately synchronize to the customer dashboard via reactive context.
                  </p>
                </div>
              </div>
            </aside>

            {/* Admin Content Area */}
            <main className="lg:col-span-3">
              <Outlet />
            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
