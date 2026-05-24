import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, ChevronDown, Search, Menu, X } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../config/Config";

const Header = ({ onMenuClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const response = await axios.get(`${BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (response.data && response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "Monthly report ready", time: "1 hour ago", read: false },
    { id: 3, title: "System update completed", time: "3 hours ago", read: true },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      await axios.post(`${BASE_URL}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggingOut(false);
      setIsProfileOpen(false);
      navigate('/login');
    }
  };

  const getUserInitials = () => {
    if (!userData?.name) return 'U';
    return userData.name.charAt(0).toUpperCase();
  };

  const getUserRoleDisplay = () => {
    if (!userData?.role) return 'Member';
    if (userData.role === 'NO PERMISSION') return 'Member';
    return userData.role;
  };

  const formatMobileNumber = (mobile) => {
    if (!mobile) return 'No mobile number';
    if (mobile.length === 10) return `+91 ${mobile.slice(0, 5)}${mobile.slice(5)}`;
    return mobile;
  };

  if (loading) {
    return (
      // ↓ z-50 so header is always above sidebar backdrop (z-40)
      <header className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid rgba(0, 174, 237, 0.2)' }}>
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="hidden sm:block">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* ↓ z-50 so header is always above sidebar backdrop (z-40) */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid rgba(0, 174, 237, 0.2)' }}>
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ position: 'relative', zIndex: 60 }} 
          >
            <Menu className="w-5 h-5" style={{ color: '#424347' }} />
          </button>

          {/* Logo */}
          <img src="src/assets/images/softcrowd-logo.png" className="h-8 sm:h-10 w-auto" alt="Logo" />

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" style={{ color: '#00AEED' }} />
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#F5F7FA', border: '1px solid #E2E8F0' }}>
            <Search className="w-4 h-4" style={{ color: '#00AEED' }} />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-sm outline-none w-64 lg:w-80"
              style={{ color: '#1A1A2E' }}
            />
            <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: '#FFFFFF', color: '#94A3B8' }}>⌘K</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ background: '#F5F7FA' }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1A1A2E' }} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white" style={{ background: '#00AEED' }}></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border overflow-hidden z-30" style={{ borderColor: '#E5E7EB' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
                    <span className="text-sm font-semibold" style={{ color: '#424347' }}>Notifications</span>
                    <button className="text-xs" style={{ color: '#00AEED' }}>Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-0" style={{ borderColor: '#F3F4F6' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: notif.read ? '#94A3B8' : '#00AEED' }}></div>
                          <div className="flex-1">
                            <p className="text-sm" style={{ color: notif.read ? '#6B7280' : '#424347' }}>{notif.title}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t text-center" style={{ borderColor: '#E5E7EB' }}>
                    <button className="text-xs" style={{ color: '#00AEED' }}>View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="hidden sm:block p-2 rounded-full transition-all duration-300 hover:scale-110" style={{ background: '#F5F7FA' }}>
              <Settings className="w-5 h-5" style={{ color: '#1A1A2E' }} />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l cursor-pointer"
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{userData?.name || 'User'}</p>
                  <p className="text-[10px]" style={{ color: '#00AEED' }}>{getUserRoleDisplay()}</p>
                </div>
                <div className="relative group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
                    <span className="text-white font-semibold text-sm sm:text-base">{getUserInitials()}</span>
                  </div>
                  <ChevronDown className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-white rounded-full p-0.5" style={{ background: '#00AEED' }} />
                </div>
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-30" style={{ borderColor: '#E5E7EB' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
                        <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: '#424347' }}>{userData?.name || 'User'}</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>{userData?.mobile ? formatMobileNumber(userData.mobile) : 'No mobile number'}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#00AEED' }}>{userData?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      style={{ color: '#EF4444' }}
                    >
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                      {isLoggingOut && (
                        <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="fixed top-16 left-0 right-0 bg-white p-4 shadow-lg z-20 md:hidden" style={{ borderBottom: '1px solid #E5E7EB' }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#F5F7FA', border: '1px solid #E2E8F0' }}>
              <Search className="w-4 h-4" style={{ color: '#00AEED' }} />
              <input
                type="text"
                placeholder="Search anything..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#1A1A2E' }}
                autoFocus
              />
              <button onClick={() => setIsSearchOpen(false)}>
                <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;