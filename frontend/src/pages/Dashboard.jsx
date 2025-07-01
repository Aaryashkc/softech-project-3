import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Search, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
  // Use stores for actual data
  const { websites, fetchWebsites, updateWebsite, deleteWebsite, isLoading } = useWebsiteStore();
  const { states, allDistricts, fetchStates, fetchAllDistricts, loading: dataLoading } = useDataStore();
  const { authUser, isAdmin } = useAuthStore();

  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchWebsites();
    fetchStates();
    fetchAllDistricts();
  }, [fetchWebsites, fetchStates, fetchAllDistricts]);

  // Update districts when state filter changes
  useEffect(() => {
    if (stateFilter) {
      const filteredDistricts = allDistricts.filter(d => d.StateId === parseInt(stateFilter));
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [stateFilter, allDistricts]);

  // Helper functions
  const getStateName = (id) => states.find((s) => s.StateId === id)?.StateName || id;
  const getDistrictName = (id) => allDistricts.find((d) => d.DistrictId === id)?.DistrictName || id;

  // Check if user can edit/delete
  const canModify = (site) => {
    return isAdmin() || site.user?._id === authUser?._id || site.user === authUser?._id;
  };

  // Filter websites
  const filteredWebsites = websites.filter((site) => {
    const software = site.software?.toLowerCase() || '';
    const stateName = getStateName(site.state)?.toLowerCase() || '';
    const districtName = getDistrictName(site.district)?.toLowerCase() || '';
    const q = search.toLowerCase();
    
    const matchesSearch = software.includes(q) || stateName.includes(q) || districtName.includes(q);
    const matchesState = !stateFilter || site.state === parseInt(stateFilter);
    const matchesDistrict = !districtFilter || site.district === parseInt(districtFilter);
    
    return matchesSearch && matchesState && matchesDistrict;
  });

  // Edit handlers
  const startEdit = (site) => {
    setEditingId(site._id);
    setEditForm({
      software: site.software,
      startDate: new Date(site.startDate).toISOString().split('T')[0],
      endDate: new Date(site.endDate).toISOString().split('T')[0],
      state: site.state,
      district: site.district
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      await updateWebsite(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  // Delete handler
  const handleDelete = async (id, siteName) => {
    if (window.confirm(`Are you sure you want to delete ${siteName}?`)) {
      try {
        await deleteWebsite(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setStateFilter('');
    setDistrictFilter('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <button
          onClick={() => navigate('/addclient')}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          Add Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by software, state, or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setDistrictFilter(''); // Reset district when state changes
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state._id} value={state.StateId}>
                {state.StateName}
              </option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            disabled={!stateFilter}
          >
            <option value="">All Districts</option>
            {(stateFilter ? districts : allDistricts).map((district) => (
              <option key={district._id} value={district.DistrictId}>
                {district.DistrictName}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(search || stateFilter || districtFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition flex items-center gap-2"
            >
              <X size={20} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {(isLoading || dataLoading) ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-4 px-6 text-left font-semibold">Software</th>
                  <th className="py-4 px-6 text-left font-semibold">Start Date</th>
                  <th className="py-4 px-6 text-left font-semibold">End Date</th>
                  <th className="py-4 px-6 text-left font-semibold">State</th>
                  <th className="py-4 px-6 text-left font-semibold">District</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWebsites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filteredWebsites.map((site) => (
                    <tr key={site._id} className="border-b hover:bg-slate-50 transition">
                      
                      {/* Software */}
                      <td className="py-4 px-6">
                        {editingId === site._id ? (
                          <input
                            type="text"
                            value={editForm.software}
                            onChange={(e) => setEditForm({...editForm, software: e.target.value})}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="font-medium text-slate-700">{site.software}</span>
                        )}
                      </td>
                      
                      {/* Start Date */}
                      <td className="py-4 px-6">
                        {editingId === site._id ? (
                          <input
                            type="date"
                            value={editForm.startDate}
                            onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-slate-600">{new Date(site.startDate).toLocaleDateString()}</span>
                        )}
                      </td>
                      
                      {/* End Date */}
                      <td className="py-4 px-6">
                        {editingId === site._id ? (
                          <input
                            type="date"
                            value={editForm.endDate}
                            onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-slate-600">{new Date(site.endDate).toLocaleDateString()}</span>
                        )}
                      </td>
                      
                      {/* State */}
                      <td className="py-4 px-6">
                        {editingId === site._id ? (
                          <select
                            value={editForm.state}
                            onChange={(e) => {
                              const stateId = parseInt(e.target.value);
                              setEditForm({...editForm, state: stateId, district: ''});
                              const filteredDistricts = allDistricts.filter(d => d.StateId === stateId);
                              setDistricts(filteredDistricts);
                            }}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          >
                            {states.map((state) => (
                              <option key={state._id} value={state.StateId}>
                                {state.StateName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-600">{getStateName(site.state)}</span>
                        )}
                      </td>
                      
                      {/* District */}
                      <td className="py-4 px-6">
                        {editingId === site._id ? (
                          <select
                            value={editForm.district}
                            onChange={(e) => setEditForm({...editForm, district: parseInt(e.target.value)})}
                            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          >
                            {districts.map((district) => (
                              <option key={district._id} value={district.DistrictId}>
                                {district.DistrictName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-600">{getDistrictName(site.district)}</span>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === site._id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-800 p-1 rounded transition"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-800 p-1 rounded transition"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              {canModify(site) && (
                                <>
                                  <button
                                    onClick={() => startEdit(site)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition"
                                    title="Edit"
                                  >
                                    <Edit size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(site._id, site.software)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Count */}
      {filteredWebsites.length > 0 && (
        <div className="mt-4 text-center text-slate-600">
          Showing {filteredWebsites.length} of {websites.length} entries
        </div>
      )}
    </div>
  );
};

export default Dashboard;