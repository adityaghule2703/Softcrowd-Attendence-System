import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  GraduationCap,
  UserRound,
  Shield,
  FileText,
  LogOut,
  Sparkles,
  X,
  Building2,
  Layers3,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const location = useLocation();

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

  const mainMenu = [
  { path: "/", name: "Dashboard", icon: LayoutDashboard },
  { path: "/student-management", name: "Student Management", icon: Users },
  { path: "/dept-management", name: "Department Management", icon: Building2 },   // Department Icon
  { path: "/batch-management", name: "Batch Management", icon: Layers3 },         // Batch Icon
  { path: "/domain-management", name: "Domain Management", icon: Users },
  { path: "/trainers", name: "Trainers", icon: UserCog },
  { path: "/attendance", name: "Attendance", icon: CalendarCheck },
  { path: "/college-management", name: "College Management", icon: GraduationCap },
  { path: "/users", name: "Users", icon: UserRound },
  { path: "/roles", name: "Roles", icon: Shield },
  { path: "/reports", name: "Reports", icon: FileText },
];

  const sidebarContent = (
    <aside className="h-full flex flex-col overflow-y-auto scrollbar-hide" style={{ background: '#0F172A' }}>
      {/* Header with Logo and Close Button for Mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: '#1E293B' }}>
        <div className="flex items-center gap-2">
          <img src="src/assets/images/softcrowd-logo.png" className="h-8 w-auto" alt="SoftCrowd Logo" />
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Gradient Border Top - Desktop only */}
      <div className="hidden lg:block h-1 w-full" style={{ background: 'linear-gradient(90deg, #00AEED, #00D4FF, #00AEED)' }}></div>

      {/* Main Menu */}
      <div className="px-3 sm:px-5 mt-4 lg:mt-6">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-4 px-3" style={{ color: '#64748B' }}>
          <span className="inline-block w-1 h-1 rounded-full mr-2" style={{ background: '#00AEED' }}></span>
          Navigation
        </p>
        <nav className="space-y-1">
          {mainMenu.map((item) => {
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
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: '#00AEED', color: '#FFFFFF' }}>
                        3
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Insights Card */}
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

      {/* Logout */}
      <div className="px-3 sm:px-5 mt-auto mb-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-white/5" style={{ color: '#94A3B8' }}>
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );

  // For mobile: render as drawer
  if (isMobileOpen !== undefined) {
    return (
      <div className={`fixed top-0 left-0 bottom-0 w-72 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
    );
  }

  // For desktop: render as fixed sidebar
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 hidden lg:block">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;