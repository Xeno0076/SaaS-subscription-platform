import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Layouts
import { UserLayout } from './components/layout/UserLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { PricingPage } from './pages/public/PricingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { SubscriptionManagement as UserSubscriptionManagement } from './pages/user/SubscriptionManagement';
import { BillingHistory } from './pages/user/BillingHistory';
import { AccountProfile } from './pages/user/AccountProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PlanManagement } from './pages/admin/PlanManagement';
import { SubscriptionManagement as AdminSubscriptionManagement } from './pages/admin/SubscriptionManagement';

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* User Dashboard & Management Nested Routes */}
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/billing" element={<UserSubscriptionManagement />} />
              <Route path="/billing-history" element={<BillingHistory />} />
              <Route path="/profile" element={<AccountProfile />} />
            </Route>

            {/* Admin Console Nested Routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/plans" element={<PlanManagement />} />
              <Route path="/admin/subscriptions" element={<AdminSubscriptionManagement />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
