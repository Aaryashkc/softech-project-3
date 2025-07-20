import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, CheckCircle, XCircle, Trash2, Calendar, User, Mail, Eye, RotateCcw} from 'lucide-react';
import { useInquiryStore } from "../store/useInquiryStore";
import toast from "react-hot-toast";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'in-talks': { color: 'bg-blue-100 text-blue-800', icon: MessageCircle, label: 'In Talks' },
    'confirmed': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confirmed' },
    'canceled': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Canceled' }
  };

  const config = statusConfig[status] || statusConfig['in-talks'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};


// Navigation Menu Component
const NavigationMenu = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'all', label: 'All Inquiries', icon: MessageCircle, count: null },
    { id: 'add-inquiry', label: 'Add New Inquiry', icon: Plus, count: null },
    { id: 'in-talks', label: 'In Talks', icon: MessageCircle, count: null },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, count: null },
    { id: 'canceled', label: 'Canceled', icon: XCircle, count: null }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Navigation</h3>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

// Status Change Button Component
const StatusChangeButton = ({ currentStatus, onStatusChange, loading }) => {
  const statusCycle = ['in-talks', 'confirmed', 'canceled'];
  const currentIndex = statusCycle.indexOf(currentStatus);
  const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

  const statusLabels = {
    'in-talks': 'In Talks',
    'confirmed': 'Confirmed',
    'canceled': 'Canceled'
  };

  const statusColors = {
    'in-talks': 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
    'confirmed': 'text-green-600 hover:text-green-800 hover:bg-green-50',
    'canceled': 'text-red-600 hover:text-red-800 hover:bg-red-50'
  };

  return (
    <button
      onClick={() => !loading && onStatusChange(nextStatus)}
      className={`p-1 rounded transition-colors ${statusColors[nextStatus]} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={`Change to ${statusLabels[nextStatus]}`}
      disabled={loading}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
      ) : (
        <RotateCcw size={16} />
      )}
    </button>
  );
};

// Add Modal component for View and Edit
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Add EditInquiryForm (like AddInquiryForm but prefilled and for editing)
const EditInquiryForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    ...initialData,
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
    activities: initialData.activities ? initialData.activities.join('\n') : '',
  });

  const handleSubmit = () => {
    const data = {
      ...formData,
      activities: formData.activities.split('\n').filter(Boolean),
    };
    onSubmit(data);
  };

  return (
    <div>
      {/* Same fields as AddInquiryForm, but prefilled */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inquirer Name *</label>
            <input type="text" required value={formData.inquirerName} onChange={e => setFormData({ ...formData, inquirerName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
            <input type="text" required value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Software *</label>
            <input type="text" required value={formData.software} onChange={e => setFormData({ ...formData, software: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="in-talks">In Talks</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Activities (one per line) *</label>
          <textarea required value={formData.activities} onChange={e => setFormData({ ...formData, activities: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
          <textarea value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
          <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Inquiry Table Component
const InquiryTable = ({ inquiries, onStatusChange, onDelete, onView, onEdit, statusLoadingId }) => {
  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
        <p className="text-gray-500">Start by adding your first inquiry.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inquirer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Software
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.inquirerName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail size={14} className="mr-2 text-gray-400" />
                    {inquiry.contactPerson}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inquiry.software}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-2" />
                    {new Date(inquiry.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={inquiry.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onView(inquiry)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View Details"><Eye size={16} /></button>
                    <button onClick={() => onEdit(inquiry)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded" title="Edit Inquiry"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.789l-4 1 1-4 14.362-14.302z" /></svg></button>
                    <StatusChangeButton currentStatus={inquiry.status} onStatusChange={(newStatus) => onStatusChange(inquiry._id, newStatus)} loading={statusLoadingId === inquiry._id} />
                    <button onClick={() => onDelete(inquiry._id)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add Inquiry Form Component
const AddInquiryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    inquirerName: '',
    contactPerson: '',
    date: new Date().toISOString().split('T')[0],
    software: '',
    status: 'in-talks',
    activities: '',
    comments: ''
  });

  const handleSubmit = () => {
    const data = {
      ...formData,
      activities: formData.activities.split('\n').filter(Boolean)
    };
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Inquiry</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inquirer Name *
            </label>
            <input
              type="text"
              required
              value={formData.inquirerName}
              onChange={(e) => setFormData({...formData, inquirerName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter inquirer name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Software *
            </label>
            <input
              type="text"
              required
              value={formData.software}
              onChange={(e) => setFormData({...formData, software: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Software/service type"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="in-talks">In Talks</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activities (one per line) *
          </label>
          <textarea
            required
            value={formData.activities}
            onChange={(e) => setFormData({...formData, activities: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter activities, one per line"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comments
          </label>
          <textarea
            value={formData.comments}
            onChange={(e) => setFormData({...formData, comments: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional comments"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Inquiry
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// SimplePopup for non-blocking view
const SimplePopup = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 mb-10 flex items-center justify-center">
      {/* Semi-transparent dark background */}
      <div className="absolute min-h-screen inset-0 bg-black opacity-25" />
      <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-96 pointer-events-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <XCircle size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// Main Dashboard Component
const InquiryDashboard = () => {
  const [activeView, setActiveView] = useState('all');
  const { inquiries, isLoading, fetchInquiries, deleteInquiry, updateInquiry, updateInquiryStatus, createInquiry } = useInquiryStore();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const getFilteredInquiries = () => {
    switch (activeView) {
      case 'in-talks':
        return inquiries.filter(inq => inq.status === 'in-talks');
      case 'confirmed':
        return inquiries.filter(inq => inq.status === 'confirmed');
      case 'canceled':
        return inquiries.filter(inq => inq.status === 'canceled');
      case 'all':
      default:
        return inquiries;
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setStatusLoadingId(id);
    try {
      await updateInquiryStatus(id, newStatus);
      // You can add a toast notification here
    } catch (error) {
      // You can add error handling here
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      await deleteInquiry(id);
    }
  };

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setViewModalOpen(true);
  };

  const handleCreateInquiry = async (data) => {
    try {
      await createInquiry(data);
      toast.success('Inquiry created');
      setActiveView('all');
    } catch (error) {
      toast.error('Failed to create inquiry');
    }
  };

  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      await updateInquiry(selectedInquiry._id, data);
      setEditModalOpen(false);
      setSelectedInquiry(null);
      toast.success('Inquiry updated');
    } catch (error) {
      toast.error('Failed to update inquiry');
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'add-inquiry':
        return 'Add New Inquiry';
      case 'in-talks':
        return 'Inquiries In Talks';
      case 'confirmed':
        return 'Confirmed Inquiries';
      case 'canceled':
        return 'Canceled Inquiries';
      default:
        return 'All Inquiries';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-2 sm:p-4 max-w-7xl mx-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiry Management Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage and track all your business inquiries</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('add-inquiry')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Inquiry
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <NavigationMenu activeView={activeView} onViewChange={setActiveView} />
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {activeView !== 'add-inquiry' && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{getViewTitle()}</h2>
                </div>
              </>
            )}
            {activeView === 'add-inquiry' ? (
              <AddInquiryForm onSubmit={handleCreateInquiry} onCancel={() => setActiveView('all')} />
            ) : (
              <InquiryTable
                inquiries={getFilteredInquiries()}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onView={handleView}
                onEdit={handleEdit}
                statusLoadingId={statusLoadingId}
              />
            )}
            {/* View Popup - only activities and comments */}
            <SimplePopup open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
              {selectedInquiry && (
                <div className="space-y-6">
                  <div>
                    <span className="font-semibold">Activities:</span>
                    <ul className="list-disc ml-6 mt-1">
                      {selectedInquiry.activities && selectedInquiry.activities.length > 0 ? (
                        selectedInquiry.activities.map((act, idx) => <li key={idx}>{act}</li>)
                      ) : (
                        <li className="text-gray-400">No activities listed</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold">Comments:</span>
                    <div className="bg-gray-100 rounded p-2 mt-1 text-gray-700 min-h-[40px]">{selectedInquiry.comments || <span className="text-gray-400">No comments</span>}</div>
                  </div>
                </div>
              )}
            </SimplePopup>
            {/* Edit Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Inquiry">
              {selectedInquiry && (
                <EditInquiryForm
                  initialData={selectedInquiry}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setEditModalOpen(false)}
                />
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDashboard;