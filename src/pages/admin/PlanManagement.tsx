import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Plan } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  FolderGit2,
  HardDrive,
  Users,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export const PlanManagement: React.FC = () => {
  const { plans, adminUpdatePlan, adminAddPlan, adminDeletePlan } = useSubscription();

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  // New plan state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(19);
  const [newDesc, setNewDesc] = useState('');
  const [newProjects, setNewProjects] = useState(15);
  const [newStorage, setNewStorage] = useState(25);
  const [newMembers, setNewMembers] = useState(8);
  const [newFeatures, setNewFeatures] = useState('Custom workflows\nDedicated support\nAutomated daily sync');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    adminUpdatePlan(editingPlan);
    setEditingPlan(null);
    setFeedback(`Plan "${editingPlan.name}" updated successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedFeatures = newFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    adminAddPlan({
      name: newName.trim(),
      price: Number(newPrice),
      billingCycle: 'monthly',
      description: newDesc.trim() || 'Custom tailored subscription plan.',
      limits: {
        projects: Number(newProjects),
        storageGB: Number(newStorage),
        teamMembers: Number(newMembers),
      },
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Core feature access'],
      popular: false,
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPrice(19);
    setFeedback(`New plan "${newName}" published!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = (plan: Plan) => {
    if (['plan_free', 'plan_pro', 'plan_business'].includes(plan.id)) {
      alert('The core default tiers (Free, Pro, Business) cannot be removed.');
      return;
    }

    if (window.confirm(`Delete plan "${plan.name}"?`)) {
      adminDeletePlan(plan.id);
      setFeedback(`Plan "${plan.name}" removed.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Plan Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure pricing tiers, adjust quota limits, and publish new subscription packages
          </p>
        </div>
        <button
          id="admin-create-plan-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Tier</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-indigo-400 font-bold">{plan.id}</span>
                {plan.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {plan.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">${plan.price}</span>
                <span className="text-xs text-slate-400">/{plan.billingCycle}</span>
              </div>

              {/* Quota overview */}
              <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <FolderGit2 className="w-3.5 h-3.5" /> Projects:
                  </span>
                  <span className="font-semibold text-white">
                    {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <HardDrive className="w-3.5 h-3.5" /> Storage:
                  </span>
                  <span className="font-semibold text-white">{plan.limits.storageGB} GB</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5" /> Team Seats:
                  </span>
                  <span className="font-semibold text-white">{plan.limits.teamMembers}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-xs text-slate-400">
                <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider block mb-1">
                  Features ({plan.features.length})
                </span>
                {plan.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-[11px] text-slate-500 italic block">
                    +{plan.features.length - 3} more capabilities
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-2">
              <button
                id={`edit-plan-${plan.id}`}
                onClick={() => setEditingPlan(plan)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Tier</span>
              </button>
              <button
                onClick={() => handleDelete(plan)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Plan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        title={`Edit Plan: ${editingPlan?.name}`}
        subtitle="Changes are applied immediately across the entire platform"
        maxWidth="md"
        id="edit-plan-modal"
      >
        {editingPlan && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Price ($)</label>
                <input
                  type="number"
                  value={editingPlan.price}
                  onChange={e =>
                    setEditingPlan({ ...editingPlan, price: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={editingPlan.description || ''}
                onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Resource Quota Limits
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Projects (-1: unlim)</label>
                  <input
                    type="number"
                    value={editingPlan.limits.projects}
                    onChange={e =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, projects: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    value={editingPlan.limits.storageGB}
                    onChange={e =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, storageGB: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Team Seats</label>
                  <input
                    type="number"
                    value={editingPlan.limits.teamMembers}
                    onChange={e =>
                      setEditingPlan({
                        ...editingPlan,
                        limits: { ...editingPlan.limits, teamMembers: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Save Plan Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Subscription Tier"
        subtitle="Publish a custom tier available for customer subscription"
        maxWidth="md"
        id="add-plan-modal"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tier Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Enterprise Plus"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Price ($)</label>
              <input
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Tailored for high-scale teams"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Projects Limit</label>
              <input
                type="number"
                value={newProjects}
                onChange={e => setNewProjects(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Storage (GB)</label>
              <input
                type="number"
                value={newStorage}
                onChange={e => setNewStorage(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-medium">Team Seats</label>
              <input
                type="number"
                value={newMembers}
                onChange={e => setNewMembers(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Features (One per line)
            </label>
            <textarea
              value={newFeatures}
              onChange={e => setNewFeatures(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-sans"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
            >
              Publish Tier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
