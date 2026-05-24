// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import DoughnutChart from '../components/DoughnutChart'
import axios from 'axios'
import BASE_URL from '../config/Config'


const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days')
  const [statsData, setStatsData] = useState({
    students: null,
    batches: null,
    colleges: null,
    departments: null,
  })
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const [studentsRes, batchesRes, collegesRes, departmentsRes] = await Promise.allSettled([
          axios.get(`${BASE_URL}/students`, { headers }),
          axios.get(`${BASE_URL}/batches`, { headers }),
          axios.get(`${BASE_URL}/colleges`, { headers }),
          axios.get(`${BASE_URL}/departments`, { headers }),
        ])

        setStatsData({
          students: studentsRes.status === 'fulfilled' ? studentsRes.value.data.total : '—',
          batches: batchesRes.status === 'fulfilled' ? batchesRes.value.data.total : '—',
          colleges: collegesRes.status === 'fulfilled' ? collegesRes.value.data.total : '—',
          departments: departmentsRes.status === 'fulfilled' ? departmentsRes.value.data.total : '—',
        })

        if (studentsRes.status === 'fulfilled') {
          setStudents(studentsRes.value.data.data.slice(0, 5))
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    {
      label: "Total Students",
      value: loading ? '...' : statsData.students,
      change: "+12.5%",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.1a9 9 0 10-18 0" />
        </svg>
      ),
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    {
      label: "Total Batches",
      value: loading ? '...' : statsData.batches,
      change: "+8.2%",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    {
      label: "Total Colleges",
      value: loading ? '...' : statsData.colleges,
      change: "+23.1%",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
    {
      label: "Total Departments",
      value: loading ? '...' : statsData.departments,
      change: "+5.4%",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "from-[#00AEED] to-[#00AEED]",
      trend: "up"
    },
  ]

  const recentActivities = [
    { user: "Alex Johnson", action: "added new user", time: "2 min ago", type: "user" },
    { user: "Sarah Miller", action: "updated billing settings", time: "15 min ago", type: "settings" },
    { user: "Mike Wilson", action: "completed order #2345", time: "1 hour ago", type: "order" },
    { user: "Emma Davis", action: "uploaded monthly report", time: "2 hours ago", type: "report" },
    { user: "John Smith", action: "created new project", time: "4 hours ago", type: "project" },
  ]

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'settings':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        )
      case 'order':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'report':
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
    }
  }

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#6B7280' }}>{stat.label}</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: '#424347' }}>
                    {stat.value ?? '—'}
                  </p>
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

        {/* Latest Students Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Latest Students</h3>
            <button className="text-[11px] font-medium" style={{ color: '#00AEED' }}>
              View All Students
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(0, 174, 237, 0.05)' }}>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Student</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Mobile</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>College</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Department</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Batch</th>
                  <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs" style={{ color: '#9CA3AF' }}>
                      Loading students...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs" style={{ color: '#9CA3AF' }}>
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: '#F3F4F6' }}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#00AEED' }}>
                            <span className="text-white text-[10px] font-medium">
                              {student.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs font-medium" style={{ color: '#424347' }}>{student.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs" style={{ color: '#6B7280' }}>{student.mobile}</td>
                      <td className="p-3 text-xs" style={{ color: '#6B7280' }}>
                        {student.college?.name ?? '—'}
                      </td>
                      <td className="p-3 text-xs" style={{ color: '#6B7280' }}>
                        {student.department?.department_name ?? '—'}
                      </td>
                      <td className="p-3 text-xs" style={{ color: '#6B7280' }}>
                        {student.batches?.[0]?.name ?? '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            background: student.is_blocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 174, 237, 0.1)',
                            color: student.is_blocked ? '#EF4444' : '#00AEED',
                          }}
                        >
                          {student.is_blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard