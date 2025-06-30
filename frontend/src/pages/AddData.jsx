import React, { useEffect, useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { useDataStore } from '../store/useDataStore';

const AddData = () => {
  const { createWebsite, isLoading } = useWebsiteStore();
  const { states, districts, fetchStates, fetchDistrictsByStateId, loading: dataLoading } = useDataStore();

  const [form, setForm] = useState({
    software: '',
    startDate: '',
    endDate: '',
    state: '',
    district: '',
  });

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (form.state) {
      fetchDistrictsByStateId(form.state);
    }
  }, [form.state, fetchDistrictsByStateId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'state') {
      setForm((prev) => ({ ...prev, district: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createWebsite({
      ...form,
      state: Number(form.state),
      district: Number(form.district),
    });
    setForm({ software: '', startDate: '', endDate: '', state: '', district: '' });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6">Add Website Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Software</label>
          <input
            type="text"
            name="software"
            value={form.software}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.StateId} value={state.StateId}>
                {state.StateName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">District</label>
          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
            disabled={!form.state || dataLoading}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.DistrictId} value={district.DistrictId}>
                {district.DistrictName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
          disabled={isLoading || dataLoading}
        >
          {isLoading ? 'Adding...' : 'Add Data'}
        </button>
      </form>
    </div>
  );
};

export default AddData;
