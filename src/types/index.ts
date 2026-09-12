export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  createdAt: string;
}

export interface PlanLimits {
  projects: number; // -1 for unlimited
  storageGB: number;
  teamMembers: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
  badge?: string;
  description?: string;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  cancelAtPeriodEnd?: boolean;
}

export type TransactionStatus = 'paid' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  invoiceNumber: string;
  paymentMethod: string;
}

export interface UserUsage {
  userId: string;
  projectsUsed: number;
  storageUsedGB: number;
  teamMembersUsed: number;
}
