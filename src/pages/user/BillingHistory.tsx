import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Transaction } from '../../types';
import {
  Receipt,
  Download,
  Search,
  Filter,
  CreditCard,
  Building,
  CheckCircle2,
  Printer,
  FileText,
} from 'lucide-react';

export const BillingHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserTransactions } = useSubscription();

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!currentUser) return null;

  const transactions = getUserTransactions(currentUser.id);

  const filtered = transactions.filter(tx => {
    const matchesSearch =
      tx.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View all simulated subscription invoices, charges, and printable receipts
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-invoices-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search invoice number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            id="filter-invoices-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No Invoices Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No transactions match your current search filters. Upgrade or subscribe to a paid tier to simulate invoices.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Payment Method</th>
                  <th className="py-3.5 px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-blue-600">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-800">{tx.planName}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">${tx.amount}.00</td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">{tx.paymentMethod}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        id={`view-invoice-${tx.id}`}
                        onClick={() => setSelectedTx(tx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Receipt Modal */}
      <Modal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        title="Simulated Tax Invoice Receipt"
        subtitle={selectedTx?.invoiceNumber}
        maxWidth="lg"
        id="invoice-receipt-modal"
      >
        {selectedTx && (
          <div className="space-y-6">
            {/* Printable Receipt Card */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-6 text-slate-800 text-xs">
              {/* Receipt Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="font-bold text-base text-slate-900">SaaS Subscription Platform</div>
                  <div className="text-slate-500">Cloud Billing Engine</div>
                  <div className="text-slate-400 mt-0.5">San Francisco, CA • USA</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {selectedTx.invoiceNumber}
                  </div>
                  <div className="text-slate-500">
                    Date: {new Date(selectedTx.date).toLocaleDateString()}
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={selectedTx.status} />
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-600 block mb-1">Billed To:</span>
                  <div className="font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-slate-600">{currentUser.email}</div>
                  <div className="text-slate-500">{currentUser.company || 'Personal Account'}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-1">Payment Method:</span>
                  <div className="font-semibold text-slate-900">{selectedTx.paymentMethod}</div>
                  <div className="text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transaction Authorized</span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-700 pb-2 border-b border-slate-200">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>{selectedTx.planName} (Monthly Subscription)</span>
                  <span className="font-semibold">${selectedTx.amount}.00</span>
                </div>
                <div className="flex justify-between py-1 text-slate-500">
                  <span>Simulated Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="text-blue-600 text-base">${selectedTx.amount}.00</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                🔒 Simulated educational receipt.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    alert('Mock PDF invoice download simulated.');
                    setSelectedTx(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
