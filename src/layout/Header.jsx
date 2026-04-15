import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, ChevronDown, Search, Menu, X } from "lucide-react";

const Header = ({ onMenuClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "Monthly report ready", time: "1 hour ago", read: false },
    { id: 3, title: "System update completed", time: "3 hours ago", read: true },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 z-20 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid rgba(0, 174, 237, 0.2)' }}>
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" style={{ color: '#424347' }} />
          </button>

          {/* Logo Section */}
          <img src="src/assets/images/softcrowd-logo.png" className="h-8 sm:h-10 w-auto" alt="" />

          {/* Mobile Search Button */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" style={{ color: '#00AEED' }} />
          </button>

          {/* Search Bar - Desktop */}
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
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-full transition-all duration-300 hover:scale-110" 
                style={{ background: '#F5F7FA' }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1A1A2E' }} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white" style={{ background: '#00AEED' }}></span>
              </button>

              {/* Notifications Dropdown Menu */}
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

            {/* Settings Button */}
            <button className="hidden sm:block p-2 rounded-full transition-all duration-300 hover:scale-110" style={{ background: '#F5F7FA' }}>
              <Settings className="w-5 h-5" style={{ color: '#1A1A2E' }} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l cursor-pointer" 
                style={{ borderColor: '#E2E8F0' }}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>Eleanor</p>
                  <p className="text-[10px]" style={{ color: '#00AEED' }}>Pro Member</p>
                </div>
                <div className="relative group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-white rounded-full p-0.5" style={{ background: '#00AEED' }} />
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border overflow-hidden z-30" style={{ borderColor: '#E5E7EB' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#424347' }}>Eleanor Vance</p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>eleanor@softcrowd.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors" style={{ color: '#424347' }}>My Profile</button>
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors" style={{ color: '#424347' }}>Account Settings</button>
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors" style={{ color: '#424347' }}>Billing</button>
                  </div>
                  <div className="border-t py-2" style={{ borderColor: '#E5E7EB' }}>
                    <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors text-red-600">Logout</button>
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