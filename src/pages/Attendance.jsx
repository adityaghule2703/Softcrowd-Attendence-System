import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Save, RefreshCw, Calendar, Filter, FileSpreadsheet, FileText, ChevronsLeft, ChevronsRight } from 'lucide-react';
import dayjs from 'dayjs';
import { Autocomplete, TextField, Box, Paper, styled, Typography } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../config/Config';

// Custom Paper component for Autocomplete without scrollbars
const CustomPaper = styled(Paper)({
  maxHeight: 200,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  '& .MuiAutocomplete-listbox': {
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none'
  }
});

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const tableContainerRef = useRef(null);

  // Get unique batches from attendance data for filter dropdown
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    loadAttendanceData();
  }, [currentMonth]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
      const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');
      
      const response = await axios.get(`${BASE_URL}/admin/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });

      if (response.data && response.data.data) {
        setAttendanceData(response.data.data);
        
        // Extract unique batches for filter dropdown
        const uniqueBatches = [];
        const batchMap = new Map();
        response.data.data.forEach(item => {
          if (!batchMap.has(item.batch_id)) {
            batchMap.set(item.batch_id, {
              id: item.batch_id,
              name: item.batch_name || `Batch ${item.batch_id}`
            });
            uniqueBatches.push({
              id: item.batch_id,
              name: item.batch_name || `Batch ${item.batch_id}`
            });
          }
        });
        setBatches(uniqueBatches);
      } else {
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (studentId, batchId, date, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${BASE_URL}/attendance/toggle`, {
        student_id: studentId,
        batch_id: batchId,
        date: date
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.status) {
        // Update local state
        setAttendanceData(prevData => 
          prevData.map(item => {
            if (item.student_id === studentId && item.batch_id === batchId) {
              return {
                ...item,
                attendance: item.attendance.map(record => {
                  if (record.date === date) {
                    return { ...record, status: currentStatus === 'present' ? 'absent' : 'present' };
                  }
                  return record;
                })
              };
            }
            return item;
          })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling attendance:', error);
      return false;
    }
  };

  const saveAttendanceData = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaving(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save attendance. Please try again.');
      setSaving(false);
    }
  };

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const days = [];
    let currentDate = startOfMonth;
    while (currentDate <= endOfMonth) {
      days.push(currentDate);
      currentDate = currentDate.add(1, 'day');
    }
    return days;
  };

  const isPastDate = (date) => {
    return date.isBefore(dayjs(), 'day');
  };

  const isToday = (date) => {
    return date.isSame(dayjs(), 'day');
  };

  // Check if date is within batch's date range
  const isDateInBatchRange = (batchStartDate, batchEndDate, date) => {
    if (!batchStartDate || !batchEndDate) return false;
    const startDate = dayjs(batchStartDate);
    const endDate = dayjs(batchEndDate);
    return date.isAfter(startDate.subtract(1, 'day')) && date.isBefore(endDate.add(1, 'day'));
  };

  const getAttendanceForDate = (student, date) => {
    const dateStr = date.format('YYYY-MM-DD');
    
    // First check if date is within batch's date range
    const inBatchRange = isDateInBatchRange(student.start_date, student.end_date, date);
    
    if (!inBatchRange) {
      return 'na';
    }
    
    const attendanceRecord = student.attendance?.find(record => record.date === dateStr);
    
    if (attendanceRecord) {
      return attendanceRecord.status;
    }
    
    if (isPastDate(date)) {
      return 'absent';
    }
    
    return '';
  };

  const handleCellClick = async (student, date, currentStatus) => {
    const dateStr = date.format('YYYY-MM-DD');
    
    // Don't allow toggling if date is outside batch range
    if (!isDateInBatchRange(student.start_date, student.end_date, date)) {
      return;
    }
    
    await toggleAttendance(student.student_id, student.batch_id, dateStr, currentStatus);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'present': return 'P';
      case 'absent': return 'A';
      case 'na': return 'N/A';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'absent': return 'bg-red-100 text-red-700';
      case 'na': return 'bg-gray-100 text-gray-400';
      default: return '';
    }
  };

  const calculateAttendanceStats = (student) => {
    const days = getDaysInMonth();
    let present = 0, absent = 0, na = 0;
    
    days.forEach(date => {
      const status = getAttendanceForDate(student, date);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'na') na++;
    });
    
    const validDays = days.length - na;
    return { present, absent, na, validDays };
  };

  // Horizontal scroll functions
  const scrollLeft = () => {
    if (tableContainerRef.current) {
      const currentScroll = tableContainerRef.current.scrollLeft;
      tableContainerRef.current.scrollTo({
        left: currentScroll - 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      const currentScroll = tableContainerRef.current.scrollLeft;
      tableContainerRef.current.scrollTo({
        left: currentScroll + 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollToStart = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToEnd = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTo({
        left: tableContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  const days = getDaysInMonth();
  
  // Filter data by selected batch and search term
  const filteredData = attendanceData.filter(item => {
    const matchesBatch = !selectedBatch || item.batch_id === selectedBatch.id;
    const matchesSearch = item.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handlePreviousMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const todayDate = dayjs().format('DD MMM YYYY');

  // Updated CSV Export Function - Handling CSV properly
  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      
      // You can customize the export parameters based on your needs
      const selectedDate = currentMonth.format('YYYY-MM-DD');
      
      const response = await axios.get(`${BASE_URL}/reports/attendance`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        params: {
          type: 'day',  // or 'month', 'range' based on your API
          date: selectedDate
        },
        responseType: 'blob' // Important for file download
      });
      
      // Check the content type from response
      const contentType = response.headers['content-type'] || '';
      let fileExtension = '.csv';
      let mimeType = 'text/csv';
      
      if (contentType.includes('csv')) {
        fileExtension = '.csv';
        mimeType = 'text/csv';
      } else if (contentType.includes('excel') || contentType.includes('spreadsheetml')) {
        fileExtension = '.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: mimeType });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with current date and correct extension
      const filename = `attendance_report_${selectedDate}${fileExtension}`;
      link.setAttribute('download', filename);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        alert(`Failed to export report: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
      } else if (error.request) {
        alert('Failed to export report: No response from server. Please check your connection.');
      } else {
        alert(`Failed to export report: ${error.message}`);
      }
    } finally {
      setExporting(false);
    }
  };

  // Export for month range
  const handleExportExcelMonth = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
      const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');
      
      const response = await axios.get(`${BASE_URL}/reports/attendance`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        params: {
          type: 'range',
          start_date: startDate,
          end_date: endDate
        },
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'] || '';
      let fileExtension = '.csv';
      let mimeType = 'text/csv';
      
      if (contentType.includes('csv')) {
        fileExtension = '.csv';
        mimeType = 'text/csv';
      } else if (contentType.includes('excel') || contentType.includes('spreadsheetml')) {
        fileExtension = '.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      }
      
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `attendance_report_${startDate}_to_${endDate}${fileExtension}`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF');
    alert('Download PDF feature - Coming soon');
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="bg-white rounded-lg border shadow-sm p-2 sticky top-0 z-30" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
              <button onClick={handlePreviousMonth} className="p-1 rounded hover:bg-white transition">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-medium px-2 py-2" style={{ color: '#424347' }}>
                {currentMonth.format('MMMM YYYY')}
              </span>
              <button onClick={handleNextMonth} className="p-1 rounded hover:bg-white transition">
                <ChevronRight size={14} />
              </button>
            </div>
            <button 
              onClick={() => setCurrentMonth(dayjs())}
              className="px-2 py-2 text-[10px] rounded-md border flex items-center gap-1" 
              style={{ borderColor: '#00AEED', color: '#00AEED', background: '#E0F2FE' }}
            >
              <Calendar size={10} />
              Today: {todayDate}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative" style={{ width: '260px' }}>
              <Autocomplete
                options={batches}
                value={selectedBatch}
                onChange={(event, newValue) => {
                  setSelectedBatch(newValue);
                }}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Filter by Batch"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        fontSize: '0.7rem',
                        '&:hover fieldset': { borderColor: '#00AEED' },
                        '&.Mui-focused fieldset': { borderColor: '#00AEED', borderWidth: 1 }
                      },
                      '& .MuiInputBase-input': {
                        py: 0.75,
                        px: 1.5,
                        fontSize: '0.7rem',
                        color: '#424347'
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Filter size={12} className="ml-2 text-gray-400" />
                      ),
                    }}
                  />
                )}
                PaperComponent={CustomPaper}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.7rem' }}>
                        {option.name}
                      </Typography>
                    </Box>
                  </li>
                )}
                size="small"
                clearable
              />
            </div>

            <div className="relative" style={{ width: '260px' }}>
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
              <input 
                placeholder="Search students..." 
                className="w-full pl-7 pr-2 py-2 text-[10px] border rounded-md focus:ring-1 focus:ring-[#00AEED]"
                style={{ borderColor: '#E5E7EB' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-1">
              <button 
                onClick={handleExportExcel}
                disabled={exporting}
                className="px-2 py-2 text-[10px] rounded-md flex items-center gap-1"
                style={{ background: '#10B98120', color: '#10B981' }}
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-500"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={12} />
                    Export CSV
                  </>
                )}
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="px-2 py-1 text-[10px] rounded-md flex items-center gap-1"
                style={{ background: '#EF444420', color: '#EF4444' }}
              >
                <FileText size={12} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={scrollToStart}
            className="p-1.5 rounded-md hover:bg-gray-100 transition flex items-center gap-1"
            title="Scroll to start"
          >
            <ChevronsLeft size={14} />
          </button>
          <button 
            onClick={scrollLeft}
            className="p-1.5 rounded-md hover:bg-gray-100 transition flex items-center gap-1"
            title="Scroll left"
          >
            <ChevronLeft size={14} />
          </button>
        </div>
        
        <div className="text-[10px] text-gray-500">
          ← Use buttons to scroll horizontally →
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={scrollRight}
            className="p-1.5 rounded-md hover:bg-gray-100 transition flex items-center gap-1"
            title="Scroll right"
          >
            <ChevronRight size={14} />
          </button>
          <button 
            onClick={scrollToEnd}
            className="p-1.5 rounded-md hover:bg-gray-100 transition flex items-center gap-1"
            title="Scroll to end"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ background: '#10B981' }}></div>
          <span style={{ color: '#6B7280' }}>P = Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ background: '#EF4444' }}></div>
          <span style={{ color: '#6B7280' }}>A = Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ background: '#9CA3AF' }}></div>
          <span style={{ color: '#6B7280' }}>N/A = Not in Batch Range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm border-2" style={{ borderColor: '#00AEED', background: '#E0F2FE' }}></div>
          <span style={{ color: '#6B7280' }}>Today's Date</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEED]"></div>
          <span className="ml-2 text-sm text-gray-500">Loading attendance...</span>
        </div>
      )}

      {/* Excel-style Table */}
      {!loading && (
        <div className="bg-white rounded-lg border" style={{ borderColor: '#E5E7EB', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
          <div className="overflow-auto flex-1 scrollbar-hide" ref={tableContainerRef}>
            <table className="w-full border-collapse text-[10px] min-w-[800px]">
              <thead className="sticky top-0 z-20">
                <tr style={{ background: '#E5E7EB' }}>
                  <th className="border p-1.5 text-left font-semibold sticky left-0 z-30" style={{ borderColor: '#D1D5DB', background: '#E5E7EB', color: '#374151', minWidth: 40 }}>
                    Sr No
                  </th>
                  <th className="border p-1.5 text-left font-semibold sticky left-[40px] z-30" style={{ borderColor: '#D1D5DB', background: '#E5E7EB', color: '#374151', minWidth: 160 }}>
                    Student Name
                  </th>
                  <th className="border p-1.5 text-left font-semibold sticky left-[200px] z-30" style={{ borderColor: '#D1D5DB', background: '#E5E7EB', color: '#374151', minWidth: 150 }}>
                    Batch Name
                  </th>
                  {days.map((day, idx) => {
                    return (
                      <th 
                        key={idx} 
                        className={`border p-1.5 text-center font-semibold ${isToday(day) ? 'bg-blue-100' : ''}`} 
                        style={{ 
                          borderColor: '#D1D5DB', 
                          background: isToday(day) ? '#DBEAFE' : '#E5E7EB',
                          color: '#374151', 
                          minWidth: 55,
                          ...(isToday(day) && { border: '2px solid #00AEED', position: 'relative' })
                        }}
                      >
                        <div className={isToday(day) ? 'font-bold text-[#00AEED]' : ''}>{day.format('DD')}</div>
                        <div className="text-[8px] font-normal" style={{ color: '#6B7280' }}>{day.format('ddd')}</div>
                        {isToday(day) && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#00AEED]"></div>
                        )}
                      </th>
                    );
                  })}
                  <th className="border p-1.5 text-center font-semibold sticky right-0 z-30" style={{ borderColor: '#D1D5DB', background: '#E5E7EB', color: '#374151', minWidth: 80 }}>
                    Total (P/A)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => {
                  const stats = calculateAttendanceStats(item);
                  return (
                    <tr key={`${item.student_id}_${item.batch_id}`} className="hover:bg-gray-50">
                      <td className="border p-1.5 text-center sticky left-0 bg-white z-10" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                        {index + 1}
                      </td>
                      <td className="border p-1.5 sticky left-[40px] bg-white z-10" style={{ borderColor: '#E5E7EB' }}>
                        <div className="font-medium text-[10px]" style={{ color: '#424347' }}>{item.student_name}</div>
                      </td>
                      <td className="border p-1.5 sticky left-[200px] bg-white z-10" style={{ borderColor: '#E5E7EB' }}>
                        <div className="font-medium text-[10px]" style={{ color: '#00AEED' }}>{item.batch_name || `Batch ${item.batch_id}`}</div>
                        {item.start_date && item.end_date && (
                          <div className="text-[7px] text-gray-400 mt-0.5">
                            📅 {item.start_date} to {item.end_date}
                          </div>
                        )}
                      </td>
                      {days.map((day, idx) => {
                        const status = getAttendanceForDate(item, day);
                        const isTodayDate = isToday(day);
                        const isNA = status === 'na';
                        
                        return (
                          <td 
                            key={idx} 
                            className={`border p-1 text-center transition ${getStatusColor(status)} ${isTodayDate ? 'ring-1 ring-[#00AEED] ring-inset' : ''}`}
                            style={{ 
                              borderColor: '#E5E7EB',
                              backgroundColor: isNA ? '#F9FAFB' : '',
                              cursor: status !== 'na' ? 'pointer' : 'default',
                              opacity: isNA ? 0.6 : 1
                            }}
                            onClick={() => handleCellClick(item, day, status)}
                          >
                            <span className="font-medium text-[10px]">{getStatusDisplay(status)}</span>
                          </td>
                        );
                      })}
                      <td className="border p-1.5 text-center sticky right-0 bg-white z-10" style={{ borderColor: '#E5E7EB' }}>
                        <span className="font-medium text-[10px]" style={{ color: '#424347' }}>
                          {stats.present}/{stats.validDays}
                        </span>
                        {stats.na > 0 && (
                          <div className="text-[7px] text-gray-400">({stats.na} N/A)</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-[9px]" style={{ color: '#9CA3AF' }}>
        <div>
          {filteredData.length} entries • {days.length} days
          {selectedBatch && ` • Filtered: ${selectedBatch.name}`}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={saveAttendanceData}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gray-100 transition text-[9px]"
          >
            <Save size={10} />
            Save
          </button>
          <button 
            onClick={() => loadAttendanceData()}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gray-100 transition text-[9px]"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>
      </div>

      {/* Save Toast */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white text-[10px] px-3 py-1.5 rounded-md shadow-lg animate-fade-in">
          Attendance saved successfully!
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Attendance;