import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Users, LogOut, UserPen} from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-16 py-2 sm:py-0 gap-2 sm:gap-0">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between">
            <Link to="/" className="text-lg sm:text-xl font-bold text-white">
              Softech Foundation
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex items-center justify-end">
            <div className="relative" ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 sm:space-x-3 text-white hover:bg-slate-800 px-2 py-2 sm:px-3 sm:py-2 rounded-lg transition-colors duration-200 w-full sm:w-auto"
              >
                {/* Avatar */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(authUser.name || authUser.fullName)}
                </div>
                {/* User Info (hide email on xs) */}
                <div className="hidden xs:flex items-center space-x-2">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-300 truncate max-w-[80px]">
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
                {/* Chevron only on xs */}
                <div className="flex xs:hidden">
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
                        <div className="text-xs text-slate-400 break-all">
                          {authUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Leads */}
                    <Link 
                      to="/inquiries" 
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserPen className="w-4 h-4" />
                      <span>Leads</span>
                    </Link>
                    
                    {/* Divider */}
                    <div className="border-t border-slate-700 my-2"></div>
                    
                    {/* View Users (Admin only) */}
                    {isAdmin() && (
                      <Link 
                        to="/users" 
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Users className="w-4 h-4" />
                        <span>Manage Users</span>
                      </Link>
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