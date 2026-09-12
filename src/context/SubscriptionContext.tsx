import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan, Subscription, Transaction, UserUsage } from '../types';
import {
  INITIAL_PLANS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_USAGES,
} from '../data/mockData';

interface SubscriptionContextType {
  plans: Plan[];
  subscriptions: Subscription[];
  transactions: Transaction[];
  usages: UserUsage[];
  getUserSubscription: (userId: string) => Subscription | null;
  getUserPlan: (userId: string) => Plan;
  getUserTransactions: (userId: string) => Transaction[];
  getUserUsage: (userId: string) => UserUsage;
  updateUsage: (userId: string, updates: Partial<Omit<UserUsage, 'userId'>>) => void;
  subscribeToPlan: (
    userId: string,
    planId: string,
    paymentMethodName?: string
  ) => Promise<{ success: boolean; transaction?: Transaction }>;
  cancelSubscription: (userId: string) => void;
  reactivateSubscription: (userId: string) => void;
  adminUpdatePlan: (plan: Plan) => void;
  adminAddPlan: (plan: Omit<Plan, 'id'>) => void;
  adminDeletePlan: (planId: string) => void;
  adminCancelSubscription: (subscriptionId: string) => void;
  resetAllData: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const PLANS_STORAGE_KEY = 'saas_platform_plans_v1';
const SUBS_STORAGE_KEY = 'saas_platform_subs_v1';
const TXS_STORAGE_KEY = 'saas_platform_txs_v1';
const USAGES_STORAGE_KEY = 'saas_platform_usages_v1';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>(() => {
    try {
      const stored = localStorage.getItem(PLANS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_PLANS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const stored = localStorage.getItem(SUBS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SUBSCRIPTIONS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(TXS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [usages, setUsages] = useState<UserUsage[]>(() => {
    try {
      const stored = localStorage.getItem(USAGES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_USAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      console.error('Failed saving plans', e);
    }
  }, [plans]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBS_STORAGE_KEY, JSON.stringify(subscriptions));
    } catch (e) {
      console.error('Failed saving subscriptions', e);
    }
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(TXS_STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed saving transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(USAGES_STORAGE_KEY, JSON.stringify(usages));
    } catch (e) {
      console.error('Failed saving usages', e);
    }
  }, [usages]);

  const getUserSubscription = (userId: string): Subscription | null => {
    // Find the latest subscription for user
    const userSubs = subscriptions.filter(s => s.userId === userId);
    if (userSubs.length === 0) return null;
    return userSubs[userSubs.length - 1];
  };

  const getUserPlan = (userId: string): Plan => {
    const sub = getUserSubscription(userId);
    if (!sub || sub.status === 'canceled') {
      const freePlan = plans.find(p => p.price === 0) || plans[0];
      return freePlan;
    }
    const matchedPlan = plans.find(p => p.id === sub.planId);
    return matchedPlan || plans[0];
  };

  const getUserTransactions = (userId: string): Transaction[] => {
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUserUsage = (userId: string): UserUsage => {
    const userUsage = usages.find(u => u.userId === userId);
    if (userUsage) return userUsage;

    // Default starting usage for a new user
    const defaultUsage: UserUsage = {
      userId,
      projectsUsed: 1,
      storageUsedGB: 0.2,
      teamMembersUsed: 1,
    };
    return defaultUsage;
  };

  const updateUsage = (userId: string, updates: Partial<Omit<UserUsage, 'userId'>>) => {
    setUsages(prev => {
      const exists = prev.some(u => u.userId === userId);
      if (exists) {
        return prev.map(u => (u.userId === userId ? { ...u, ...updates } : u));
      } else {
        const newUsage: UserUsage = {
          userId,
          projectsUsed: updates.projectsUsed ?? 1,
          storageUsedGB: updates.storageUsedGB ?? 0.2,
          teamMembersUsed: updates.teamMembersUsed ?? 1,
        };
        return [...prev, newUsage];
      }
    });
  };

  const subscribeToPlan = async (
    userId: string,
    planId: string,
    paymentMethodName = 'Visa •••• 4242'
  ): Promise<{ success: boolean; transaction?: Transaction }> => {
    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) {
      return { success: false };
    }

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    // 1. Create or update subscription
    const existingSubIndex = subscriptions.findIndex(s => s.userId === userId);
    let newSub: Subscription;

    if (existingSubIndex >= 0) {
      newSub = {
        ...subscriptions[existingSubIndex],
        planId: targetPlan.id,
        status: 'active',
        startDate: now.toISOString(),
        nextBillingDate: nextMonth.toISOString(),
        cancelAtPeriodEnd: false,
      };
      setSubscriptions(prev => {
        const next = [...prev];
        next[existingSubIndex] = newSub;
        return next;
      });
    } else {
      newSub = {
        id: `sub_${Date.now()}`,
        userId,
        planId: targetPlan.id,
        status: 'active',
        startDate: now.toISOString(),
        nextBillingDate: nextMonth.toISOString(),
        cancelAtPeriodEnd: false,
      };
      setSubscriptions(prev => [...prev, newSub]);
    }

    // 2. If it's a paid plan, record a transaction
    let newTx: Transaction | undefined;
    if (targetPlan.price > 0) {
      const randomInvoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      newTx = {
        id: `tx_${Date.now()}`,
        userId,
        planId: targetPlan.id,
        planName: `${targetPlan.name} Plan (${targetPlan.billingCycle})`,
        amount: targetPlan.price,
        date: now.toISOString(),
        status: 'paid',
        invoiceNumber: randomInvoiceNumber,
        paymentMethod: paymentMethodName,
      };
      setTransactions(prev => [newTx!, ...prev]);
    }

    return { success: true, transaction: newTx };
  };

  const cancelSubscription = (userId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.userId === userId) {
          return {
            ...sub,
            cancelAtPeriodEnd: true,
            status: 'canceled',
          };
        }
        return sub;
      })
    );
  };

  const reactivateSubscription = (userId: string) => {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.userId === userId) {
          return {
            ...sub,
            cancelAtPeriodEnd: false,
            status: 'active',
            nextBillingDate: nextMonth.toISOString(),
          };
        }
        return sub;
      })
    );
  };

  const adminUpdatePlan = (updatedPlan: Plan) => {
    setPlans(prev => prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  const adminAddPlan = (newPlanData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...newPlanData,
      id: `plan_${Date.now()}`,
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const adminDeletePlan = (planId: string) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  const adminCancelSubscription = (subscriptionId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === subscriptionId ? { ...sub, status: 'canceled', cancelAtPeriodEnd: true } : sub))
    );
  };

  const resetAllData = () => {
    setPlans(INITIAL_PLANS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setUsages(INITIAL_USAGES);
    localStorage.removeItem(PLANS_STORAGE_KEY);
    localStorage.removeItem(SUBS_STORAGE_KEY);
    localStorage.removeItem(TXS_STORAGE_KEY);
    localStorage.removeItem(USAGES_STORAGE_KEY);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        subscriptions,
        transactions,
        usages,
        getUserSubscription,
        getUserPlan,
        getUserTransactions,
        getUserUsage,
        updateUsage,
        subscribeToPlan,
        cancelSubscription,
        reactivateSubscription,
        adminUpdatePlan,
        adminAddPlan,
        adminDeletePlan,
        adminCancelSubscription,
        resetAllData,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
