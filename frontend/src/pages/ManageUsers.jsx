import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LoaderCircle, Shield, User, ShieldCheck } from 'lucide-react';

const ManageUsers = () => {
  const { users, isLoadingUsers, getAllUsers, promoteToAdmin, isAdmin, authUser } = useAuthStore();

  useEffect(() => {
    if (isAdmin()) {
      getAllUsers();
    }
  }, [getAllUsers, isAdmin]);

  // If not admin, show access denied
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  const handlePromote = async (userId) => {
    await promoteToAdmin(userId);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage all registered users</p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-medium">User</th>
                    <th className="py-4 px-6 text-left font-medium">Email</th>
                    <th className="py-4 px-6 text-left font-medium">Role</th>
                    <th className="py-4 px-6 text-left font-medium">Joined</th>
                    <th className="py-4 px-6 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-medium">
                                {user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.fullName || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{user.email}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {user.role === 'admin' ? (
                              <>
                                <ShieldCheck className="w-4 h-4 text-green-600 mr-2" />
                                <span className="text-green-600 font-medium">Admin</span>
                              </>
                            ) : (
                              <>
                                <User className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">User</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          {user.role === 'user' && user._id !== authUser._id && (
                            <button
                              onClick={() => handlePromote(user._id)}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Promote to Admin
                            </button>
                          )}
                          {user.role === 'admin' && (
                            <span className="text-green-600 text-sm font-medium">Already Admin</span>
                          )}
                          {user._id === authUser._id && (
                          
                            <span className="text-gray-500 text-sm">  <br /> Current User</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <User className="w-8 h-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Regular Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(user => user.role === 'user').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
