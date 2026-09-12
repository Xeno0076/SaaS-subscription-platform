import React, { useState } from 'react';
import { Plan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Modal } from '../common/Modal';
import { CheckCircle2, CreditCard, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { subscribeToPlan } = useSubscription();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || 'Customer Name');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!plan) return null;

  const isFree = plan.price === 0;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('Please log in to complete subscription checkout.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Simulate realistic payment processing latency (1.2 seconds)
    setTimeout(async () => {
      try {
        const lastDigits = cardNumber.slice(-4) || '4242';
        const paymentLabel = isFree ? 'Free Plan Activation' : `Visa •••• ${lastDigits}`;
        
        const result = await subscribeToPlan(currentUser.id, plan.id, paymentLabel);
        
        if (result.success) {
          setIsProcessing(false);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            if (onSuccess) onSuccess();
          }, 1500);
        } else {
          setIsProcessing(false);
          setErrorMessage('Could not complete subscription. Please try again.');
        }
      } catch (err) {
        setIsProcessing(false);
        setErrorMessage('Simulation error occurred.');
      }
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          setIsSuccess(false);
          onClose();
        }
      }}
      title={isFree ? 'Confirm Free Plan Activation' : 'Confirm Subscription & Checkout'}
      subtitle={isFree ? 'No credit card required' : 'Simulated 100% test payment sandbox'}
      maxWidth="md"
      id="checkout-confirmation-modal"
    >
      {isSuccess ? (
        <div id="checkout-success-view" className="py-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900">Subscription Activated!</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            You are now subscribed to the <span className="font-semibold text-slate-900">{plan.name}</span> plan. Your billing history and dashboard have been updated.
          </p>
          <div className="pt-2 text-xs text-slate-400">Redirecting to your dashboard...</div>
        </div>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-5">
          {/* Plan Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Selected Plan
                </span>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {plan.name} Plan
                  {plan.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                      {plan.badge}
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  ${plan.price}
                  <span className="text-xs font-normal text-slate-500">/{plan.billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Billed monthly</div>
              </div>
            </div>

            {/* Plan inclusions preview */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px]">Projects</div>
                <div className="font-semibold text-slate-800">
                  {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px]">Storage</div>
                <div className="font-semibold text-slate-800">{plan.limits.storageGB} GB</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <div className="text-slate-500 text-[11px]">Team Members</div>
                <div className="font-semibold text-slate-800">{plan.limits.teamMembers}</div>
              </div>
            </div>
          </div>

          {/* Payment Method Details (Simulated) */}
          {!isFree && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Simulated Payment Method
                </label>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Test Sandbox Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    VISA
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Visa ending in 4242</div>
                    <div className="text-xs text-slate-500">Expires 12/28 • Simulated Sandbox</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Pre-filled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Cardholder Name</label>
                  <input
                    id="checkout-cardholder"
                    type="text"
                    value={cardholderName}
                    onChange={e => setCardholderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Card Number (Mock)</label>
                  <input
                    id="checkout-card-number"
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing breakdown */}
          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>{plan.name} Plan ({plan.billingCycle})</span>
              <span className="font-medium text-slate-900">${plan.price}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Simulated Sales Tax (0%)</span>
              <span className="font-medium text-slate-900">$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Due Today</span>
              <span className="text-blue-600 text-base">${plan.price}.00</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              id="checkout-cancel-btn"
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="checkout-confirm-payment-btn"
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{isFree ? 'Confirm Free Plan' : `Confirm Payment ($${plan.price})`}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-500 pt-1">
            🔒 This is an educational frontend mock checkout. No real money or card data is charged.
          </p>
        </form>
      )}
    </Modal>
  );
};
