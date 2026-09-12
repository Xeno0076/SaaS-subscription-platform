import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Sliders, Plus, Minus } from 'lucide-react';

interface UsageSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsageSimulatorModal: React.FC<UsageSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { getUserUsage, getUserPlan, updateUsage } = useSubscription();

  if (!currentUser) return null;

  const usage = getUserUsage(currentUser.id);
  const plan = getUserPlan(currentUser.id);

  const [projects, setProjects] = useState(usage.projectsUsed);
  const [storage, setStorage] = useState(usage.storageUsedGB);
  const [members, setMembers] = useState(usage.teamMembersUsed);

  const handleSave = () => {
    updateUsage(currentUser.id, {
      projectsUsed: Math.max(0, projects),
      storageUsedGB: Math.max(0, parseFloat(storage.toFixed(1))),
      teamMembersUsed: Math.max(1, members),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Usage Simulator"
      subtitle="Adjust simulated metrics to test plan limit thresholds & alerts"
      maxWidth="md"
      id="usage-simulator-modal"
    >
      <div className="space-y-5">
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-800">
          Current Plan: <span className="font-bold">{plan.name}</span> (Limits: {plan.limits.projects === -1 ? 'Unlimited' : `${plan.limits.projects} projects`}, {plan.limits.storageGB} GB storage, {plan.limits.teamMembers} members).
        </div>

        {/* Projects Control */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Projects Created</span>
            <span className="text-xs text-slate-500">
              Limit: {plan.limits.projects === -1 ? 'Unlimited' : `${plan.limits.projects}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="usage-projects-decrement"
              type="button"
              onClick={() => setProjects(prev => Math.max(0, prev - 1))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center font-bold text-slate-900 text-base">{projects}</span>
            <button
              id="usage-projects-increment"
              type="button"
              onClick={() => setProjects(prev => prev + 1)}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Storage Control */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Storage Used (GB)</span>
            <span className="text-xs text-slate-500">Limit: {plan.limits.storageGB} GB</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="usage-storage-decrement"
              type="button"
              onClick={() => setStorage(prev => Math.max(0, parseFloat((prev - 1).toFixed(1))))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center font-bold text-slate-900 text-base">{storage.toFixed(1)} GB</span>
            <button
              id="usage-storage-increment"
              type="button"
              onClick={() => setStorage(prev => parseFloat((prev + 1).toFixed(1)))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Team Members Control */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-800">Active Team Members</span>
            <span className="text-xs text-slate-500">Limit: {plan.limits.teamMembers} members</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="usage-members-decrement"
              type="button"
              onClick={() => setMembers(prev => Math.max(1, prev - 1))}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-16 text-center font-bold text-slate-900 text-base">{members}</span>
            <button
              id="usage-members-increment"
              type="button"
              onClick={() => setMembers(prev => prev + 1)}
              className="p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            id="usage-simulator-cancel"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            id="usage-simulator-apply"
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Apply Simulation
          </button>
        </div>
      </div>
    </Modal>
  );
};
