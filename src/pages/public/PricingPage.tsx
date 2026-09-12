import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { CheckoutModal } from '../../components/checkout/CheckoutModal';
import { Plan } from '../../types';
import {
  Check,
  X,
  CreditCard,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ArrowRight,
  FolderGit2,
  HardDrive,
  Users,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { plans, getUserPlan, getUserSubscription, subscribeToPlan } = useSubscription();
  const navigate = useNavigate();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = currentUser ? getUserPlan(currentUser.id) : null;
  const currentSub = currentUser ? getUserSubscription(currentUser.id) : null;

  const handleSelectPlan = async (plan: Plan) => {
    if (!currentUser) {
      // Guide unauthenticated users to register or sign in
      navigate('/login');
      return;
    }

    if (plan.price === 0) {
      // Free plan directly activates
      await subscribeToPlan(currentUser.id, plan.id, 'Free Plan Tier');
      navigate('/dashboard');
      return;
    }

    // Paid plan triggers mock payment checkout modal
    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const comparisonFeatures = [
    { name: 'Active Projects', free: '2 Projects', pro: '10 Projects', business: 'Unlimited' },
    { name: 'Cloud Storage', free: '1 GB', pro: '10 GB', business: '100 GB' },
    { name: 'Team Member Seats', free: '1 Member', pro: '5 Members', business: '20 Members' },
    { name: 'SSL Security & Encryption', free: true, pro: true, business: true },
    { name: 'Support Channels', free: 'Community Forum', pro: 'Priority Email & Chat', business: '24/7 Dedicated Manager' },
    { name: 'Automated Backups', free: 'Weekly', pro: 'Daily', business: 'Hourly Continuous' },
    { name: 'Custom Webhooks & API', free: false, pro: true, business: true },
    { name: 'Single Sign-On (SAML / SSO)', free: false, pro: false, business: true },
    { name: 'Enterprise SLA Guarantee', free: false, pro: false, business: '99.99%' },
    { name: 'Audit Log Retention', free: '7 Days', pro: '90 Days', business: '365 Days' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Pricing Header */}
      <section className="pt-12 pb-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Plan Selection & Mock Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Flexible Plans for Teams of Every Size
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Test upgrades, downgrades, and realistic checkout confirmation in a simulated test environment.
          </p>

          {/* Monthly / Annual Notice */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800">
              Monthly Subscription Plans (Standard SaaS Billing)
            </span>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map(plan => {
            const isCurrent = currentPlan?.id === plan.id && currentSub?.status === 'active';
            const isPro = plan.id === 'plan_pro';
            const isFree = plan.price === 0;

            let buttonLabel = 'Select Plan';
            if (isCurrent) {
              buttonLabel = 'Current Active Plan';
            } else if (currentPlan && currentPlan.price > plan.price) {
              buttonLabel = `Downgrade to ${plan.name}`;
            } else if (currentPlan && currentPlan.price < plan.price) {
              buttonLabel = `Upgrade to ${plan.name}`;
            } else if (isFree) {
              buttonLabel = 'Get Started Free';
            }

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl bg-white p-8 transition-all ${
                  isCurrent
                    ? 'border-2 border-emerald-500 shadow-md ring-4 ring-emerald-50'
                    : isPro
                    ? 'border-2 border-blue-600 shadow-lg ring-4 ring-blue-50'
                    : 'border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Badges */}
                {isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-xs">
                    Your Active Plan
                  </div>
                )}
                {!isCurrent && plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                </div>

                {/* Quota Highlights */}
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl mb-6 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-600" /> Projects:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {plan.limits.projects === -1 ? 'Unlimited' : `${plan.limits.projects}`}
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

                {/* Feature List */}
                <ul className="space-y-3 text-xs text-slate-600 flex-1 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  id={`select-plan-${plan.id}`}
                  disabled={isCurrent}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isPro
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Matrix Table */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Compare Plan Features</h2>
          <p className="text-xs text-slate-500 mt-1">
            Detailed breakdown of capabilities across all subscription tiers
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 w-2/5">Capability</th>
                  <th className="py-4 px-6 text-center">Free</th>
                  <th className="py-4 px-6 text-center text-blue-600">Pro ($9)</th>
                  <th className="py-4 px-6 text-center text-indigo-600">Business ($29)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {comparisonFeatures.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-6 text-center text-slate-600">
                      {typeof item.free === 'boolean' ? (
                        item.free ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        item.free
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-slate-800 bg-blue-50/20">
                      {typeof item.pro === 'boolean' ? (
                        item.pro ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        item.pro
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-slate-800">
                      {typeof item.business === 'boolean' ? (
                        item.business ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        item.business
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Checkout Confirmation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlanForCheckout}
        onSuccess={() => {
          navigate('/dashboard');
        }}
      />

      <Footer />
    </div>
  );
};
