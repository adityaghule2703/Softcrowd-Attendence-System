import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  TablePagination,
  Checkbox,
  Stack,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle, Calendar, Circle } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Import modal components
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import ViewHoliday from './ViewHoliday';
import DeleteHoliday from './DeleteHoliday';

// Color constants
const COLORS = {
  primary: '#0F172A',
  primaryLight: '#1E293B',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',
  text: {
    primary: '#424347',
    secondary: '#6B7280',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC',
    hover: '#F1F5F9',
    tableHeader: '#0F172A'
  },
  border: '#E2E8F0'
};

// Action Menu Component
const ActionMenu = ({ holiday, onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.accent}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            onView(holiday);
            handleClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              View Details
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            onEdit(holiday);
            handleClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Edit
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(holiday);
            handleClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
              Delete
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

// Status Chip Component - Only shows actual status from API
const HolidayStatusChip = ({ status }) => {
  if (status === 'active') {
    return (
      <Chip
        label="Active"
        size="small"
        icon={<CheckCircle size={14} />}
        sx={{
          bgcolor: '#D1FAE5',
          color: '#10B981',
          fontSize: '0.65rem',
          fontWeight: 600,
          height: 24,
          '& .MuiChip-label': { px: 1.5 },
          '& .MuiChip-icon': { color: '#10B981', marginLeft: '6px' }
        }}
      />
    );
  }
  
  if (status === 'inactive') {
    return (
      <Chip
        label="Inactive"
        size="small"
        icon={<XCircle size={14} />}
        sx={{
          bgcolor: '#FEE2E2',
          color: '#EF4444',
          fontSize: '0.65rem',
          fontWeight: 600,
          height: 24,
          '& .MuiChip-label': { px: 1.5 },
          '& .MuiChip-icon': { color: '#EF4444', marginLeft: '6px' }
        }}
      />
    );
  }
  
  return (
    <Chip
      label={status || 'Unknown'}
      size="small"
      icon={<Circle size={14} />}
      sx={{
        bgcolor: '#E5E7EB',
        color: '#6B7280',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        '& .MuiChip-label': { px: 1.5 },
        '& .MuiChip-icon': { color: '#6B7280', marginLeft: '6px' }
      }}
    />
  );
};

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  // Load holidays from API with pagination and search
  const loadHolidaysFromAPI = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      const response = await axios.get(`${BASE_URL}/holidays`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data && response.data.data) {
        // Transform API response to match component structure
        const transformedHolidays = response.data.data.map(holiday => ({
          id: holiday.id,
          name: holiday.name,
          startDate: holiday.start_date,
          endDate: holiday.end_date,
          note: holiday.note,
          status: holiday.status, // Use real status from API
          createdAt: holiday.created_at,
          updatedAt: holiday.updated_at
        }));
        
        setHolidays(transformedHolidays);
        setTotalCount(response.data.total || 0);
        setLastPage(response.data.last_page || 1);
      } else {
        setHolidays([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading holidays:', error);
      showNotification(error.response?.data?.message || 'Failed to load holidays', 'error');
      setHolidays([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Load holidays when dependencies change
  useEffect(() => {
    loadHolidaysFromAPI();
  }, [loadHolidaysFromAPI]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page when searching
      setPage(0); // Reset pagination index
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle add holiday
  const handleAddHoliday = (newHoliday) => {
    // Transform the API response to match component structure
    const transformedHoliday = {
      id: newHoliday.id,
      name: newHoliday.name,
      startDate: newHoliday.start_date,
      endDate: newHoliday.end_date,
      note: newHoliday.note,
      status: newHoliday.status || 'active',
      createdAt: newHoliday.created_at,
      updatedAt: newHoliday.updated_at
    };
    
    // If on first page and current list is not full, add to current list
    if (currentPage === 1 && holidays.length < rowsPerPage) {
      setHolidays(prev => [transformedHoliday, ...prev]);
    }
    
    // Refresh to get updated total count
    loadHolidaysFromAPI();
    showNotification('Holiday added successfully!', 'success');
  };

  // Handle edit holiday
  const handleEditHoliday = (updatedHoliday) => {
    // Transform the API response to match component structure
    const transformedHoliday = {
      id: updatedHoliday.id,
      name: updatedHoliday.name,
      startDate: updatedHoliday.start_date,
      endDate: updatedHoliday.end_date,
      note: updatedHoliday.note,
      status: updatedHoliday.status,
      createdAt: updatedHoliday.created_at,
      updatedAt: updatedHoliday.updated_at
    };
    
    // Update local state
    setHolidays(prev => prev.map(holiday => 
      holiday.id === transformedHoliday.id ? transformedHoliday : holiday
    ));
    
    showNotification('Holiday updated successfully!', 'success');
  };

  // Handle delete holiday
  const handleDeleteHoliday = (holidayId) => {
    // Remove from local state
    setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
    setSelected(prev => prev.filter(id => id !== holidayId));
    
    // Refresh to update pagination and total count
    loadHolidaysFromAPI();
    showNotification('Holiday deleted successfully!', 'success');
  };

  // Handle refresh
  const handleRefresh = () => {
    loadHolidaysFromAPI();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle select all on current page
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(holidays.map(holiday => holiday.id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    
    setSelected(newSelected);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Delete each selected holiday
      const deletePromises = selected.map(id => 
        axios.delete(`${BASE_URL}/holidays/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(deletePromises);
      
      // Clear selection
      setSelected([]);
      
      // Check if current page becomes empty and not first page
      if (holidays.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        // Refresh current page
        loadHolidaysFromAPI();
      }
      
      showNotification(`${selected.length} holidays deleted successfully`, 'success');
    } catch (error) {
      console.error('Error bulk deleting holidays:', error);
      showNotification('Failed to delete some holidays', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setSelected([]); // Clear selection when changing page
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get holiday initials
  const getHolidayInitials = (name) => {
    if (!name) return 'H';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Holiday Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize holiday schedules
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by holiday name or note..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 360 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.accent,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
            />
            {searchTerm && (
              <Chip 
                label={`Search: ${searchTerm}`}
                size="small"
                onDelete={() => {
                  setSearchInput('');
                  setSearchTerm('');
                  setCurrentPage(1);
                  setPage(0);
                }}
                sx={{ height: 28, fontSize: '0.7rem' }}
              />
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                disabled={loading}
                sx={{ 
                  height: 36,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ 
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.border,
                color: COLORS.text.secondary,
                '&:hover': {
                  borderColor: COLORS.accent,
                  color: COLORS.accent,
                  bgcolor: `${COLORS.accent}10`
                }
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
              onClick={() => setOpenAddModal(true)}
              disabled={loading}
              sx={{
                height: 36,
                borderRadius: 1.5,
                bgcolor: COLORS.primary,
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: COLORS.primaryDark,
                }
              }}
            >
              Add Holiday
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Holidays Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < holidays.length}
                    checked={holidays.length > 0 && selected.length === holidays.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: COLORS.text.light,
                      '&.Mui-checked': {
                        color: COLORS.text.light,
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: COLORS.text.light,
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }}
                  />
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Holiday Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Start Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  End Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Note
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light,
                  width: 60
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading holidays...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Calendar size={48} style={{ color: COLORS.text.tertiary, marginBottom: 8 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No holidays found' : 'No holidays available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first holiday to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                holidays.map((holiday) => {
                  const isSelected = selected.includes(holiday.id);
                  const avatarColor = getAvatarColor(holiday.name);

                  return (
                    <TableRow
                      key={holiday.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.accent}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.accent}20`
                          }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(holiday.id)}
                          sx={{
                            color: COLORS.accent,
                            '&.Mui-checked': {
                              color: COLORS.accent,
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: '1.25rem'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getHolidayInitials(holiday.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {holiday.name}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={12} style={{ color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(holiday.startDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Calendar size={12} style={{ color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(holiday.endDate)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DescriptionIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {holiday.note?.length > 50 ? `${holiday.note.substring(0, 50)}...` : holiday.note || '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <HolidayStatusChip status={holiday.status} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          holiday={holiday}
                          onView={(h) => { setSelectedHoliday(h); setOpenViewModal(true); }}
                          onEdit={(h) => { setSelectedHoliday(h); setOpenEditModal(true); }}
                          onDelete={(h) => { setSelectedHoliday(h); setOpenDeleteDialog(true); }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.accent,
            }
          }}
        />
      </Paper>

      {/* Modal Components */}
      <AddHoliday 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddHoliday}
      />

      {selectedHoliday && (
        <>
          <EditHoliday 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedHoliday(null);
            }}
            holiday={selectedHoliday}
            onUpdate={handleEditHoliday}
          />

          <ViewHoliday 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedHoliday(null);
            }}
            holiday={selectedHoliday}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteHoliday 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedHoliday(null);
            }}
            holiday={selectedHoliday}
            onDelete={handleDeleteHoliday}
          />
        </>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HolidayManagement;