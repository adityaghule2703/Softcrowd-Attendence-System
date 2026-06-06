import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarMenuItems, setSidebarMenuItems] = useState([]);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileSidebarOpen]);

  // This function receives the filtered menu items from Sidebar
  const handleMenuItemsLoad = (items) => {
    setSidebarMenuItems(items);
  };

  return (
    <div style={{ background: '#F8FAFC' }}>
      <Header 
        onMenuClick={() => setIsMobileSidebarOpen(true)} 
        sidebarMenuItems={sidebarMenuItems}
      />

      {/* Desktop Sidebar */}
      <Sidebar onMenuItemsLoad={handleMenuItemsLoad} />

      {/* Mobile Sidebar Drawer */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onMenuItemsLoad={handleMenuItemsLoad}
      />

      {/* Main Content */}
      <main
        className="lg:ml-72 mt-16 p-4 sm:p-6 lg:p-8 transition-all duration-300"
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;