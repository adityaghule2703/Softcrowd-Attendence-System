import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCog, CalendarCheck, GraduationCap,
  UserRound, Shield, FileText, LogOut, Sparkles, X, Building2, Layers3,
} from "lucide-react";
import { canViewPage, MODULES, PAGES } from "../utils/modulePermissions";
import BASE_URL from "../config/Config";

const Sidebar = ({ isMobileOpen, onClose, onMenuItemsLoad }) => {
  const location = useLocation();
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [accessibleMenuItems, setAccessibleMenuItems] = useState([]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setUserPermissions(result.data.permissions || []);
            setUserRole(result.data.role || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPermissions();
  }, []);

  const hasViewPermission = (moduleKey, pageName) => {
    if (userRole === "Super Admin" || userRole === "Admin") return true;
    return canViewPage(userPermissions, moduleKey, pageName);
  };

  const mainMenu = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard, moduleKey: MODULES.DASHBOARD, pageName: PAGES.DASHBOARD, description: "View analytics and statistics" },
    { path: "/domain-management", name: "Domain Management", icon: Users, moduleKey: MODULES.DOMAIN_MANAGEMENT, pageName: PAGES.DOMAIN_MANAGEMENT, description: "Manage domains" },
     { path: "/batch-management", name: "Batch Management", icon: Layers3, moduleKey: MODULES.BATCH_MANAGEMENT, pageName: PAGES.BATCH_MANAGEMENT, description: "Manage batches" },
     { path: "/dept-management", name: "Department Management", icon: Building2, moduleKey: MODULES.DEPARTMENT_MANAGEMENT, pageName: PAGES.DEPARTMENT_MANAGEMENT, description: "Manage departments" },
    { path: "/college-management", name: "College Management", icon: GraduationCap, moduleKey: MODULES.COLLEGE_MANAGEMENT, pageName: PAGES.COLLEGE_MANAGEMENT, description: "Manage colleges" },
    { path: "/student-management", name: "Student Management", icon: Users, moduleKey: MODULES.STUDENT_MANAGEMENT, pageName: PAGES.STUDENT_MANAGEMENT, description: "Manage students" },
     { path: "/holiday-management", name: "Holiday Management", icon: Users, moduleKey: MODULES.HOLIDAY_MANAGEMENT, pageName: PAGES.HOLIDAY_MANAGEMENT, description: "Manage holidays" },
    { path: "/attendance", name: "Attendance", icon: CalendarCheck, moduleKey: MODULES.ATTENDANCE, pageName: PAGES.ATTENDANCE, description: "Track attendance" },
    { path: "/users", name: "Users", icon: UserRound, moduleKey: MODULES.USERS, pageName: PAGES.USERS, description: "Manage users" },
    { path: "/roles", name: "Roles", icon: Shield, moduleKey: MODULES.ROLES, pageName: PAGES.ROLES, description: "Manage roles" },
    { path: "/reports", name: "Reports", icon: FileText, moduleKey: MODULES.REPORTS, pageName: PAGES.REPORTS, description: "View reports" },
  ];

  // Filter menu items based on permissions
  useEffect(() => {
    const filtered = mainMenu.filter(item =>
      hasViewPermission(item.moduleKey, item.pageName)
    );
    setAccessibleMenuItems(filtered);
    
    // Pass the filtered menu items to parent component (Layout)
    if (onMenuItemsLoad) {
      onMenuItemsLoad(filtered);
    }
  }, [userPermissions, userRole]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onClose && isMobileOpen) {
      onClose();
    }
  }, [location.pathname]);

  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
      isActive ? "text-white" : "text-gray-400 hover:text-white"
    }`;

  const activeStyle = {
    background: 'linear-gradient(135deg, #00AEED, #00D4FF)',
    boxShadow: '0 0 20px rgba(0, 174, 237, 0.3)'
  };

  const sidebarContent = (
    <aside className="h-full flex flex-col overflow-y-auto scrollbar-hide" style={{ background: '#0F172A' }}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: '#1E293B' }}>
        <img src="./softcrowd-logo.png" className="h-8 w-auto" alt="SoftCrowd Logo" />
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Gradient Border Top - Desktop only */}
      <div className="hidden lg:block h-1 w-full" style={{ background: 'linear-gradient(90deg, #00AEED, #00D4FF, #00AEED)' }}></div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEED]"></div>
        </div>
      ) : (
        <>
          <div className="px-3 sm:px-5 mt-4 lg:mt-6">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-4 px-3" style={{ color: '#64748B' }}>
              <span className="inline-block w-1 h-1 rounded-full mr-2" style={{ background: '#00AEED' }}></span>
              Navigation
            </p>
            <nav className="space-y-1">
              {accessibleMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={menuItemClass}
                    style={({ isActive }) => isActive ? activeStyle : {}}
                    onClick={onClose}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.name === "Reports" && !isActive && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: '#00AEED', color: '#FFFFFF' }}>3</span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {accessibleMenuItems.length === 0 && (
            <div className="px-3 sm:px-5 mt-8 text-center">
              <p className="text-sm text-gray-400">No modules accessible</p>
              <p className="text-xs text-gray-500 mt-1">Contact your administrator</p>
            </div>
          )}

          {/* {hasViewPermission(MODULES.DASHBOARD, PAGES.DASHBOARD) && (
            <div className="mx-3 sm:mx-5 my-6 p-4 rounded-xl" style={{ background: 'rgba(0, 174, 237, 0.1)', border: '1px solid rgba(0, 174, 237, 0.2)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: '#00AEED' }}>AI Insights</span>
                <Sparkles className="w-3 h-3" style={{ color: '#00AEED' }} />
              </div>
              <p className="text-sm text-white mb-3">Your activity increased by 32% this week</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1E293B' }}>
                  <div className="h-full w-[68%] rounded-full" style={{ background: 'linear-gradient(90deg, #00AEED, #00D4FF)' }}></div>
                </div>
                <span className="text-xs font-bold text-white">68%</span>
              </div>
            </div>
          )} */}
        </>
      )}

      <div className="px-3 sm:px-5 mt-auto mb-6">
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-white/5"
          style={{ color: '#94A3B8' }}
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );

  // MOBILE: overlay drawer
  if (isMobileOpen !== undefined) {
    return (
      <>
        {/* Backdrop — z-[55] sits above header (z-50) on mobile */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 lg:hidden"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 55 }}
            onClick={onClose}
          />
        )}
        {/* Drawer — z-[60] sits above backdrop */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ zIndex: 60 }}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // DESKTOP: fixed sidebar
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 hidden lg:block" style={{ zIndex: 10 }}>
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;