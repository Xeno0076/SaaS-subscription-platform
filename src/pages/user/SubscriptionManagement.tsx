import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { CheckoutModal } from '../../components/checkout/CheckoutModal';
import { Plan } from '../../types';
import {
  CreditCard,
  Check,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  FolderGit2,
  HardDrive,
  Users,
} from 'lucide-react';

export const SubscriptionManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    plans,
    getUserPlan,
    getUserSubscription,
    cancelSubscription,
    reactivateSubscription,
    subscribeToPlan,
  } = useSubscription();

  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState('');

  if (!currentUser) return null;

  const currentPlan = getUserPlan(currentUser.id);
  const currentSub = getUserSubscription(currentUser.id);

  const isCanceled = currentSub?.status === 'canceled' || currentSub?.cancelAtPeriodEnd;

  const handlePlanClick = (plan: Plan) => {
    if (plan.id === currentPlan.id && !isCanceled) return;

    if (plan.price === 0) {
      subscribeToPlan(currentUser.id, plan.id, 'Free Plan Tier');
      setFeedbackNotice('Your account has been switched to the Free plan tier.');
      return;
    }

    setSelectedPlanForCheckout(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelSubscription(currentUser.id);
    setIsCancelModalOpen(false);
    setFeedbackNotice('Your subscription cancellation has been scheduled for the end of the billing period.');
  };

  const handleReactivate = () => {
    reactivateSubscription(currentUser.id);
    setFeedbackNotice('Subscription successfully reactivated! Auto-renewal restored.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Subscription & Billing Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upgrade, downgrade, cancel, or renew your subscription tier in real-time
        </p>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{feedbackNotice}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Active Plan Status Hero Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Tier
              </span>
              <StatusBadge status={currentSub?.status || 'active'} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              {currentPlan.name} Plan
              <span className="text-sm font-normal text-slate-500">
                (${currentPlan.price}/month)
              </span>
            </h2>
          </div>

          {/* Cancel or Reactivate Action Button */}
          <div className="flex items-center gap-2">
            {isCanceled ? (
              <button
                id="reactivate-sub-btn"
                type="button"
                onClick={handleReactivate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reactivate Subscription</span>
              </button>
            ) : currentPlan.price > 0 ? (
              <button
                id="cancel-sub-btn"
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Subscription</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Next Billing Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 block mb-1">Billing Cycle</span>
            <span className="font-bold text-slate-800 capitalize">{currentPlan.billingCycle}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 block mb-1">Next Billing Date</span>
            <span className="font-bold text-slate-800">
              {currentSub?.nextBillingDate
                ? new Date(currentSub.nextBillingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Lifetime / Free'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 block mb-1">Renewal Status</span>
            <span
              className={`font-bold ${
                isCanceled ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isCanceled ? 'Will not renew' : 'Auto-renew enabled'}
            </span>
          </div>
        </div>

        {isCanceled && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Your subscription is marked as canceled. You retain access until the end of your billing cycle ({new Date(currentSub?.nextBillingDate || '').toLocaleDateString()}). You can reactivate at any time.
            </span>
          </div>
        )}
      </div>

      {/* Available Plans Selector */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Change or Upgrade Plan</h2>
          <p className="text-xs text-slate-500">
            Select an alternative tier below to instantly simulate a plan transition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => {
            const isCurrent = currentPlan.id === plan.id && !isCanceled;
            const isPro = plan.id === 'plan_pro';
            const isFree = plan.price === 0;

            let actionText = 'Select Plan';
            if (isCurrent) {
              actionText = 'Current Plan';
            } else if (plan.price > currentPlan.price) {
              actionText = `Upgrade to ${plan.name}`;
            } else if (plan.price < currentPlan.price) {
              actionText = `Downgrade to ${plan.name}`;
            }

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl bg-white p-6 transition-all ${
                  isCurrent
                    ? 'border-2 border-emerald-500 shadow-sm ring-4 ring-emerald-50'
                    : isPro
                    ? 'border-2 border-blue-600 shadow-sm ring-4 ring-blue-50'
                    : 'border border-slate-200/90 shadow-xs'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                    Current Plan
                  </div>
                )}
                {!isCurrent && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="text-xs text-slate-500">/month</span>
                  </div>
                </div>

                <div className="py-2.5 px-3 bg-slate-50 rounded-xl mb-4 text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Projects:</span>
                    <span className="font-semibold">
                      {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="font-semibold">{plan.limits.storageGB} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Seats:</span>
                    <span className="font-semibold">{plan.limits.teamMembers}</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 flex-1 mb-6">
                  {plan.features.slice(0, 5).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  id={`btn-plan-manage-${plan.id}`}
                  disabled={isCurrent}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : plan.price > currentPlan.price
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {actionText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Confirm Subscription Cancellation"
        subtitle="You will keep your plan benefits until the end of your billing cycle"
        maxWidth="sm"
        id="cancel-subscription-modal"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
            <p className="font-semibold">Are you sure you want to cancel?</p>
            <p>
              Your plan will remain active until{' '}
              <span className="font-bold">
                {currentSub?.nextBillingDate
                  ? new Date(currentSub.nextBillingDate).toLocaleDateString()
                  : 'the end of the cycle'}
              </span>
              . After that date, your account will downgrade to the Free tier.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Keep Subscription
            </button>
            <button
              id="confirm-cancellation-btn"
              onClick={handleConfirmCancel}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={selectedPlanForCheckout}
        onSuccess={() => {
          setFeedbackNotice(`Successfully subscribed to the ${selectedPlanForCheckout?.name} plan!`);
        }}
      />
    </div>
  );
};
