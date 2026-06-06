// NotificationManagement.jsx
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
  Snackbar,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Markunread as MarkunreadIcon,
  Group as GroupIcon,
  Article as ArticleIcon,
  NotificationsActive as PushIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';

// Import modal components
import SendNotification from './SendNotification';
import BulkSendNotification from './BulkSendNotification';
import ViewNotification from './ViewNotification';
import EditNotification from './EditNotification';
import DeleteNotification from './DeleteNotification';

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

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <NotificationsIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
    <Typography variant="h6" sx={{ color: COLORS.text.primary, mb: 1, fontWeight: 600 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Action Menu Component with permission checks
const ActionMenu = ({ notification, onView, onEdit, onDelete, canView, canUpdate, canDelete: canDeletePermission }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasAnyAction = canView || canUpdate || canDeletePermission;

  if (!hasAnyAction) {
    return null;
  }

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
        {canView && (
          <MenuItem 
            onClick={() => {
              onView(notification);
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
        )}
        
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(notification);
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
        )}
        
        {((canView && (canUpdate || canDeletePermission)) || (canUpdate && canDeletePermission)) && (
          <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        )}
        
        {canDeletePermission && (
          <MenuItem 
            onClick={() => {
              onDelete(notification);
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
        )}
      </Menu>
    </>
  );
};

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
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
  const [tabValue, setTabValue] = useState(0);

  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Modal states
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openBulkSendModal, setOpenBulkSendModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch user permissions from API
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
    return hasPermission(userPermissions, MODULES.NOTIFICATION_MANAGEMENT, PAGES.NOTIFICATION_MANAGEMENT, action);
  };

  // Permission checks
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Load notifications from API
  const loadNotificationsFromAPI = useCallback(async () => {
    if (!canView && !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm,
        is_read: tabValue === 1 ? false : (tabValue === 2 ? true : undefined)
      };
      
      const response = await axios.get(`${BASE_URL}/admin/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data && response.data.data) {
        const transformedNotifications = response.data.data.data.map(notif => ({
          id: notif.id,
          studentId: notif.student_id,
          studentName: notif.student?.name || 'N/A',
          studentEmail: notif.student?.email || 'N/A',
          batchId: notif.batch_id,
          batchName: notif.batch?.name || 'N/A',
          title: notif.title,
          message: notif.message,
          isRead: notif.is_read,
          createdAt: notif.created_at
        }));
        
        setNotifications(transformedNotifications);
        setTotalCount(response.data.data.total || 0);
        setLastPage(response.data.data.last_page || 1);
      } else {
        setNotifications([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      showNotification(error.response?.data?.message || 'Failed to load notifications', 'error');
      setNotifications([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, tabValue, canView, isSuperAdmin]);

  // Load notifications when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      loadNotificationsFromAPI();
    }
  }, [loadNotificationsFromAPI, permissionsLoaded, canView, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
    setPage(0);
    setSelected([]);
  };

  // Handle send notification
  const handleSendNotification = (data) => {
    loadNotificationsFromAPI();
    showNotification('Notification sent successfully!', 'success');
  };

  // Handle bulk send notification
  const handleBulkSendNotification = (data) => {
    loadNotificationsFromAPI();
    showNotification('Bulk notifications sent successfully!', 'success');
  };

  // Handle edit notification
  const handleEditNotification = async (updatedNotification) => {
    await loadNotificationsFromAPI();
    showNotification('Notification updated successfully!', 'success');
  };

  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setSelected(prev => prev.filter(id => id !== notificationId));
    loadNotificationsFromAPI();
    showNotification('Notification deleted successfully!', 'success');
  };

  // Handle refresh
  const handleRefresh = () => {
    loadNotificationsFromAPI();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle select all on current page
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(notifications.map(notif => notif.id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection
  const handleSelect = (id) => {
    if (!canDelete) return;
    
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
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const deletePromises = selected.map(id => 
        axios.delete(`${BASE_URL}/admin/notifications/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(deletePromises);
      setSelected([]);
      
      if (notifications.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        loadNotificationsFromAPI();
      }
      
      showNotification(`${selected.length} notifications deleted successfully`, 'success');
    } catch (error) {
      console.error('Error bulk deleting notifications:', error);
      showNotification('Failed to delete some notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setSelected([]);
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

  // Get avatar color based on title
  const getAvatarColor = (title) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = title?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get notification initials
  const getNotificationInitials = (title) => {
    if (!title) return 'N';
    const words = title.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canView && !isSuperAdmin) {
    return <AccessDenied />;
  }

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
          Notification Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and send notifications to students across batches
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
              placeholder="Search by title, message, student or batch..."
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
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {canDelete && selected.length > 0 && (
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
            
            {canCreate && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setOpenBulkSendModal(true)}
                  disabled={loading}
                  sx={{
                    height: 36,
                    borderRadius: 1.5,
                    borderColor: COLORS.border,
                    color: COLORS.text.secondary,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: COLORS.accent,
                      bgcolor: `${COLORS.accent}10`
                    }
                  }}
                >
                  Bulk Send
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<SendIcon sx={{ fontSize: '1rem' }} />}
                  onClick={() => setOpenSendModal(true)}
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
                  Send Notification
                </Button>
              </>
            )}
            
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  height: 36,
                  width: 36,
                  borderRadius: 1.5,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text.secondary,
                  '&:hover': {
                    borderColor: COLORS.accent,
                    bgcolor: `${COLORS.accent}10`
                  }
                }}
              >
                <RefreshIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              color: COLORS.text.secondary,
              '&.Mui-selected': {
                color: COLORS.accent
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: COLORS.accent,
              height: 2
            }
          }}
        >
          <Tab 
            label="All Notifications" 
            icon={<NotificationsIcon sx={{ fontSize: '1rem' }} />} 
            iconPosition="start"
          />
          <Tab 
            label={
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}>
                Unread
              </Badge>
            } 
            icon={<MarkunreadIcon sx={{ fontSize: '1rem' }} />} 
            iconPosition="start"
          />
          <Tab 
            label="Read" 
            icon={<CheckCircleIcon sx={{ fontSize: '1rem' }} />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Notifications Table */}
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < notifications.length}
                      checked={notifications.length > 0 && selected.length === notifications.length}
                      onChange={handleSelectAll}
                      disabled={loading || notifications.length === 0}
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
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Notification
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Student / Batch
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
                  color: COLORS.text.light
                }}>
                  Sent At
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
                  <TableCell colSpan={canDelete ? 6 : 5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading notifications...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : notifications.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={canDelete ? 6 : 5} 
                    align="center" 
                    sx={{ 
                      py: 6,
                      textAlign: 'center'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <NotificationsIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No notifications found' : 'No notifications available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Send a notification to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => {
                  const isSelected = selected.includes(notification.id);
                  const avatarColor = getAvatarColor(notification.title);

                  return (
                    <TableRow
                      key={notification.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: notification.isRead ? COLORS.background.white : `${COLORS.accent}05`,
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
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(notification.id)}
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
                      )}
                      
                      {/* Notification Column */}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getNotificationInitials(notification.title)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography sx={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: COLORS.text.primary
                              }}>
                                {notification.title}
                              </Typography>
                              {!notification.isRead && (
                                <Chip
                                  label="New"
                                  size="small"
                                  sx={{
                                    height: 16,
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    bgcolor: COLORS.accent,
                                    color: '#FFFFFF'
                                  }}
                                />
                              )}
                            </Stack>
                            <Typography sx={{ 
                              fontSize: '0.7rem', 
                              color: COLORS.text.secondary,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {notification.message}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Student / Batch Column */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ArticleIcon sx={{ fontSize: 14, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                              Batch: {notification.batchName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              Student: {notification.studentName}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <Chip
                          icon={notification.isRead ? <CheckCircleIcon sx={{ fontSize: '0.75rem' }} /> : <MarkunreadIcon sx={{ fontSize: '0.75rem' }} />}
                          label={notification.isRead ? 'Read' : 'Unread'}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: notification.isRead ? `${COLORS.success}10` : `${COLORS.accent}10`,
                            color: notification.isRead ? COLORS.success : COLORS.accent,
                            '& .MuiChip-icon': {
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </TableCell>

                      {/* Sent At Column */}
                      <TableCell>
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                          {formatDate(notification.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          notification={notification}
                          onView={(n) => { setSelectedNotification(n); setOpenViewModal(true); }}
                          onEdit={(n) => { setSelectedNotification(n); setOpenEditModal(true); }}
                          onDelete={(n) => { setSelectedNotification(n); setOpenDeleteDialog(true); }}
                          canView={canView}
                          canUpdate={canUpdate}
                          canDelete={canDelete}
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
      {canCreate && (
        <>
          <SendNotification 
            open={openSendModal}
            onClose={() => setOpenSendModal(false)}
            onSend={handleSendNotification}
          />
          
          <BulkSendNotification 
            open={openBulkSendModal}
            onClose={() => setOpenBulkSendModal(false)}
            onSend={handleBulkSendNotification}
          />
        </>
      )}

      {selectedNotification && (
        <>
          {canUpdate && (
            <EditNotification 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedNotification(null);
              }}
              notification={selectedNotification}
              onUpdate={handleEditNotification}
            />
          )}

          <ViewNotification 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedNotification(null);
            }}
            notification={selectedNotification}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          {canDelete && (
            <DeleteNotification 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedNotification(null);
              }}
              notification={selectedNotification}
              onDelete={handleDeleteNotification}
            />
          )}
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

export default NotificationManagement;