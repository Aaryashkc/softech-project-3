import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Users, LogOut} from 'lucide-react';
import { useAuthStore } from "../store/useAuthStore"
import { Link } from 'react-router-dom';
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { authUser, logout, isAdmin } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!authUser) {
    return null;
  }

  const getInitials = (name) => {
    if (!name) return authUser.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-slate-900 shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <Link to="/" className="text-xl font-bold text-white">
                Softech Foundation
              </Link>
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 text-white hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(authUser.name || authUser.fullName)}
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-300">
                        {authUser.email}
                      </span>
                      {isAdmin() && (
                        <span className="bg-blue-600 text-blue-100 text-xs font-medium px-2 py-0.5 rounded-full">
                          {authUser.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {getInitials(authUser.name || authUser.fullName)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {authUser.name || authUser.fullName || 'User'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {authUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">

                    {/* View Users (Admin only) */}
                    {isAdmin() && (
                      <button
                        onClick={() => {
                          // Add your users page navigation logic here
                          console.log('Navigate to users');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150"
                      >
                        <Users className="w-4 h-4" />
                        <Link to="/users" className="flex-1">
                          Manage Users
                        </Link>
                      </button>
                    )}

                    {/* Divider */}
                    <div className="border-t border-slate-700 my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;