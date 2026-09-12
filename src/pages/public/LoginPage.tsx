import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_CREDENTIALS } from '../../context/AuthContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Layers, ArrowRight, ShieldCheck, Lock, Mail, AlertCircle, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // No predefined customer test credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    const result = login(email, password);
    if (result.success && result.user) {
      // Direct users based on their authenticated role
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleFillAdmin = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError('');
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-xs text-slate-500">
              Sign in to manage your subscription and monitor platform limits
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@example.com"
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
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
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

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Protected Admin Account Credentials Helper */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Protected Admin Account</span>
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                Autofill Admin
              </button>
            </div>
            <div className="text-[11px] text-slate-500 font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
              <span>{ADMIN_CREDENTIALS.email}</span>
              <span className="text-slate-400">/</span>
              <span>{ADMIN_CREDENTIALS.password}</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Only this pre-configured administrator account has access to the protected admin console.
            </p>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
