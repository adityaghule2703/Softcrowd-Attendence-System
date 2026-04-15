// pages/Dashboard.jsx
import React, { useState } from 'react'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import DoughnutChart from '../components/DoughnutChart'

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days')

  const stats = [
    { 
      label: "Total Revenue", 
      value: "$42,580", 
      change: "+12.5%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    { 
      label: "Total Users", 
      value: "3,847", 
      change: "+8.2%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.1a9 9 0 10-18 0" />
        </svg>
      ), 
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    { 
      label: "New Orders", 
      value: "1,854", 
      change: "+23.1%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ), 
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    { 
      label: "Growth Rate", 
      value: "42.7%", 
      change: "+5.4%", 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ), 
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
  ];

  const recentActivities = [
    { user: "Alex Johnson", action: "added new user", time: "2 min ago", type: "user" },
    { user: "Sarah Miller", action: "updated billing settings", time: "15 min ago", type: "settings" },
    { user: "Mike Wilson", action: "completed order #2345", time: "1 hour ago", type: "order" },
    { user: "Emma Davis", action: "uploaded monthly report", time: "2 hours ago", type: "report" },
    { user: "John Smith", action: "created new project", time: "4 hours ago", type: "project" },
  ];

  const topProducts = [
    { name: "Product A", sales: 245, revenue: "$12,450", growth: "+24%", stock: "In Stock" },
    { name: "Product B", sales: 189, revenue: "$9,850", growth: "+18%", stock: "In Stock" },
    { name: "Product C", sales: 156, revenue: "$7,890", growth: "+12%", stock: "In Stock" },
    { name: "Product D", sales: 132, revenue: "$6,540", growth: "+8%", stock: "Low Stock" },
    { name: "Product E", sales: 98, revenue: "$4,920", growth: "+5%", stock: "Low Stock" },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      case 'order':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'report':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  return (
    <div className="">
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#424347' }}>Dashboard Overview</h1>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Welcome back! Here's what's happening with your business today.</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00AEED] focus:border-transparent"
              style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="px-3 py-1.5 text-xs text-white rounded-md transition-all font-medium flex items-center gap-1.5" style={{ background: '#00AEED' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Cards - 4 Card Design with Icon on Top Right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>{stat.label}</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: '#424347' }}>{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${
                      stat.trend === 'up' ? 'bg-[#00AEED]/10 text-[#00AEED]' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.trend === 'up' ? (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      {stat.change}
                    </span>
                    <span className="text-[10px]" style={{ color: '#9CA3AF' }}>from last month</span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Revenue Overview</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>Monthly revenue and orders trends</p>
              </div>
              <select className="text-[11px] border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00AEED] focus:border-transparent" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <div className="h-72">
              <LineChart />
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Top Products</h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>Best selling products by revenue</p>
              </div>
              <button className="text-[11px] font-medium" style={{ color: '#00AEED' }}>
                View All
              </button>
            </div>
            <div className="h-72">
              <BarChart />
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Device Usage */}
          <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#424347' }}>Device Usage</h3>
            <div className="h-56">
              <DoughnutChart />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-4 border shadow-sm lg:col-span-2" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Recent Activities</h3>
              <button className="text-[11px] font-medium" style={{ color: '#00AEED' }}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 174, 237, 0.1)' }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      <span className="font-medium" style={{ color: '#424347' }}>{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{activity.time}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00AEED' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Top Selling Products</h3>
            <button className="text-[11px] font-medium" style={{ color: '#00AEED' }}>
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(0, 174, 237, 0.05)' }}>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Product</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Sales</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Revenue</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Growth</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded flex items-center justify-center shadow-sm" style={{ background: '#00AEED' }}>
                          <span className="text-white text-[10px] font-medium">{product.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#424347' }}>{product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs" style={{ color: '#6B7280' }}>{product.sales}</span>
                      <span className="text-[9px] ml-1" style={{ color: '#9CA3AF' }}>units</span>
                    </td>
                    <td className="p-3 text-xs font-medium" style={{ color: '#424347' }}>{product.revenue}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit" style={{ background: 'rgba(0, 174, 237, 0.1)', color: '#00AEED' }}>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {product.growth}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{
                        background: product.stock === 'In Stock' ? 'rgba(0, 174, 237, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: product.stock === 'In Stock' ? '#00AEED' : '#EF4444'
                      }}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard