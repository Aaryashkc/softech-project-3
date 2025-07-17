import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Monitor, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWebsiteStore } from '../store/useWebsiteStore';
import { useDataStore } from '../store/useDataStore';

const AddData = () => {
  const navigate = useNavigate();
  const { createWebsite, isLoading } = useWebsiteStore();
  const { states, districts, palikas, fetchStates, fetchDistrictsByStateId, fetchPalikasByDistrictId, loading: dataLoading } = useDataStore();

  const [form, setForm] = useState({
    software: '',
    startDate: '',
    endDate: '',
    state: '',
    district: '',
    palika:'',
  });

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (form.state) {
      fetchDistrictsByStateId(form.state);
    }
  }, [form.state, fetchDistrictsByStateId]);

  useEffect(() => {
    if (form.district) {
      fetchPalikasByDistrictId(form.district);
    }
  }, [form.district, fetchPalikasByDistrictId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'state') {
      setForm((prev) => ({ ...prev, district: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWebsite({
        ...form,
        state: Number(form.state),
        district: Number(form.district),
      });
      setForm({ software: '', startDate: '', endDate: '', state: '', district: '', palika:'' });
      navigate('/');
    } catch (error) {
      console.error('Error creating website:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 rounded-full mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Website Data</h1>
          <p className="text-slate-600">Fill in the details to add a new website entry to your system</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Software Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                Software Name
              </label>
              <input
                type="text"
                name="software"
                value={form.software}
                onChange={handleChange}
                placeholder="e.g., www.example.com or example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>

            {/* Date Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  State
                </label>
                <div className="relative">
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none bg-white"
                    required
                  >
                    <option value="" className="text-slate-400">Choose a state</option>
                    {states.map((state) => (
                      <option key={state.StateId} value={state.StateId} className="text-slate-700">
                        {state.StateName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  District
                </label>
                <div className="relative">
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none bg-white ${
                      !form.state || dataLoading
                        ? 'border-gray-200 text-slate-400 cursor-not-allowed'
                        : 'border-gray-200 text-slate-700 focus:border-blue-500'
                    }`}
                    required
                    disabled={!form.state || dataLoading}
                  >
                    <option value="" className="text-slate-400">
                      {!form.state ? 'Select state first' : dataLoading ? 'Loading districts...' : 'Choose a district'}
                    </option>
                    {districts.map((district) => (
                      <option key={district.DistrictId} value={district.DistrictId} className="text-slate-700">
                        {district.DistrictName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {dataLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  Palika
                </label>
                <div className="relative">
                  <select
                    name="palika"
                    value={form.palika}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-100 transition-all duration-200 appearance-none bg-white ${
                      !form.district || dataLoading
                        ? 'border-gray-200 text-slate-400 cursor-not-allowed'
                        : 'border-gray-200 text-slate-700 focus:border-blue-500'
                    }`}
                    required
                    disabled={!form.district || dataLoading}
                  >
                    <option value="" className="text-slate-400">
                      {!form.district ? 'Select district first' : dataLoading ? 'Loading palikas...' : 'Choose a palika'}
                    </option>
                    {palikas.map((palika) => (
                      <option key={palika.PalikaId} value={palika.PalikaId} className="text-slate-700">
                        {palika.PalikaName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {dataLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                  isLoading || dataLoading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
                disabled={isLoading || dataLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Data...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Website Data
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddData;