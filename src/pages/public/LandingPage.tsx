import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  Check,
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  BarChart3,
  CreditCard,
  ArrowRight,
  Sparkles,
  Users,
  HardDrive,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { plans } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Full-Featured SaaS Subscription & Billing Simulator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Modern Subscription Management for Next-Gen SaaS
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Explore dynamic subscription tiers, monitor real-time resource limits, simulate instant sandbox checkouts, and administer multi-tenant billing from an unified control dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/pricing"
                id="hero-explore-pricing-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-base"
              >
                <span>View Pricing & Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {currentUser ? (
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  id="hero-dashboard-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all text-base"
                >
                  <span>Go to {currentUser.role === 'admin' ? 'Admin Console' : 'Dashboard'}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    id="hero-register-btn"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-all text-base"
                  >
                    <span>Create Customer Account</span>
                  </Link>
                  <Link
                    to="/login"
                    id="hero-login-btn"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all text-base"
                  >
                    <span>Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust and Sandbox Guarantee */}
            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Simulated Sandbox</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero External API Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Client-Side LocalStorage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bento Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Enterprise Billing Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for the Full Subscription Lifecycle
            </h3>
            <p className="text-sm text-slate-600">
              Everything required to model modern SaaS billing operations, from user upgrade journeys to administrative revenue analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Seamless Subscription Upgrades</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upgrade, downgrade, cancel, or reactivate plans in a single click. Review mock invoice receipts, payment dates, and billing periods.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Instant checkout confirmation modal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Simulated invoice generator with invoice IDs</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Real-Time Resource Limits</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visual progress meters track active projects, storage volume, and team member seats against current plan quotas with warning states.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Interactive usage simulator for testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Adaptive threshold coloring (75% / 90% warnings)</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Admin Telemetry & Plan Builder</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Administrators can inspect MRR, review customer accounts, cancel delinquent subscriptions, and add or adjust plan features on the fly.
              </p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600" />
                  <span>Visual charts for plan distribution & MRR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600" />
                  <span>Full CRUD for subscription plans and users</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Preview Cards */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Clear & Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Choose the Plan Built for Your Scale
            </h3>
            <p className="text-sm text-slate-600">
              Start free with no credit card required, or scale to Pro and Business as your team expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map(plan => {
              const isFree = plan.price === 0;
              const isPro = plan.id === 'plan_pro';

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl bg-white p-8 transition-all ${
                    isPro
                      ? 'border-2 border-blue-600 shadow-lg ring-4 ring-blue-50'
                      : 'border border-slate-200/90 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-xs">
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                      <span className="text-sm text-slate-500">/month</span>
                    </div>
                  </div>

                  {/* Limits Highlights */}
                  <div className="py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-6">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-600" /> Projects:
                      </span>
                      <span className="font-semibold text-slate-900">
                        {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-emerald-600" /> Storage:
                      </span>
                      <span className="font-semibold text-slate-900">{plan.limits.storageGB} GB</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> Team Seats:
                      </span>
                      <span className="font-semibold text-slate-900">{plan.limits.teamMembers}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600 flex-1 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/pricing"
                    className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                      isPro
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {isFree ? 'Start Free' : `Select ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Experience the SaaS Platform?
          </h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Register your own customer account to try out plan upgrades, simulated card checkouts, and real-time usage metrics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {currentUser ? (
              <Link
                to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-colors"
              >
                Go to {currentUser.role === 'admin' ? 'Admin Console' : 'Customer Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-colors"
                >
                  Create Customer Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  Sign In to Existing Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
