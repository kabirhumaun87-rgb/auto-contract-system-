import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, Shield, Phone, Mail, FileText } from 'lucide-react';
import { Contractor } from '../types/contract';

interface ContractorDatabaseViewProps {
  contractors: Contractor[];
  onSaveContractor: (contractor: Contractor) => void;
  onDeleteContractor: (id: string) => void;
}

export const ContractorDatabaseView: React.FC<ContractorDatabaseViewProps> = ({
  contractors,
  onSaveContractor,
  onDeleteContractor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = contractors.filter(c =>
    c.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.proprietorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingContractor({
      id: `cont-${Date.now()}`,
      firmName: '',
      proprietorName: '',
      address: '',
      contactPerson: '',
      mobileNumber: '',
      email: '',
      registrationNumber: '',
      mesEnlistmentCategory: 'D',
      otherDepartmentDetails: '',
      securityClearanceRef: '',
      tinNumber: '',
      vatBinNumber: '',
      bankSecurityRef: '',
      authorizedSignatoryName: '',
      authorizedSignatoryDesignation: 'Proprietor',
      remarks: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contractor: Contractor) => {
    setEditingContractor({ ...contractor });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContractor || !editingContractor.firmName.trim()) return;
    onSaveContractor(editingContractor);
    setIsModalOpen(false);
    setEditingContractor(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contractor, registration, or proprietor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Contractor</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
            No contractors enrolled in the database.
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{c.firmName}</h3>
                    <div className="text-xs text-slate-500">Proprietor: {c.proprietorName || 'N/A'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 shrink-0">
                    Category {c.mesEnlistmentCategory}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                  <div>
                    <span className="text-slate-400 block">Registration No</span>
                    <span className="font-mono font-medium">{c.registrationNumber || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">DGFI Clearance</span>
                    <span className="truncate block" title={c.securityClearanceRef}>{c.securityClearanceRef || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">TIN / VAT BIN</span>
                    <span className="font-mono">{c.vatBinNumber || c.tinNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Phone</span>
                    <span>{c.mobileNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 truncate" title={c.address}>
                  {c.address}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${c.firmName} from contractor database?`)) {
                      onDeleteContractor(c.id);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingContractor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              {editingContractor.firmName ? 'Edit Contractor Profile' : 'Register New MES Contractor'}
            </h2>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Firm / Business Name *</label>
                  <input
                    type="text"
                    required
                    value={editingContractor.firmName}
                    onChange={(e) => setEditingContractor({ ...editingContractor, firmName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proprietor Name</label>
                  <input
                    type="text"
                    value={editingContractor.proprietorName}
                    onChange={(e) => setEditingContractor({ ...editingContractor, proprietorName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">MES Enlistment Category</label>
                  <select
                    value={editingContractor.mesEnlistmentCategory}
                    onChange={(e) => setEditingContractor({ ...editingContractor, mesEnlistmentCategory: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-bold"
                  >
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
                    <option value="D">Category D</option>
                    <option value="E">Category E</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration / Enlistment No.</label>
                  <input
                    type="text"
                    value={editingContractor.registrationNumber}
                    onChange={(e) => setEditingContractor({ ...editingContractor, registrationNumber: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                    placeholder="MES/DCA/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">DGFI Security Clearance Ref</label>
                  <input
                    type="text"
                    value={editingContractor.securityClearanceRef}
                    onChange={(e) => setEditingContractor({ ...editingContractor, securityClearanceRef: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                    placeholder="DGFI/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / Telephone</label>
                  <input
                    type="text"
                    value={editingContractor.mobileNumber}
                    onChange={(e) => setEditingContractor({ ...editingContractor, mobileNumber: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingContractor.email}
                    onChange={(e) => setEditingContractor({ ...editingContractor, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">TIN Number</label>
                  <input
                    type="text"
                    value={editingContractor.tinNumber}
                    onChange={(e) => setEditingContractor({ ...editingContractor, tinNumber: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">VAT / BIN Number</label>
                  <input
                    type="text"
                    value={editingContractor.vatBinNumber}
                    onChange={(e) => setEditingContractor({ ...editingContractor, vatBinNumber: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
                  <textarea
                    rows={2}
                    value={editingContractor.address}
                    onChange={(e) => setEditingContractor({ ...editingContractor, address: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
