import React, { useState, useRef, useEffect } from "react";
import { Bell, Settings, User, ChevronDown, Search, Menu, X } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../config/Config";

const Header = ({ onMenuClick, sidebarMenuItems = [] }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
          searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
        setSelectedSearchIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search function - matches any page containing the search term
  const performGlobalSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = sidebarMenuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    
    setSearchResults(results.slice(0, 10));
    setShowSearchDropdown(results.length > 0);
    setSelectedSearchIndex(-1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    performGlobalSearch(value);
  };

  const handleSearchKeyDown = (e) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSearchIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSearchIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSearchIndex >= 0 && searchResults[selectedSearchIndex]) {
          handleSearchResultClick(searchResults[selectedSearchIndex]);
        } else if (searchResults.length > 0) {
          handleSearchResultClick(searchResults[0]);
        }
        break;
      case 'Escape':
        setShowSearchDropdown(false);
        setSearchResults([]);
        setSearchQuery('');
        break;
    }
  };

  const handleSearchResultClick = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchDropdown(false);
    setSelectedSearchIndex(-1);
    setIsSearchOpen(false);
  };

  // Highlight matching text in search results
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-[#00AEED20] text-[#00AEED] px-0.5 rounded font-medium">
          {part}
        </mark> : 
        part
    );
  };

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
          <img src="./softcrowd-logo.png" className="h-8 sm:h-10 w-auto" alt="Logo" />

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" style={{ color: '#00AEED' }} />
          </button>

          {/* Desktop Search Box with Dropdown */}
          <div className="hidden md:block relative" ref={searchInputRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4" style={{ color: '#94A3B8' }} />
              </div>
              <input
                type="text"
                placeholder="Search pages..."
                className="w-80 pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{ 
                  background: '#F5F7FA', 
                  border: '1px solid #E2E8F0',
                  color: '#1A1A2E'
                }}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchDropdown(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                ref={searchDropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
                style={{ borderColor: '#E5E7EB', maxHeight: '400px', overflowY: 'auto' }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
                  <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                    Search Results ({searchResults.length})
                  </span>
                </div>
                {searchResults.map((result, index) => (
                  <button
                    key={result.path}
                    onClick={() => handleSearchResultClick(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b last:border-0 ${
                      index === selectedSearchIndex ? 'bg-gray-50' : ''
                    }`}
                    style={{ borderColor: '#F1F5F9' }}
                    onMouseEnter={() => setSelectedSearchIndex(index)}
                  >
                    <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: '#F0F9FF' }}>
                      {result.icon && <result.icon className="w-4 h-4" style={{ color: '#00AEED' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                        {highlightText(result.name, searchQuery)}
                      </p>
                      {result.description && (
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          {result.description}
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
                <div className="px-4 py-2 border-t" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#94A3B8' }}>
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    <span>Esc Close</span>
                  </div>
                </div>
              </div>
            )}

            {/* No Results State */}
            {showSearchDropdown && searchQuery.trim() !== "" && searchResults.length === 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="px-4 py-8 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E1' }} />
                  <p className="text-sm font-medium" style={{ color: '#64748B' }}>No pages found</p>
                  <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                    No results found for "{searchQuery}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Notifications */}
            {/* <div className="relative" ref={notificationRef}>
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
            </div> */}

            {/* Settings Button */}
            {/* <button className="hidden sm:block p-2 rounded-full transition-all duration-300 hover:scale-110" style={{ background: '#F5F7FA' }}>
              <Settings className="w-5 h-5" style={{ color: '#1A1A2E' }} />
            </button> */}

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
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-20 md:hidden" style={{ borderBottom: '1px solid #E5E7EB' }}>
            <div className="relative p-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#F5F7FA', border: '1px solid #E2E8F0' }}>
                <Search className="w-4 h-4" style={{ color: '#00AEED' }} />
                <input
                  type="text"
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: '#1A1A2E' }}
                  autoFocus
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                />
                <button onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}>
                  <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
                </button>
              </div>

              {/* Mobile Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="mt-2 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.path}
                        onClick={() => {
                          handleSearchResultClick(result);
                          setIsSearchOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b"
                        style={{ borderColor: '#F1F5F9' }}
                      >
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: '#F0F9FF' }}>
                          {result.icon && <result.icon className="w-4 h-4" style={{ color: '#00AEED' }} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                            {highlightText(result.name, searchQuery)}
                          </p>
                          {result.description && (
                            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{result.description}</p>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E1' }} />
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>No pages found</p>
                      <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;




// import React, { useState, useRef, useEffect } from "react";
// import { Bell, Settings, User, ChevronDown, Search, Menu, X, Download } from "lucide-react";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import BASE_URL from "../config/Config";
// import { QRCodeCanvas } from 'qrcode.react';

// const Header = ({ onMenuClick, sidebarMenuItems = [] }) => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showSearchDropdown, setShowSearchDropdown] = useState(false);
//   const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
//   const [showQRCode, setShowQRCode] = useState(false);

//   const profileRef = useRef(null);
//   const notificationRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const searchDropdownRef = useRef(null);
//   const qrModalRef = useRef(null);
//   const navigate = useNavigate();

//   const DRIVE_URL = "https://drive.google.com/drive/folders/1oSfUHhZCBxOil6FTftuaC56Kw2exM2_m";

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) { navigate('/login'); return; }

//         const response = await axios.get(`${BASE_URL}/me`, {
//           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//         });

//         if (response.data && response.data.success) {
//           setUserData(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           navigate('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [navigate]);

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setIsNotificationsOpen(false);
//       }
//       if (searchInputRef.current && !searchInputRef.current.contains(event.target) &&
//           searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
//         setShowSearchDropdown(false);
//         setSelectedSearchIndex(-1);
//       }
//       if (qrModalRef.current && !qrModalRef.current.contains(event.target)) {
//         setShowQRCode(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Global search function - matches any page containing the search term
//   const performGlobalSearch = (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       setShowSearchDropdown(false);
//       return;
//     }

//     const searchTerm = query.toLowerCase().trim();
//     const results = sidebarMenuItems.filter(item => 
//       item.name.toLowerCase().includes(searchTerm)
//     );
    
//     setSearchResults(results.slice(0, 10));
//     setShowSearchDropdown(results.length > 0);
//     setSelectedSearchIndex(-1);
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     performGlobalSearch(value);
//   };

//   const handleSearchKeyDown = (e) => {
//     if (searchResults.length === 0) return;

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedSearchIndex(prev => 
//           prev < searchResults.length - 1 ? prev + 1 : prev
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedSearchIndex(prev => prev > 0 ? prev - 1 : -1);
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (selectedSearchIndex >= 0 && searchResults[selectedSearchIndex]) {
//           handleSearchResultClick(searchResults[selectedSearchIndex]);
//         } else if (searchResults.length > 0) {
//           handleSearchResultClick(searchResults[0]);
//         }
//         break;
//       case 'Escape':
//         setShowSearchDropdown(false);
//         setSearchResults([]);
//         setSearchQuery('');
//         break;
//     }
//   };

//   const handleSearchResultClick = (result) => {
//     navigate(result.path);
//     setSearchQuery('');
//     setSearchResults([]);
//     setShowSearchDropdown(false);
//     setSelectedSearchIndex(-1);
//     setIsSearchOpen(false);
//   };

//   // Highlight matching text in search results
//   const highlightText = (text, searchTerm) => {
//     if (!searchTerm) return text;
//     const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
//     return parts.map((part, i) => 
//       part.toLowerCase() === searchTerm.toLowerCase() ? 
//         <mark key={i} className="bg-[#00AEED20] text-[#00AEED] px-0.5 rounded font-medium">
//           {part}
//         </mark> : 
//         part
//     );
//   };

//   const notifications = [
//     { id: 1, title: "New user registered", time: "2 min ago", read: false },
//     { id: 2, title: "Monthly report ready", time: "1 hour ago", read: false },
//     { id: 3, title: "System update completed", time: "3 hours ago", read: true },
//   ];

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) { navigate('/login'); return; }

//       await axios.post(`${BASE_URL}/logout`, {}, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       });
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       setIsLoggingOut(false);
//       setIsProfileOpen(false);
//       navigate('/login');
//     }
//   };

//   const getUserInitials = () => {
//     if (!userData?.name) return 'U';
//     return userData.name.charAt(0).toUpperCase();
//   };

//   const getUserRoleDisplay = () => {
//     if (!userData?.role) return 'Member';
//     if (userData.role === 'NO PERMISSION') return 'Member';
//     return userData.role;
//   };

//   const formatMobileNumber = (mobile) => {
//     if (!mobile) return 'No mobile number';
//     if (mobile.length === 10) return `+91 ${mobile.slice(0, 5)}${mobile.slice(5)}`;
//     return mobile;
//   };

//   const handleDownloadAPK = () => {
//     setShowQRCode(true);
//   };

//   if (loading) {
//     return (
//       <header className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid rgba(0, 174, 237, 0.2)' }}>
//         <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
//             <div className="hidden sm:block">
//               <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
//               <div className="w-16 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <>
//       <header className="fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid rgba(0, 174, 237, 0.2)' }}>
//         <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

//           {/* Mobile Menu Button */}
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             style={{ position: 'relative', zIndex: 60 }} 
//           >
//             <Menu className="w-5 h-5" style={{ color: '#424347' }} />
//           </button>

//           {/* Logo */}
//           <img src="./softcrowd-logo.png" className="h-8 sm:h-10 w-auto" alt="Logo" />

//           {/* Mobile Search Button */}
//           <button
//             onClick={() => setIsSearchOpen(!isSearchOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//           >
//             <Search className="w-5 h-5" style={{ color: '#00AEED' }} />
//           </button>

//           {/* Desktop Search Box with Dropdown */}
//           <div className="hidden md:block relative" ref={searchInputRef}>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="w-4 h-4" style={{ color: '#94A3B8' }} />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search pages..."
//                 className="w-80 pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
//                 style={{ 
//                   background: '#F5F7FA', 
//                   border: '1px solid #E2E8F0',
//                   color: '#1A1A2E'
//                 }}
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onKeyDown={handleSearchKeyDown}
//                 onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
//               />
//               {searchQuery && (
//                 <button 
//                   onClick={() => {
//                     setSearchQuery('');
//                     setSearchResults([]);
//                     setShowSearchDropdown(false);
//                   }}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
//                 </button>
//               )}
//             </div>

//             {/* Search Results Dropdown */}
//             {showSearchDropdown && searchResults.length > 0 && (
//               <div 
//                 ref={searchDropdownRef}
//                 className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
//                 style={{ borderColor: '#E5E7EB', maxHeight: '400px', overflowY: 'auto' }}
//               >
//                 <div className="px-4 py-2 border-b" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
//                   <span className="text-xs font-medium" style={{ color: '#64748B' }}>
//                     Search Results ({searchResults.length})
//                   </span>
//                 </div>
//                 {searchResults.map((result, index) => (
//                   <button
//                     key={result.path}
//                     onClick={() => handleSearchResultClick(result)}
//                     className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b last:border-0 ${
//                       index === selectedSearchIndex ? 'bg-gray-50' : ''
//                     }`}
//                     style={{ borderColor: '#F1F5F9' }}
//                     onMouseEnter={() => setSelectedSearchIndex(index)}
//                   >
//                     <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: '#F0F9FF' }}>
//                       {result.icon && <result.icon className="w-4 h-4" style={{ color: '#00AEED' }} />}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
//                         {highlightText(result.name, searchQuery)}
//                       </p>
//                       {result.description && (
//                         <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
//                           {result.description}
//                         </p>
//                       )}
//                     </div>
//                     <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                 ))}
//                 <div className="px-4 py-2 border-t" style={{ borderColor: '#E5E7EB', background: '#F8FAFC' }}>
//                   <div className="flex items-center justify-between text-xs" style={{ color: '#94A3B8' }}>
//                     <span>↑↓ Navigate</span>
//                     <span>↵ Select</span>
//                     <span>Esc Close</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* No Results State */}
//             {showSearchDropdown && searchQuery.trim() !== "" && searchResults.length === 0 && (
//               <div 
//                 className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
//                 style={{ borderColor: '#E5E7EB' }}
//               >
//                 <div className="px-4 py-8 text-center">
//                   <Search className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E1' }} />
//                   <p className="text-sm font-medium" style={{ color: '#64748B' }}>No pages found</p>
//                   <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
//                     No results found for "{searchQuery}"
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-2 sm:gap-4">

//             {/* Download APK Button */}
//             <button
//               onClick={handleDownloadAPK}
//               className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
//               style={{ 
//                 background: 'linear-gradient(135deg, #00AEED, #00D4FF)',
//                 boxShadow: '0 2px 4px rgba(0,174,237,0.2)'
//               }}
//             >
//               <Download className="w-4 h-4 text-white" />
//               <span className="text-sm font-medium text-white">Download APK</span>
//             </button>

//             {/* Mobile Download APK Button */}
//             <button
//               onClick={handleDownloadAPK}
//               className="sm:hidden p-2 rounded-full transition-all duration-300 hover:scale-110"
//               style={{ background: '#F5F7FA' }}
//             >
//               <Download className="w-4 h-4" style={{ color: '#00AEED' }} />
//             </button>

//             {/* Profile */}
//             <div className="relative" ref={profileRef}>
//               <div
//                 onClick={() => setIsProfileOpen(!isProfileOpen)}
//                 className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l cursor-pointer"
//                 style={{ borderColor: '#E2E8F0' }}
//               >
//                 <div className="text-right hidden sm:block">
//                   <p className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{userData?.name || 'User'}</p>
//                   <p className="text-[10px]" style={{ color: '#00AEED' }}>{getUserRoleDisplay()}</p>
//                 </div>
//                 <div className="relative group">
//                   <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
//                     <span className="text-white font-semibold text-sm sm:text-base">{getUserInitials()}</span>
//                   </div>
//                   <ChevronDown className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-white rounded-full p-0.5" style={{ background: '#00AEED' }} />
//                 </div>
//               </div>

//               {isProfileOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-30" style={{ borderColor: '#E5E7EB' }}>
//                   <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)' }}>
//                         <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-sm font-semibold" style={{ color: '#424347' }}>{userData?.name || 'User'}</p>
//                         <p className="text-xs" style={{ color: '#6B7280' }}>{userData?.mobile ? formatMobileNumber(userData.mobile) : 'No mobile number'}</p>
//                         <p className="text-xs mt-0.5" style={{ color: '#00AEED' }}>{userData?.email || 'No email'}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="py-2">
//                     <button
//                       onClick={handleLogout}
//                       disabled={isLoggingOut}
//                       className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
//                       style={{ color: '#EF4444' }}
//                     >
//                       {isLoggingOut ? 'Logging out...' : 'Logout'}
//                       {isLoggingOut && (
//                         <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Search Overlay */}
//         {isSearchOpen && (
//           <div className="fixed top-16 left-0 right-0 bg-white shadow-lg z-20 md:hidden" style={{ borderBottom: '1px solid #E5E7EB' }}>
//             <div className="relative p-4">
//               <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#F5F7FA', border: '1px solid #E2E8F0' }}>
//                 <Search className="w-4 h-4" style={{ color: '#00AEED' }} />
//                 <input
//                   type="text"
//                   placeholder="Search pages..."
//                   className="flex-1 bg-transparent text-sm outline-none"
//                   style={{ color: '#1A1A2E' }}
//                   autoFocus
//                   value={searchQuery}
//                   onChange={handleSearchChange}
//                   onKeyDown={handleSearchKeyDown}
//                 />
//                 <button onClick={() => {
//                   setIsSearchOpen(false);
//                   setSearchQuery("");
//                   setSearchResults([]);
//                 }}>
//                   <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
//                 </button>
//               </div>

//               {/* Mobile Search Results */}
//               {searchQuery.trim() !== "" && (
//                 <div className="mt-2 max-h-96 overflow-y-auto">
//                   {searchResults.length > 0 ? (
//                     searchResults.map((result) => (
//                       <button
//                         key={result.path}
//                         onClick={() => {
//                           handleSearchResultClick(result);
//                           setIsSearchOpen(false);
//                         }}
//                         className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b"
//                         style={{ borderColor: '#F1F5F9' }}
//                       >
//                         <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: '#F0F9FF' }}>
//                           {result.icon && <result.icon className="w-4 h-4" style={{ color: '#00AEED' }} />}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
//                             {highlightText(result.name, searchQuery)}
//                           </p>
//                           {result.description && (
//                             <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{result.description}</p>
//                           )}
//                         </div>
//                       </button>
//                     ))
//                   ) : (
//                     <div className="px-4 py-8 text-center">
//                       <Search className="w-8 h-8 mx-auto mb-2" style={{ color: '#CBD5E1' }} />
//                       <p className="text-sm font-medium" style={{ color: '#64748B' }}>No pages found</p>
//                       <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
//                         No results found for "{searchQuery}"
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* QR Code Modal */}
// {showQRCode && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
//     <div 
//       ref={qrModalRef}
//       className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 transform transition-all"
//       style={{ animation: 'scaleIn 0.2s ease-out' }}
//     >
//       <div className="flex justify-end items-center mb-4">
//         <button
//           onClick={() => setShowQRCode(false)}
//           className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//         >
//           <X className="w-6 h-6" style={{ color: '#64748B' }} />
//         </button>
//       </div>
      
//       <div className="flex flex-col items-center">
//         <div className="p-8 bg-white rounded-2xl shadow-xl mb-6" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
//           <QRCodeCanvas 
//             value={DRIVE_URL}
//             size={400}
//             level="H"
//             includeMargin={true}
//             bgColor="#FFFFFF"
//             fgColor="#00AEED"
//           />
//         </div>
        
//         <a 
//           href={DRIVE_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-sm font-medium transition-all hover:scale-105"
//           style={{ color: '#00AEED' }}
//         >
//           {DRIVE_URL}
//         </a>
//       </div>
      
//       <button
//         onClick={() => setShowQRCode(false)}
//         className="w-full mt-6 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105"
//         style={{ background: 'linear-gradient(135deg, #00AEED, #00D4FF)', color: 'white' }}
//       >
//         Close
//       </button>
//     </div>
//   </div>
// )}

//       <style>{`
//         @keyframes scaleIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;