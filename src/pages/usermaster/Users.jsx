import React, { useState, useEffect } from 'react';
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

// Import modal components
import AddUser from './AddUser';
import EditUser from './EditUser';
import ViewUser from './ViewUser';
import DeleteUser from './DeleteUser';

// Color constants (matching RolesManagement)
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

// Action Menu Component
const ActionMenu = ({ user, onView, onEdit, onDelete }) => {
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
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
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
      </Menu>
    </>
  );
};

// Permissions Matrix Component
const PermissionsMatrix = ({ permissions = [] }) => {
  const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];
  
  const ALL_PAGES = [
    { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
    { module: 'DOMAIN_MANAGEMENT', page: 'Domain Management', category: 'Masters' },
    { module: 'HOLIDAY_MANAGEMENT', page: 'Holiday Management', category: 'Masters' },
    { module: 'COLLEGE_MANAGEMENT', page: 'College Management', category: 'Masters' },
    { module: 'DEPARTMENT_MANAGEMENT', page: 'Department Management', category: 'Masters' },
    { module: 'STUDENT_MANAGEMENT', page: 'Student Management', category: 'Masters' },
    { module: 'BATCH_MANAGEMENT', page: 'Batch Management', category: 'Masters' },
    { module: 'TRAINERS', page: 'Trainers', category: 'Masters' },
    { module: 'ATTENDANCE', page: 'Attendance', category: 'Transactions' },
    { module: 'USERS', page: 'Users', category: 'Administration' },
    { module: 'ROLES', page: 'Roles', category: 'Administration' },
    { module: 'REPORTS', page: 'Reports', category: 'Reports' },
  ];

  const groupedPages = ALL_PAGES.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {});

  const permissionMap = React.useMemo(() => {
    const map = {};
    permissions.forEach(perm => {
      const key = `${perm.module}_${perm.action}`;
      map[key] = true;
    });
    return map;
  }, [permissions]);

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
          {Object.entries(groupedPages).map(([category, pages]) => (
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
                    const isChecked = !!permissionMap[`${page.module}_${action}`];
                    return (
                      <TableCell key={action} align="center" sx={{ p: 1 }}>
                        <Checkbox
                          checked={isChecked}
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users and roles from localStorage
  useEffect(() => {
    loadUsersFromStorage();
    loadRolesFromStorage();
  }, []);

  const loadUsersFromStorage = () => {
    setLoading(true);
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
        setFilteredUsers(parsedUsers);
      } else {
        // Default demo users
        const defaultUsers = [
          {
            id: 'user_1',
            Username: 'admin',
            Email: 'admin@softcrowd.com',
            RoleName: 'Super Admin',
            RoleId: 'role_1',
            IsActive: true,
            isSuperAdmin: true,
            permissions: [],
            CreatedAt: new Date().toISOString(),
            LastLogin: new Date().toISOString()
          },
          {
            id: 'user_2',
            Username: 'manager',
            Email: 'manager@softcrowd.com',
            RoleName: 'Admin',
            RoleId: 'role_2',
            IsActive: true,
            isSuperAdmin: false,
            permissions: [],
            CreatedAt: new Date().toISOString(),
            LastLogin: new Date().toISOString()
          },
          {
            id: 'user_3',
            Username: 'user',
            Email: 'user@softcrowd.com',
            RoleName: 'User',
            RoleId: 'role_3',
            IsActive: true,
            isSuperAdmin: false,
            permissions: [],
            CreatedAt: new Date().toISOString(),
            LastLogin: new Date().toISOString()
          }
        ];
        setUsers(defaultUsers);
        setFilteredUsers(defaultUsers);
        localStorage.setItem('users', JSON.stringify(defaultUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRolesFromStorage = () => {
    try {
      const storedRoles = localStorage.getItem('roles');
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles);
        setRoles(parsedRoles);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const saveUsersToStorage = (updatedUsers) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.Username?.toLowerCase().includes(value) ||
      user.Email?.toLowerCase().includes(value) ||
      user.RoleName?.toLowerCase().includes(value)
    );
    
    setFilteredUsers(filtered);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Apply search when searchTerm or users change
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExpandedRow(null);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRow(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadUsersFromStorage();
    loadRolesFromStorage();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle add user
  const handleAddUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: `user_${Date.now()}`,
      CreatedAt: new Date().toISOString(),
      LastLogin: null
    };
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    showNotification('User added successfully!', 'success');
  };

  // Handle edit user
  const handleEditUser = (updatedUser) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id 
        ? { ...updatedUser, UpdatedAt: new Date().toISOString() }
        : user
    );
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    showNotification('User updated successfully!', 'success');
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    showNotification('User deleted successfully!', 'success');
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

  const handleExpandRow = (userId) => {
    setExpandedRow(expandedRow === userId ? null : userId);
  };

  // Get role chip color
  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'Super Admin':
        return { bg: '#D1FAE5', color: '#10B981' };
      case 'Admin':
        return { bg: '#E0F2FE', color: '#00AEED' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Paginated users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by username or email..."
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
            <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleRefresh}
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
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
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
                paginatedUsers.map((user) => {
                  const avatarColor = getAvatarColor(user.Username);
                  const roleColor = getRoleColor(user.RoleName);
                  const isExpanded = expandedRow === user.id;

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
                              {getUserInitials(user.Username)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {user.Username}
                              </Typography>
                              {user.isSuperAdmin && (
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
                            {user.Email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.RoleName}
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
                          <StatusChip isActive={user.IsActive} />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {formatDate(user.CreatedAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            user={user}
                            onView={(u) => { setSelectedUser(u); setOpenViewModal(true); }}
                            onEdit={(u) => { setSelectedUser(u); setOpenEditModal(true); }}
                            onDelete={(u) => { setSelectedUser(u); setOpenDeleteDialog(true); }}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row with Permissions Matrix */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderTop: `1px solid ${COLORS.border}` }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                                User Permissions Matrix
                              </Typography>
                              <PermissionsMatrix permissions={user.permissions || []} />
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
          count={filteredUsers.length}
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
      <AddUser 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddUser}
        roles={roles}
      />

      {selectedUser && (
        <>
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

          <ViewUser 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteUser 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedUser(null);
            }}
            user={selectedUser}
            onDelete={handleDeleteUser}
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

export default Users;