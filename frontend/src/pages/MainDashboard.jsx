import React, { useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  Users,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Building,
  Home,
  TrendingUp,
  TrendingDown,
  Calendar,
  Code,
  Clock,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

const MainDashboard = () => {
  const {
    inquirySummary,
    inquiriesByStatus,
    monthlyInquiries,
    actionStats,
    conversionFunnel,
    websitesByLocation,
    softwareStats,
    recentActivities,
    loading,
    error,
    loadingStates,
    fetchAllData,
    getters
  } = useDashboardStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Effect to handle conversion funnel data
  useEffect(() => {
    // This effect can be used for any side effects related to conversionFunnel changes
  }, [conversionFunnel]);

  // Enhanced color schemes
  const COLORS = {
    primary: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    success: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#9decf9', '#a7f3d0'],
    warning: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    danger: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
    purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    emerald: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    gradient: {
      blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      green: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      purple: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      orange: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  };

  const STATUS_COLORS = {
    confirmed: '#10b981',
    'in-talks': '#f59e0b', 
    canceled: '#ef4444',
    pending: '#6b7280',
    default: '#3b82f6'
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', change, trend, subtitle }) => {
    const colorClasses = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-800', border: 'border-blue-200' },
      green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-800', border: 'border-emerald-200' },
      orange: { bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-800', border: 'border-orange-200' },
      red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-800', border: 'border-red-200' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-800', border: 'border-purple-200' },
      indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', text: 'text-indigo-800', border: 'border-indigo-200' }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{title}</p>
            <p className={`text-3xl font-bold ${colors.text} mb-1`}>
              {value?.toLocaleString() || '0'}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
            )}
            {change !== undefined && (
              <div className="flex items-center space-x-2">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
                </span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${colors.bg}`}>
            <Icon className={`h-8 w-8 ${colors.icon}`} />
          </div>
        </div>
      </div>
    );
  };

  const ChartContainer = ({ title, children, className = '', icon: Icon }) => (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 ${className}`}>
      <div className="flex items-center mb-6">
        {Icon && <Icon className="h-6 w-6 text-gray-600 mr-3" />}
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <Sparkles className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-blue-900 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Inquiries"
            value={inquirySummary?.totalInquiries}
            icon={Users}
            color="blue"
            change={inquirySummary?.changes?.totalInquiries}
            subtitle="All time inquiries"
          />
          <StatCard
            title="Active Inquiries"
            value={inquirySummary?.inquiriesWithActions}
            icon={Activity}
            color="green"
            change={inquirySummary?.changes?.inquiriesWithActions}
            subtitle="With follow-up actions"
          />
          <StatCard
            title="Confirmed"
            value={inquirySummary?.confirmed}
            icon={CheckCircle}
            color="emerald"
            change={inquirySummary?.changes?.confirmed}
            subtitle="Successful conversions"
          />
          <StatCard
            title="Conversion Rate"
            value={inquirySummary?.conversionRate}
            icon={Target}
            color="purple"
            subtitle="Success percentage"
          />
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Enhanced Inquiries by Status */}
          <ChartContainer title="Status Distribution" icon={BarChart3}>
            {loadingStates.inquiriesByStatus ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inquiriesByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                    >
                      {inquiriesByStatus.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.status] || STATUS_COLORS.default} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3">
                  {inquiriesByStatus.map((entry, index) => (
                    <div key={entry.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: STATUS_COLORS[entry.status] || STATUS_COLORS.default }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {entry.label || entry.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-800">{entry.count}</span>
                        {entry.percentage && (
                          <div className="text-xs text-gray-500">{entry.percentage}%</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartContainer>

          {/* Enhanced Monthly Trends */}
          <ChartContainer title="Monthly Trends" icon={TrendingUp}>
            {loadingStates.monthlyInquiries ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyInquiries}>
                  <defs>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#colorInquiries)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  />
                  {monthlyInquiries[0]?.confirmed !== undefined && (
                    <Area 
                      type="monotone" 
                      dataKey="confirmed" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="none"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>

        {/* Action Stats and Software Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Enhanced Action Stats */}
          <ChartContainer title="Action Types" icon={Activity}>
            {loadingStates.actionStats ? (
              <LoadingSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actionStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#actionGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="actionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6"/>
                      <stop offset="100%" stopColor="#a78bfa"/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>

          {/* Software Distribution */}
          <ChartContainer title="Software Insights" icon={Code}>
            {loadingStates.softwareStats ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Inquiry Software</h4>
                  <div className="space-y-2">
                    {softwareStats?.inquiries?.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{item.software}</span>
                        <span className="text-sm font-bold text-blue-800">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Website Software</h4>
                  <div className="space-y-2">
                    {softwareStats?.websites?.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{item.software}</span>
                        <span className="text-sm font-bold text-green-800">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="mb-10">
          <ChartContainer title="Conversion Funnel" icon={Target}>
            {loadingStates.conversionFunnel ? (
              <LoadingSkeleton />
            ) : !conversionFunnel || conversionFunnel.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <Target className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium">No conversion data available</p>
                <p className="text-sm mt-2">Conversion funnel data will appear here when available</p>
                <button
                  onClick={() => fetchConversionFunnel()}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="h-[400px]">
                <div className="w-full h-full flex flex-col">
                  <div className="text-sm text-gray-500 mb-2 text-center">
                    {conversionFunnel.length} stages loaded
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={conversionFunnel}
                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                        barCategoryGap={15}
                        barGap={2}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="label"
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                          formatter={(value, name, props) => {
                            return [
                              <span key="value" className="font-semibold">
                                {value}%
                              </span>,
                              <span key="label" className="text-gray-600">
                                {props.payload?.label || 'Stage'}
                              </span>
                            ];
                          }}
                          labelFormatter={() => 'Stage'}
                        />
                        <Bar 
                          dataKey="percentage"
                          name="Conversions"
                          radius={[0, 4, 4, 0]}
                          animationDuration={1000}
                        >
                          {conversionFunnel.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={COLORS.primary[index % COLORS.primary.length]}
                              stroke="#fff"
                              strokeWidth={1}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  <p>Conversion percentage at each stage</p>
                </div>
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Enhanced Location Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* States */}
          <ChartContainer title="Top States" className="lg:col-span-1" icon={Globe}>
            {loadingStates.websitesByLocation ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3">
                {websitesByLocation.states?.slice(0, 6).map((state, index) => (
                  <div key={state.stateId || index} className="group hover:bg-blue-50 transition-colors duration-200 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-700">{state.name}</span>
                      </div>
                      <span className="font-bold text-blue-800 text-lg">{state.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ChartContainer>

          {/* Districts */}
          <ChartContainer title="Top Districts" className="lg:col-span-1" icon={Building}>
            {loadingStates.websitesByLocation ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3">
                {websitesByLocation.districts?.slice(0, 6).map((district, index) => (
                  <div key={district.districtId || index} className="group hover:bg-emerald-50 transition-colors duration-200 p-4 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-emerald-700">{district.name}</span>
                      </div>
                      <span className="font-bold text-emerald-800 text-lg">{district.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ChartContainer>

          {/* Palikas */}
          <ChartContainer title="Top Palikas" className="lg:col-span-1" icon={Home}>
            {loadingStates.websitesByLocation ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-3">
                {websitesByLocation.palikas?.slice(0, 6).map((palika, index) => (
                  <div key={palika.palikaId || index} className="group hover:bg-purple-50 transition-colors duration-200 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-purple-700">{palika.name}</span>
                      </div>
                      <span className="font-bold text-purple-800 text-lg">{palika.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Recent Activities Section */}
        {recentActivities && (
          <div className="mt-10">
            <ChartContainer title="Recent Activities" icon={Clock}>
              {loadingStates.recentActivities ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Recent Inquiries</h4>
                    <div className="space-y-3">
                      {recentActivities.recentInquiries?.slice(0, 5).map((inquiry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium text-gray-800">{inquiry.inquirerName}</p>
                            <p className="text-sm text-gray-500">{inquiry.software}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              inquiry.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              inquiry.status === 'canceled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {inquiry.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(inquiry.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Recent Websites</h4>
                    <div className="space-y-3">
                      {recentActivities.recentWebsites?.slice(0, 5).map((website, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div>
                            <p className="font-medium text-gray-800">{website.software}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(website.startDate).toLocaleDateString()} - {new Date(website.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ChartContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;