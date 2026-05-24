import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Save, RefreshCw, Calendar, Filter, FileSpreadsheet, FileText, ChevronsLeft, ChevronsRight, X, Wifi, WifiOff } from 'lucide-react';
import dayjs from 'dayjs';
import { Autocomplete, TextField, Box, Paper, styled, Typography, RadioGroup, Radio, FormControlLabel, FormLabel, Select, MenuItem, FormControl, InputLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, CircularProgress, Tooltip } from '@mui/material';
import axios from 'axios';
import BASE_URL from '../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../utils/modulePermissions';

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

// Loading state component
const LoadingState = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AEED]"></div>
    <span className="ml-2 text-sm text-gray-500">Loading attendance data...</span>
  </div>
);

// Access Denied component
const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <Calendar size={48} className="text-gray-300 mb-2" />
    <h3 className="text-lg font-semibold text-gray-700">Access Denied</h3>
    <p className="text-sm text-gray-500 mt-1">You don't have permission to view this page.</p>
    <p className="text-xs text-gray-400 mt-2">Please contact your administrator.</p>
  </div>
);

// Type Selection Dialog Component
const AttendanceTypeDialog = ({ open, onClose, onConfirm, studentName, batchName, date }) => {
  const [selectedType, setSelectedType] = useState('online');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <span>Mark Attendance</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="space-y-4 py-2">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Student: <span className="font-semibold text-gray-800">{studentName}</span></p>
            <p className="text-sm text-gray-600 mt-1">Batch: <span className="font-semibold text-gray-800">{batchName}</span></p>
            <p className="text-sm text-gray-600 mt-1">Date: <span className="font-semibold text-gray-800">{dayjs(date).format('DD MMM YYYY')}</span></p>
          </div>
          
          <FormControl component="fieldset">
            <FormLabel component="legend">Attendance Type</FormLabel>
            <RadioGroup
              row
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="mt-2"
            >
              <FormControlLabel 
                value="online" 
                control={<Radio />} 
                label={
                  <div className="flex items-center gap-1">
                    <Wifi size={16} className="text-green-600" />
                    <span>Online</span>
                  </div>
                } 
              />
              <FormControlLabel 
                value="offline" 
                control={<Radio />} 
                label={
                  <div className="flex items-center gap-1">
                    <WifiOff size={16} className="text-orange-600" />
                    <span>Offline</span>
                  </div>
                } 
              />
            </RadioGroup>
          </FormControl>
          
          <div className="text-xs text-gray-500 mt-2">
            {selectedType === 'online' ? 
              '✓ Online attendance will be marked directly' : 
              '✗ Offline attendance will be marked for later sync'}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => onConfirm(selectedType)} 
          variant="contained" 
          style={{ background: '#00AEED' }}
        >
          Confirm & Mark
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Attendance Cell Component with type indicator
const AttendanceCell = ({ status, type, isTodayDate, isNA, isHoliday, onClick, canEdit }) => {
  const getStatusDisplay = () => {
    if (status === 'present') return 'P';
    if (status === 'absent') return 'A';
    if (status === 'holiday') return 'H';
    if (status === 'na') return 'N/A';
    return '';
  };

  const getStatusColor = () => {
    if (status === 'present') return 'bg-green-100 text-green-700';
    if (status === 'absent') return 'bg-red-100 text-red-700';
    if (status === 'holiday') return 'bg-purple-100 text-purple-700';
    if (status === 'na') return 'bg-gray-100 text-gray-400';
    return 'bg-white text-gray-500';
  };

  const getTypeIcon = () => {
    if (type === 'online') {
      return <Wifi size={8} className="text-green-600" />;
    } else if (type === 'offline') {
      return <WifiOff size={8} className="text-orange-600" />;
    }
    return null;
  };

  return (
    <td 
      className={`border p-1 text-center transition ${getStatusColor()} ${isTodayDate ? 'ring-1 ring-[#00AEED] ring-inset' : ''}`}
      style={{ 
        borderColor: '#E5E7EB',
        backgroundColor: isNA ? '#F9FAFB' : '',
        cursor: canEdit && !isNA && !isHoliday ? 'pointer' : 'default',
        opacity: isNA ? 0.6 : 1
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-medium text-[10px]">{getStatusDisplay()}</span>
        {status === 'present' && type && (
          <Tooltip title={`${type === 'online' ? 'Online' : 'Offline'} Attendance`} arrow placement="top">
            <div className="inline-flex">
              {getTypeIcon()}
            </div>
          </Tooltip>
        )}
      </div>
    </td>
  );
};

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const tableContainerRef = useRef(null);
  
  // User state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Export Dialog State
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('day');
  const [exportDate, setExportDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [exportStartDate, setExportStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [exportEndDate, setExportEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
  const [exportMonth, setExportMonth] = useState(dayjs().month() + 1);
  const [exportYear, setExportYear] = useState(dayjs().year());
  const [exportBatchId, setExportBatchId] = useState('');
  const [exportTrainerName, setExportTrainerName] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);

  // Attendance Type Dialog State
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [pendingAttendance, setPendingAttendance] = useState(null);

  // Server-side pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Get unique batches from attendance data for filter dropdown
  const [batches, setBatches] = useState([]);

  // Fetch user permissions and role from API
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.is_super_admin || false);
          setUserPermissions(userData.permissions || []);
          setUserRole(userData.role || null);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Helper to check permission
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.ATTENDANCE, PAGES.ATTENDANCE, action);
  };

  // Check if user is Trainer
  const isTrainer = () => {
    return userRole === 'Trainer' || userRole === 'trainer';
  };

  // Permission checks
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Load attendance data with pagination and search
  const loadAttendanceData = useCallback(async () => {
    if (!canView && !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
      const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');
      
      const params = {
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      if (selectedBatch) {
        params.batch_id = selectedBatch.id;
      }
      
      const response = await axios.get(`${BASE_URL}/admin/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });

      if (response.data && response.data.data) {
        const groupedData = response.data.data
          .filter(student => student.batches && student.batches.length > 0)
          .map(student => ({
            student_id: student.student_id,
            student_name: student.student_name,
            batches: student.batches || []
          }));
        
        setAttendanceData(groupedData);
        setTotalCount(response.data.total || 0);
        setLastPage(response.data.last_page || 1);
        
        // Extract unique batches for filter (only on first load or when search/reset)
        if (currentPage === 1 && !searchTerm && !selectedBatch) {
          const uniqueBatches = [];
          const batchMap = new Map();
          groupedData.forEach(student => {
            student.batches.forEach(batch => {
              if (!batchMap.has(batch.batch_id)) {
                batchMap.set(batch.batch_id, {
                  id: batch.batch_id,
                  name: batch.batch_name || `Batch ${batch.batch_id}`
                });
                uniqueBatches.push({
                  id: batch.batch_id,
                  name: batch.batch_name || `Batch ${batch.batch_id}`
                });
              }
            });
          });
          setBatches(uniqueBatches);
        }
      } else {
        setAttendanceData([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      setAttendanceData([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentPage, rowsPerPage, searchTerm, selectedBatch, canView, isSuperAdmin]);

  // Load data when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      loadAttendanceData();
      loadBatchesForExport();
      loadTrainers();
    }
  }, [loadAttendanceData, permissionsLoaded, canView, isSuperAdmin, currentMonth, currentPage, rowsPerPage, searchTerm, selectedBatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadBatchesForExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setAvailableBatches(response.data.data);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const loadTrainers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/trainers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setTrainers(response.data.data);
      }
    } catch (error) {
      console.error('Error loading trainers:', error);
    }
  };

  const markAttendance = async (studentId, batchId, date, status, attendanceType = 'online') => {
    try {
      const token = localStorage.getItem('token');
      let url, requestBody;
      
      if (isTrainer()) {
        // Trainer API
        url = `${BASE_URL}/attendance/mark`;
        requestBody = {
          student_id: studentId,
          batch_id: batchId,
          date: date,
          status: status === 'present' ? 'P' : 'A'
        };
      } else {
        // Admin/Super Admin API
        url = `${BASE_URL}/attendance/mark`;
        requestBody = {
          student_id: studentId,
          batch_id: batchId,
          date: date,
          status: status === 'present' ? 'P' : 'A',
          type: attendanceType
        };
      }
      
      const response = await axios.post(url, requestBody, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.success !== false) {
        // Update local state with the new type
        setAttendanceData(prevData => 
          prevData.map(student => {
            if (student.student_id === studentId) {
              return {
                ...student,
                batches: student.batches.map(batch => {
                  if (batch.batch_id === batchId) {
                    return {
                      ...batch,
                      attendance: batch.attendance.map(record => {
                        if (record.date === date) {
                          return { 
                            ...record, 
                            status: status,
                            type: status === 'present' ? attendanceType : null
                          };
                        }
                        return record;
                      })
                    };
                  }
                  return batch;
                })
              };
            }
            return student;
          })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking attendance:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to mark attendance. Please try again.');
      }
      return false;
    }
  };

  const toggleAttendance = async (studentId, batchId, date, currentStatus, currentType) => {
    // Check if user has CREATE permission to mark attendance
    if (!canCreate && !isSuperAdmin) {
      alert("You don't have permission to mark attendance. Please contact your administrator.");
      return false;
    }
    
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    
    // If marking as present and user is not a trainer, show type selection dialog
    if (newStatus === 'present' && !isTrainer()) {
      setPendingAttendance({
        studentId,
        batchId,
        date,
        newStatus
      });
      setTypeDialogOpen(true);
      return false;
    }
    
    // If marking as absent or trainer marking attendance, proceed directly
    return await markAttendance(studentId, batchId, date, newStatus);
  };

  const handleAttendanceTypeConfirm = async (attendanceType) => {
    if (pendingAttendance) {
      const { studentId, batchId, date, newStatus } = pendingAttendance;
      const success = await markAttendance(studentId, batchId, date, newStatus, attendanceType);
      if (success) {
        setTypeDialogOpen(false);
        setPendingAttendance(null);
      }
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

  const isDateInBatchRange = (batchStartDate, batchEndDate, date) => {
    if (!batchStartDate || !batchEndDate) return false;
    const startDate = dayjs(batchStartDate);
    const endDate = dayjs(batchEndDate);
    return date.isAfter(startDate.subtract(1, 'day')) && date.isBefore(endDate.add(1, 'day'));
  };

  const getAttendanceForDate = (batch, date) => {
    const dateStr = date.format('YYYY-MM-DD');
    
    const inBatchRange = isDateInBatchRange(batch.start_date, batch.end_date, date);
    
    if (!inBatchRange) {
      return { status: 'na', type: null };
    }
    
    const attendanceRecord = batch.attendance?.find(record => record.date === dateStr);
    
    if (attendanceRecord) {
      if (attendanceRecord.status === 'holiday') {
        return { status: 'holiday', type: null };
      }
      return { status: attendanceRecord.status, type: attendanceRecord.type };
    }
    
    if (isPastDate(date)) {
      return { status: 'absent', type: null };
    }
    
    return { status: '', type: null };
  };

  const handleCellClick = async (studentId, batch, date, currentStatus, currentType) => {
    const dateStr = date.format('YYYY-MM-DD');
    
    if (!canCreate && !isSuperAdmin) {
      alert("You don't have permission to mark attendance.");
      return;
    }
    
    if (!isDateInBatchRange(batch.start_date, batch.end_date, date)) {
      return;
    }
    
    const attendanceRecord = batch.attendance?.find(record => record.date === dateStr);
    if (attendanceRecord?.status === 'holiday') {
      return;
    }
    
    await toggleAttendance(studentId, batch.batch_id, dateStr, currentStatus, currentType);
  };

  const calculateAttendanceStats = (batch) => {
    const days = getDaysInMonth();
    let present = 0, absent = 0, na = 0, holiday = 0;
    
    days.forEach(date => {
      const { status } = getAttendanceForDate(batch, date);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'na') na++;
      else if (status === 'holiday') holiday++;
    });
    
    const validDays = days.length - na - holiday;
    return { present, absent, na, holiday, validDays };
  };

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

  const handleExportReport = async () => {
    // Check if user has VIEW permission to export
    if (!canView && !isSuperAdmin) {
      alert("You don't have permission to export attendance reports.");
      return;
    }
    
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${BASE_URL}/reports/attendance`;
      let params = { type: exportType };
      
      switch (exportType) {
        case 'day':
          params.date = exportDate;
          break;
        case 'week':
          params.start_date = exportStartDate;
          params.end_date = exportEndDate;
          break;
        case 'month':
          params.month = exportMonth;
          params.year = exportYear;
          break;
        default:
          break;
      }
      
      if (exportBatchId) {
        params.batch_id = exportBatchId;
      }
      
      if (exportTrainerName) {
        params.trainer_name = exportTrainerName;
      }
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params,
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
      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      
      let filename = `attendance_report_${exportType}`;
      if (exportType === 'day') filename += `_${exportDate}`;
      else if (exportType === 'week') filename += `_${exportStartDate}_to_${exportEndDate}`;
      else if (exportType === 'month') filename += `_${exportYear}_${exportMonth}`;
      
      if (exportBatchId) filename += `_batch_${exportBatchId}`;
      if (exportTrainerName) filename += `_trainer_${exportTrainerName}`;
      
      filename += fileExtension;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url_blob);
      
      alert('Report downloaded successfully!');
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
  };

  const days = getDaysInMonth();
  
  const filteredData = attendanceData;

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
    setPage(0);
    setCurrentPage(1);
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
    setPage(0);
    setCurrentPage(1);
  };
  
  const todayDate = dayjs().format('DD MMM YYYY');

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canView && !isSuperAdmin) {
    return <AccessDenied />;
  }

  // Get student and batch info for the dialog
  const getPendingAttendanceInfo = () => {
    if (!pendingAttendance) return { studentName: '', batchName: '' };
    
    const student = attendanceData.find(s => s.student_id === pendingAttendance.studentId);
    const batch = student?.batches.find(b => b.batch_id === pendingAttendance.batchId);
    
    return {
      studentName: student?.student_name || '',
      batchName: batch?.batch_name || `Batch ${pendingAttendance.batchId}`
    };
  };

  const { studentName, batchName } = getPendingAttendanceInfo();

  return (
    <div className="space-y-3">
      {/* User Role Badge */}
      {isTrainer() && (
        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-1.5 text-xs text-blue-700 flex items-center gap-2">
          <span className="font-semibold">Trainer Mode:</span>
          <span>Attendance will be marked directly without type selection</span>
        </div>
      )}

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
              onClick={() => {
                setCurrentMonth(dayjs());
                setPage(0);
                setCurrentPage(1);
              }}
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
                  setPage(0);
                  setCurrentPage(1);
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex gap-1">
              {/* Export Report Button - Only show if user has VIEW permission */}
              {canView && (
                <button 
                  onClick={() => setExportDialogOpen(true)}
                  className="px-2 py-2 text-[10px] rounded-md flex items-center gap-1"
                  style={{ background: '#10B98120', color: '#10B981' }}
                >
                  <FileSpreadsheet size={12} />
                  Export Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog 
        open={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <span>Export Attendance Report</span>
            <button onClick={() => setExportDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 py-4">
            {/* Report Type Selection */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Report Type</FormLabel>
              <RadioGroup
                row
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
              >
                <FormControlLabel value="day" control={<Radio />} label="Day Wise" />
                <FormControlLabel value="week" control={<Radio />} label="Week Wise" />
                <FormControlLabel value="month" control={<Radio />} label="Month Wise" />
              </RadioGroup>
            </FormControl>

            {/* Date Fields based on type */}
            {exportType === 'day' && (
              <TextField
                label="Date"
                type="date"
                value={exportDate}
                onChange={(e) => setExportDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            )}

            {exportType === 'week' && (
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Start Date"
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            )}

            {exportType === 'month' && (
              <div className="grid grid-cols-2 gap-4">
                <FormControl fullWidth size="small">
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    label="Month"
                  >
                    <MenuItem value={1}>January</MenuItem>
                    <MenuItem value={2}>February</MenuItem>
                    <MenuItem value={3}>March</MenuItem>
                    <MenuItem value={4}>April</MenuItem>
                    <MenuItem value={5}>May</MenuItem>
                    <MenuItem value={6}>June</MenuItem>
                    <MenuItem value={7}>July</MenuItem>
                    <MenuItem value={8}>August</MenuItem>
                    <MenuItem value={9}>September</MenuItem>
                    <MenuItem value={10}>October</MenuItem>
                    <MenuItem value={11}>November</MenuItem>
                    <MenuItem value={12}>December</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Year"
                  type="number"
                  value={exportYear}
                  onChange={(e) => setExportYear(e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
            )}

            {/* Optional Filters */}
            <div className="border-t pt-4">
              <Typography variant="subtitle2" className="mb-2">Optional Filters</Typography>
              <div className="grid grid-cols-2 gap-4">
                <FormControl fullWidth size="small">
                  <InputLabel>Batch (Optional)</InputLabel>
                  <Select
                    value={exportBatchId}
                    onChange={(e) => setExportBatchId(e.target.value)}
                    label="Batch (Optional)"
                  >
                    <MenuItem value="">All Batches</MenuItem>
                    {availableBatches.map((batch) => (
                      <MenuItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Trainer (Optional)</InputLabel>
                  <Select
                    value={exportTrainerName}
                    onChange={(e) => setExportTrainerName(e.target.value)}
                    label="Trainer (Optional)"
                  >
                    <MenuItem value="">All Trainers</MenuItem>
                    {trainers.map((trainer) => (
                      <MenuItem key={trainer.id} value={trainer.name}>
                        {trainer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleExportReport} 
            variant="contained" 
            disabled={exporting}
            style={{ background: '#10B981' }}
          >
            {exporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Type Selection Dialog */}
      <AttendanceTypeDialog
        open={typeDialogOpen}
        onClose={() => {
          setTypeDialogOpen(false);
          setPendingAttendance(null);
        }}
        onConfirm={handleAttendanceTypeConfirm}
        studentName={studentName}
        batchName={batchName}
        date={pendingAttendance?.date}
      />

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
          <div className="w-2 h-2 rounded-sm" style={{ background: '#A855F7' }}></div>
          <span style={{ color: '#6B7280' }}>H = Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm border-2" style={{ borderColor: '#00AEED', background: '#E0F2FE' }}></div>
          <span style={{ color: '#6B7280' }}>Today's Date</span>
        </div>
        {!isTrainer() && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
            <div className="flex items-center gap-1">
              <Wifi size={10} className="text-green-600" />
              <span style={{ color: '#6B7280' }}>Online</span>
            </div>
            <div className="flex items-center gap-1">
              <WifiOff size={10} className="text-orange-600" />
              <span style={{ color: '#6B7280' }}>Offline</span>
            </div>
          </div>
        )}
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
        <div className="bg-white rounded-lg border" style={{ borderColor: '#E5E7EB', height: 'calc(100vh - 380px)', display: 'flex', flexDirection: 'column' }}>
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
                {filteredData.map((student, studentIndex) => (
                  <Fragment key={student.student_id}>
                    {student.batches && student.batches.map((batch, batchIndex) => {
                      const stats = calculateAttendanceStats(batch);
                      const isFirstRow = batchIndex === 0;
                      const globalIndex = (currentPage - 1) * rowsPerPage + studentIndex + 1;
                      const canEdit = canCreate || isSuperAdmin;
                      
                      return (
                        <tr key={`${student.student_id}_${batch.batch_id}`} className="hover:bg-gray-50">
                          {isFirstRow && (
                            <>
                              <td 
                                className="border p-1.5 text-center sticky left-0 bg-white z-10" 
                                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                                rowSpan={student.batches.length}
                              >
                                {globalIndex}
                              </td>
                              <td 
                                className="border p-1.5 sticky left-[40px] bg-white z-10 align-top" 
                                style={{ borderColor: '#E5E7EB' }}
                                rowSpan={student.batches.length}
                              >
                                <div className="font-medium text-[10px]" style={{ color: '#424347' }}>{student.student_name}</div>
                              </td>
                            </>
                          )}
                          <td className="border p-1.5 sticky left-[200px] bg-white z-10" style={{ borderColor: '#E5E7EB' }}>
                            <div className="font-medium text-[10px]" style={{ color: '#00AEED' }}>{batch.batch_name || `Batch ${batch.batch_id}`}</div>
                            {batch.start_date && batch.end_date && (
                              <div className="text-[7px] text-gray-400 mt-0.5">
                                📅 {batch.start_date} to {batch.end_date}
                              </div>
                            )}
                          </td>
                          {days.map((day, idx) => {
                            const { status, type } = getAttendanceForDate(batch, day);
                            const isTodayDate = isToday(day);
                            const isNA = status === 'na';
                            const isHoliday = status === 'holiday';
                            
                            return (
                              <AttendanceCell
                                key={idx}
                                status={status}
                                type={type}
                                isTodayDate={isTodayDate}
                                isNA={isNA}
                                isHoliday={isHoliday}
                                canEdit={canEdit}
                                onClick={() => handleCellClick(student.student_id, batch, day, status, type)}
                              />
                            );
                          })}
                          <td className="border p-1.5 text-center sticky right-0 bg-white z-10" style={{ borderColor: '#E5E7EB' }}>
                            <span className="font-medium text-[10px]" style={{ color: '#424347' }}>
                              {stats.present}/{stats.validDays}
                            </span>
                            {stats.na > 0 && (
                              <div className="text-[7px] text-gray-400">({stats.na} N/A)</div>
                            )}
                            {stats.holiday > 0 && (
                              <div className="text-[7px] text-purple-400">({stats.holiday} H)</div>
                            )}
                           </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={3 + days.length + 1} className="text-center p-8 text-gray-400">
                      No attendance data found
                     </td>
                   </tr>
                )}
              </tbody>
             </table>
          </div>
          
          {/* Pagination */}
          <div className="border-t border-gray-200 bg-white">
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.7rem',
                  color: '#6B7280'
                },
                '& .MuiTablePagination-select': {
                  fontSize: '0.7rem'
                },
                '& .MuiTablePagination-actions button': {
                  color: '#00AEED',
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-[9px]" style={{ color: '#9CA3AF' }}>
        <div>
          {totalCount} total entries • {days.length} days
          {selectedBatch && ` • Filtered: ${selectedBatch.name}`}
          {searchTerm && ` • Search: "${searchTerm}"`}
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
            onClick={() => {
              setPage(0);
              setCurrentPage(1);
              loadAttendanceData();
            }}
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