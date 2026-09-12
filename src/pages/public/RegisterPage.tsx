import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Layers, ArrowRight, User, Mail, Lock, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { subscribeToPlan } = useSubscription();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const errs: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errs.name = 'Full name is required.';
    }

    if (!trimmedEmail) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    // Role is automatically assigned as 'user' (Customer role) in AuthContext
    const res = register(name, email, password, company);
    if (res.success && res.user) {
      // Initialize starting Free subscription tier
      try {
        await subscribeToPlan(res.user.id, 'plan_free');
      } catch (err) {
        console.error('Initial plan subscription error', err);
      }
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create Customer Account</h1>
            <p className="text-xs text-slate-500">
              Register your personal or team account to access the customer dashboard
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="e.g. Jordan Lee"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.name
                      ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="jordan.lee@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.email
                      ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="register-company"
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acorn Digital Labs"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.password
                      ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="register-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword)
                      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Re-enter your password"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    validationErrors.confirmPassword
                      ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Note confirming Customer role and safety */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
              <p className="leading-relaxed">
                Registered users receive standard customer access and start on the complimentary Free Plan tier.
              </p>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
