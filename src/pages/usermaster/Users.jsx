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
  Snackbar,
  TablePagination,
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
  Collapse,
  Checkbox
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';

// Import modal components
import AddUser from './AddUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';
import DeleteUser from './DeleteUser';

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

// All available actions
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];

// All possible pages/modules - This ensures ALL pages are shown (TRAINERS removed)
const ALL_PAGES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  { module: 'DEPARTMENT_MANAGEMENT', page: 'Department Management', category: 'Masters' },
  { module: 'DOMAIN_MANAGEMENT', page: 'Domain Management', category: 'Masters' },
  { module: 'HOLIDAY_MANAGEMENT', page: 'Holiday Management', category: 'Masters' },
  { module: 'COLLEGE_MANAGEMENT', page: 'College Management', category: 'Masters' },
  { module: 'STUDENT_MANAGEMENT', page: 'Student Management', category: 'Masters' },
  { module: 'BATCH_MANAGEMENT', page: 'Batch Management', category: 'Masters' },
  // TRAINERS module removed
  { module: 'ATTENDANCE', page: 'Attendance', category: 'Transactions' },
  { module: 'USER_MANAGEMENT', page: 'User Management', category: 'Administration' },
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  { module: 'REPORTS', page: 'Reports', category: 'Reports' }
];

// Group all pages by category
const groupedAllPages = ALL_PAGES.reduce((acc, page) => {
  if (!acc[page.category]) {
    acc[page.category] = [];
  }
  acc[page.category].push(page);
  return acc;
}, {});

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" sx={{ color: COLORS.text.primary, mb: 1, fontWeight: 600 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Status Chip Component
const StatusChip = ({ isActive }) => {
  if (isActive) {
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
};

// Permissions Matrix Component - Shows ALL pages
const PermissionsMatrix = ({ userPermissions = [], loading = false }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} sx={{ color: COLORS.accent }} />
        <Typography sx={{ ml: 1, fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  // Create a permission map for quick lookup
  const permissionMap = {};
  userPermissions.forEach(perm => {
    const key = `${perm.module_key}_${perm.action}`;
    permissionMap[key] = true;
  });

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
            <TableCell sx={{ 
              fontWeight: 600, 
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
              color: COLORS.text.light,
              position: 'sticky',
              left: 0,
              bgcolor: COLORS.background.tableHeader,
              zIndex: 1,
              minWidth: 200
            }}>
              Pages / Modules
            </TableCell>
            {ALL_ACTIONS.map((action) => (
              <TableCell 
                key={action} 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light,
                  minWidth: 70
                }}
              >
                {action}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedAllPages).map(([category, pages]) => (
            <React.Fragment key={category}>
              <TableRow sx={{ bgcolor: `${COLORS.accent}10` }}>
                <TableCell 
                  colSpan={ALL_ACTIONS.length + 1}
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.7rem', 
                    color: COLORS.accent,
                    py: 1
                  }}
                >
                  {category}
                </TableCell>
              </TableRow>
              
              {pages.map((page) => (
                <TableRow key={page.module} hover>
                  <TableCell 
                    sx={{ 
                      fontSize: '0.75rem', 
                      color: COLORS.text.primary,
                      position: 'sticky',
                      left: 0,
                      bgcolor: COLORS.background.white,
                      zIndex: 1,
                      borderRight: `1px solid ${COLORS.border}`,
                      py: 1.5
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        {page.page}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                        {page.module}
                      </Typography>
                    </Box>
                  </TableCell>
                  {ALL_ACTIONS.map((action) => {
                    const hasPermission = !!permissionMap[`${page.module}_${action}`];
                    return (
                      <TableCell key={action} align="center" sx={{ p: 1 }}>
                        <Checkbox
                          checked={hasPermission}
                          disabled
                          size="small"
                          sx={{
                            color: COLORS.accent,
                            '&.Mui-checked': {
                              color: COLORS.accent,
                            },
                            '& .MuiSvgIcon-root': {
                              fontSize: '1rem'
                            }
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ user, onView, onEdit, onDelete, canView, canUpdate, canDelete: canDeletePermission }) => {
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
              onView(user);
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
              onEdit(user);
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
              onDelete(user);
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedUserPermissions, setExpandedUserPermissions] = useState({});
  const [expandedLoading, setExpandedLoading] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

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
    return hasPermission(userPermissions, MODULES.USERS, PAGES.USERS, action);
  };

  // Permission checks
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Fetch user_permissions by ID
  const fetchUserPermissionsById = async (userId) => {
    setExpandedLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        const userData = response.data.data;
        setExpandedUserPermissions(prev => ({
          ...prev,
          [userId]: {
            user_permissions: userData.user_permissions || [],
            role_name: userData.role?.name
          }
        }));
        console.log(`Fetched user_permissions for user ${userId}:`, userData.user_permissions);
      }
    } catch (error) {
      console.error(`Error fetching permissions for user ${userId}:`, error);
      setExpandedUserPermissions(prev => ({
        ...prev,
        [userId]: {
          user_permissions: [],
          error: true
        }
      }));
    } finally {
      setExpandedLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Load users from API with pagination and search
  const loadUsersFromAPI = useCallback(async () => {
    if (!canView && !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data && response.data.success) {
        const transformedUsers = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          is_active: user.is_active,
          role: user.role,
          role_id: user.role?.id,
          role_name: user.role?.name,
          is_super_admin: user.role?.name === 'Super Admin',
          created_at: user.created_at,
          updated_at: user.updated_at
        }));
        
        setUsers(transformedUsers);
        setTotalCount(response.data.meta?.total || 0);
        setLastPage(response.data.meta?.last_page || 1);
      } else {
        setUsers([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification(error.response?.data?.message || 'Failed to load users', 'error');
      setUsers([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canView, isSuperAdmin]);

  // Load roles from API
  const loadRolesFromAPI = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/roles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        const rolesList = response.data.data.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          is_super_admin: role.is_super_admin
        }));
        setRoles(rolesList);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  }, []);

  // Load data when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      loadUsersFromAPI();
      loadRolesFromAPI();
    }
  }, [loadUsersFromAPI, loadRolesFromAPI, permissionsLoaded, canView, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
      setExpandedRow(null);
      setExpandedUserPermissions({});
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setExpandedRow(null);
    setExpandedUserPermissions({});
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
    setExpandedRow(null);
    setExpandedUserPermissions({});
  };

  // Handle expand row - fetch user_permissions when expanding
  const handleExpandRow = (userId) => {
    if (expandedRow === userId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(userId);
      // Fetch user_permissions if not already fetched
      if (!expandedUserPermissions[userId]) {
        fetchUserPermissionsById(userId);
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadUsersFromAPI();
    loadRolesFromAPI();
    setExpandedUserPermissions({});
    setExpandedRow(null);
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle add user
  const handleAddUser = (newUser) => {
    loadUsersFromAPI();
    showNotification('User added successfully!', 'success');
  };

  // Handle edit user
  const handleEditUser = (updatedUser) => {
    loadUsersFromAPI();
    setExpandedUserPermissions({});
    showNotification('User updated successfully!', 'success');
  };

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUserId(user.id);
    setOpenViewModal(true);
  };

  // Handle edit user click
  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      loadUsersFromAPI();
      setExpandedUserPermissions({});
      showNotification('User deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification(error.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Get avatar color based on username
  const getAvatarColor = (username) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = username?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get user initials
  const getUserInitials = (username) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
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

  // Get role chip color
  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'Super Admin':
        return { bg: '#D1FAE5', color: '#10B981' };
      case 'ADMIN':
        return { bg: '#E0F2FE', color: '#00AEED' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canView && !isSuperAdmin) {
    return <AccessDenied />;
  }

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
          User Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage system users, roles, and access permissions
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by name, email or mobile..."
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

          <Stack direction="row" spacing={1.5} alignItems="center">
            {canCreate && (
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
                Add User
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Users Table */}
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
                <TableCell sx={{ width: 40 }}></TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  User
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Email
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Mobile
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Role
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
                  Created Date
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
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No users found' : 'No users available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first user to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const avatarColor = getAvatarColor(user.name);
                  const roleColor = getRoleColor(user.role_name);
                  const isExpanded = expandedRow === user.id;
                  const userPermData = expandedUserPermissions[user.id];
                  const isLoadingExpanded = expandedLoading[user.id];
                  const isSuperAdminUser = user.role_name === 'Super Admin';

                  return (
                    <React.Fragment key={user.id}>
                      <TableRow
                        hover
                        sx={{ 
                          bgcolor: COLORS.background.white,
                          '&:hover': {
                            bgcolor: COLORS.background.hover
                          },
                          '& .MuiTableCell-root': {
                            py: 1.5,
                            fontSize: '0.75rem',
                            borderColor: COLORS.border
                          }
                        }}
                      >
                        <TableCell sx={{ width: 40 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(user.id)}
                            sx={{
                              color: COLORS.text.secondary,
                              '&:hover': {
                                bgcolor: `${COLORS.accent}20`
                              }
                            }}
                          >
                            {isExpanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
                          </IconButton>
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
                              {getUserInitials(user.name)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {user.name}
                              </Typography>
                              {isSuperAdminUser && (
                                <Chip
                                  label="Super Admin"
                                  size="small"
                                  sx={{
                                    fontSize: '0.6rem',
                                    height: 18,
                                    mt: 0.5,
                                    bgcolor: '#D1FAE5',
                                    color: '#10B981'
                                  }}
                                />
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {user.email || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {user.mobile || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.role_name || '-'}
                            size="small"
                            sx={{
                              bgcolor: roleColor.bg,
                              color: roleColor.color,
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              height: 24
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip isActive={user.is_active} />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(user.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            user={user}
                            onView={handleViewUser}
                            onEdit={handleEditUserClick}
                            onDelete={(u) => { setSelectedUser(u); setOpenDeleteDialog(true); }}
                            canView={canView}
                            canUpdate={canUpdate}
                            canDelete={canDelete}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row with user_permissions - Shows ALL pages */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderTop: `1px solid ${COLORS.border}` }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                                User Permissions Matrix
                                {isSuperAdminUser && (
                                  <Chip
                                    label="Full Access"
                                    size="small"
                                    sx={{ ml: 1, bgcolor: '#D1FAE5', color: '#10B981', fontSize: '0.6rem', height: 20 }}
                                  />
                                )}
                              </Typography>
                              {isSuperAdminUser ? (
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  py: 4, 
                                  bgcolor: COLORS.background.white,
                                  borderRadius: 1,
                                  border: `1px solid ${COLORS.border}`
                                }}>
                                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.primary, mb: 1 }}>
                                    👑 Super Admin Access
                                  </Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                                    Super Admin has full access to all modules and permissions
                                  </Typography>
                                </Box>
                              ) : (
                                <PermissionsMatrix 
                                  userPermissions={userPermData?.user_permissions || []}
                                  loading={isLoadingExpanded}
                                />
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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
        <AddUser 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddUser}
          roles={roles}
        />
      )}

      {canUpdate && selectedUser && (
        <EditUser 
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUpdate={handleEditUser}
          roles={roles}
        />
      )}

      <ViewUser 
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        onEdit={() => {
          setOpenViewModal(false);
          const userToEdit = users.find(u => u.id === selectedUserId);
          if (userToEdit) {
            setSelectedUser(userToEdit);
            setOpenEditModal(true);
          }
        }}
      />

      {canDelete && selectedUser && (
        <DeleteUser 
          open={openDeleteDialog}
          onClose={() => {
            setOpenDeleteDialog(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onDelete={handleDeleteUser}
        />
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

export default Users;