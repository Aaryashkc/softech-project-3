import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Search, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
  // Use stores for actual data
  const { websites, fetchWebsites, updateWebsite, deleteWebsite, isLoading } = useWebsiteStore();
  const { states, allDistricts, fetchStates, fetchAllDistricts, palikas, allPalikas, fetchPalikasByDistrictId, fetchAllPalikas, loading: dataLoading } = useDataStore();
  const { authUser, isAdmin } = useAuthStore();

  const [districtsList, setDistrictsList] = useState([]);
  const [palikaList, setPalikaList] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [palikaFilter, setPalikaFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchWebsites();
    fetchStates();
    fetchAllDistricts();
    fetchAllPalikas();
  }, [fetchWebsites, fetchStates, fetchAllDistricts, fetchAllPalikas]);

  // Update districts when state filter changes
  useEffect(() => {
    if (stateFilter) {
      const filteredDistricts = allDistricts.filter(d => d.StateId === parseInt(stateFilter));
      setDistrictsList(filteredDistricts);
    } else {
      setDistrictsList([]);
    }
    setDistrictFilter('');
    setPalikaFilter('');
    setPalikaList([]);
  }, [stateFilter, allDistricts]);

  // Update palikas when district filter changes
  useEffect(() => {
    if (districtFilter) {
      fetchPalikasByDistrictId(districtFilter);
    } else {
      setPalikaList([]);
    }
    setPalikaFilter('');
  }, [districtFilter, fetchPalikasByDistrictId]);

  // Sync palikaList with store
  useEffect(() => {
    if (districtFilter) {
      setPalikaList(palikas);
    } else {
      setPalikaList([]);
    }
  }, [palikas, districtFilter]);

  // Helper functions
  const getStateName = (id) => states.find((s) => s.StateId === id)?.StateName || id;
  const getDistrictName = (id) => allDistricts.find((d) => d.DistrictId === id)?.DistrictName || id;
  const getPalikaName = (id) => {
    const palika = allPalikas.find((p) => p.PalikaId === id);
    return palika?.PalikaName ? String(palika.PalikaName) : (id ? String(id) : '');
  };

  // Check if user can edit/delete
  const canModify = (site) => {
    return isAdmin() || site.user?._id === authUser?._id || site.user === authUser?._id;
  };

  // Filter websites
  const filteredWebsites = websites.filter((site) => {
    const software = site.software?.toLowerCase() || '';
    const stateName = getStateName(site.state)?.toLowerCase() || '';
    const districtName = getDistrictName(site.district)?.toLowerCase() || '';
    const palikaName = getPalikaName(site.palika)?.toLowerCase() || '';
    const q = search.toLowerCase();

    const matchesSearch = software.includes(q) || stateName.includes(q) || districtName.includes(q) || palikaName.includes(q);
    const matchesState = !stateFilter || site.state === parseInt(stateFilter);
    const matchesDistrict = !districtFilter || site.district === parseInt(districtFilter);
    const matchesPalika = !palikaFilter || site.palika === parseInt(palikaFilter);

    return matchesSearch && matchesState && matchesDistrict && matchesPalika;
  });

  // Edit handlers
  const startEdit = (site) => {
    setEditingId(site._id);
    setEditForm({
      software: site.software,
      startDate: new Date(site.startDate).toISOString().split('T')[0],
      endDate: new Date(site.endDate).toISOString().split('T')[0],
      state: site.state,
      district: site.district,
      palika: site.palika || ''
    });
    // Set districts and palikas for edit
    const filteredDistricts = allDistricts.filter(d => d.StateId === site.state);
    setDistrictsList(filteredDistricts);

    // Set districtFilter and palikaFilter to match the site being edited
    setDistrictFilter(site.district);
    setPalikaFilter(site.palika || '');

    fetchPalikasByDistrictId(site.district);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setDistrictsList([]);
    setPalikaList([]);
  };

  const saveEdit = async () => {
    try {
      await updateWebsite(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      setDistrictsList([]);
      setPalikaList([]);
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
    setPalikaFilter('');
    setDistrictsList([]);
    setPalikaList([]);
  };
  
  return (
    <div className="p-2 sm:p-4 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h2>
        <button
          onClick={() => navigate('/addclient')}
          className="bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2 w-full sm:w-fit"
        >
          <Plus size={20} />
          Add Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 mb-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by software, state, district, or palika..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
            }}
            className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] sm:min-w-[200px] text-sm sm:text-base"
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
            onChange={(e) => {
              setDistrictFilter(e.target.value);
            }}
            className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] sm:min-w-[200px] text-sm sm:text-base"
            disabled={!stateFilter}
          >
            <option value="">All Districts</option>
            {(stateFilter ? districtsList : allDistricts).map((district) => (
              <option key={district._id} value={district.DistrictId}>
                {district.DistrictName}
              </option>
            ))}
          </select>

          {/* Palika Filter */}
          <select
            value={palikaFilter}
            onChange={(e) => setPalikaFilter(e.target.value)}
            className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px] sm:min-w-[200px] text-sm sm:text-base"
            disabled={!districtFilter}
          >
            <option value="">All Palikas</option>
            {(districtFilter ? palikaList : allPalikas).map((palika) => (
              <option key={palika._id} value={palika.PalikaId}>
                {palika.PalikaName}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
        </div>
      </div>

      {/* Table */}
      {(isLoading || dataLoading) ? (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-10 text-center">
          <div className="text-base sm:text-lg text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold">Software</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold">Start Date</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold xs:table-cell">End Date</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold">State</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold xs:table-cell">District</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-left font-semibold xs:table-cell">Palika</th>
                <th className="py-2 px-2 sm:py-4 sm:px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 sm:py-10 text-gray-400">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredWebsites.map((site) => (
                  <tr key={site._id} className="border-b hover:bg-slate-50 transition">
                    {/* Software */}
                    <td className="py-2 px-2 sm:py-4 sm:px-6">
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
                    <td className="py-2 px-2 sm:py-4 sm:px-6">
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
                    {/* End Date (hidden on xs) */}
                    <td className="py-2 px-2 sm:py-4 sm:px-6 xs:table-cell">
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
                    <td className="py-2 px-2 sm:py-4 sm:px-6">
                      {editingId === site._id ? (
                        <select
                          value={editForm.state}
                          onChange={(e) => {
                            const stateId = parseInt(e.target.value);
                            setEditForm({...editForm, state: stateId, district: '', palika: ''});
                            const filteredDistricts = allDistricts.filter(d => d.StateId === stateId);
                            setDistrictsList(filteredDistricts);
                            setPalikaList([]);
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
                    {/* District (hidden on xs) */}
                    <td className="py-2 px-2 sm:py-4 sm:px-6 xs:table-cell">
                      {editingId === site._id ? (
                        <select
                          value={editForm.district}
                          onChange={async (e) => {
                            const districtId = parseInt(e.target.value);
                            setEditForm({...editForm, district: districtId, palika: ''});
                            await fetchPalikasByDistrictId(districtId);
                          }}
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        >
                          {districtsList.map((district) => (
                            <option key={district._id} value={district.DistrictId}>
                              {district.DistrictName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600">{getDistrictName(site.district)}</span>
                      )}
                    </td>
                    {/* Palika (hidden on xs) */}
                    <td className="py-2 px-2 sm:py-4 sm:px-6 xs:table-cell">
                      {editingId === site._id ? (
                        <select
                          value={editForm.palika}
                          onChange={(e) => setEditForm({...editForm, palika: parseInt(e.target.value)})}
                          className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Palika</option>
                          {palikaList.map((palika) => (
                            <option key={palika._id} value={palika.PalikaId}>
                              {palika.PalikaName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600">{getPalikaName(site.palika)}</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="py-2 px-2 sm:py-4 sm:px-6">
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
      )}

      {/* Results Count */}
      {filteredWebsites.length > 0 && (
        <div className="mt-2 sm:mt-4 text-center text-slate-600 text-xs sm:text-base">
          Showing {filteredWebsites.length} of {websites.length} entries
        </div>
      )}
    </div>
  );
};

export default Dashboard;