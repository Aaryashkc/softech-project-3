import React, { useEffect, useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { websites, fetchWebsites, isLoading } = useWebsiteStore();
  const { authUser, isAdmin } = useAuthStore();
  const { states, allDistricts, fetchStates, fetchAllDistricts, loading: dataLoading } = useDataStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebsites();
    fetchStates();
    fetchAllDistricts();
    // eslint-disable-next-line
  }, []);

  // Helper to map state/district ID to name
  const getStateName = (id) => states.find((s) => s.StateId === id)?.StateName || id;
  const getDistrictName = (id) => allDistricts.find((d) => d.DistrictId === id)?.DistrictName || id;

  // Filtered websites based on search
  const filteredWebsites = websites.filter((site) => {
    const software = site.software?.toLowerCase() || '';
    const stateName = getStateName(site.state)?.toLowerCase() || '';
    const districtName = getDistrictName(site.district)?.toLowerCase() || '';
    const q = search.toLowerCase();
    return (
      software.includes(q) ||
      stateName.includes(q) ||
      districtName.includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by software, state, or district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-72"
          />
          <button
            onClick={() => navigate('/addclient')}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition whitespace-nowrap"
          >
            + Add Data
          </button>
        </div>
      </div>
      {(isLoading || dataLoading) ? (
        <div className="text-center py-10 text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-slate-900 text-white">
                {isAdmin() && <th className="py-2 px-4">User</th>}
                <th className="py-2 px-4">Software</th>
                <th className="py-2 px-4">Start Date</th>
                <th className="py-2 px-4">End Date</th>
                <th className="py-2 px-4">State</th>
                <th className="py-2 px-4">District</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebsites.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 6 : 5} className="text-center py-6 text-gray-400">No data found.</td>
                </tr>
              ) : (
                filteredWebsites.map((site) => (
                  <tr key={site._id} className="border-b hover:bg-slate-100 transition">
                    {isAdmin() && (
                      <td className="py-2 px-4 font-medium">
                        {site.user?.fullName || site.user?.email || 'N/A'}
                      </td>
                    )}
                    <td className="py-2 px-4">{site.software}</td>
                    <td className="py-2 px-4">{new Date(site.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{new Date(site.endDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4">{getStateName(site.state)}</td>
                    <td className="py-2 px-4">{getDistrictName(site.district)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
