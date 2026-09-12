import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

export const Footer: React.FC = () => {
  const { resetAllData } = useSubscription();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span>SaaS Subscription Platform</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An enterprise-grade subscription management & billing platform built as a clean, frontend-focused demonstration for internship assessment. Fully client-side with simulated payments and localStorage persistence.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulated Sandbox • Zero real credit cards or external APIs required</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Overview</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing & Plans</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Admin Console</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Evaluator Tools</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-500">Need to restore original starter data?</p>
              <button
                id="footer-reset-data-btn"
                onClick={() => {
                  if (window.confirm('Reset all demo plans, subscriptions, and transactions to initial state?')) {
                    resetAllData();
                    window.location.reload();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Mock Data
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SaaS Subscription Platform. All mock transactions simulated in browser localStorage.</p>
          <div className="flex items-center gap-4">
            <span>React 19</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
