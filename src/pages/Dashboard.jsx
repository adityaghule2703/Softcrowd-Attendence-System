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
  const [recentBatches, setRecentBatches] = useState([])
  const [batchesLoading, setBatchesLoading] = useState(true)

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

    const fetchRecentBatches = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }
        
        const response = await axios.get(`${BASE_URL}/batches`, { headers })
        // Get latest 5 batches (first 5 from the response)
        const latestBatches = response.data.data.slice(0, 5)
        setRecentBatches(latestBatches)
      } catch (err) {
        console.error('Error fetching batches:', err)
        setRecentBatches([])
      } finally {
        setBatchesLoading(false)
      }
    }

    fetchStats()
    fetchRecentBatches()
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

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Format time to readable format
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    const date = new Date(`2000-01-01T${timeString}`)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // Get icon based on domain or batch type
  const getBatchIcon = (batch) => {
    return (
      <svg className="w-4 h-4 text-[#00AEED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
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

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Available Domains */}
          <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#424347' }}>Available Domains</h3>
            <div className="h-56">
              <DoughnutChart />
            </div>
          </div>

          {/* Recent Batches */}
          <div className="bg-white rounded-lg p-4 border shadow-sm lg:col-span-2" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: '#424347' }}>Recent Batches</h3>
              <button className="text-[11px] font-medium" style={{ color: '#00AEED' }}>
                View All Batches
              </button>
            </div>
            <div className="space-y-3">
              {batchesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00AEED] mx-auto mb-2"></div>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>Loading batches...</p>
                  </div>
                </div>
              ) : recentBatches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>No batches found</p>
                </div>
              ) : (
                recentBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0, 174, 237, 0.1)' }}>
                      {getBatchIcon(batch)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-medium" style={{ color: '#424347' }}>{batch.name}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0, 174, 237, 0.1)', color: '#00AEED' }}>
                          {batch.domain?.name || 'No Domain'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px]" style={{ color: '#6B7280' }}>
                          Trainer: {batch.trainer_name || batch.trainer?.name || 'N/A'}
                        </p>
                        <span className="text-[8px]" style={{ color: '#D1D5DB' }}>•</span>
                        <p className="text-[10px]" style={{ color: '#6B7280' }}>
                          Strength: {batch.strength || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[9px]" style={{ color: '#9CA3AF' }}>
                          {formatDate(batch.start_date)} - {formatDate(batch.end_date)}
                        </p>
                        <span className="text-[8px]" style={{ color: '#D1D5DB' }}>•</span>
                        <p className="text-[9px]" style={{ color: '#9CA3AF' }}>
                          {formatTime(batch.start_time)} - {formatTime(batch.end_time)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${batch.is_paused ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    </div>
                  </div>
                ))
              )}
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