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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Grid,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';

// Import modal components
import AddRole from './AddRole';
import EditRole from './EditRole';
import ViewRole from './ViewRole';
import DeleteRole from './DeleteRole';

// Color constants (same as StudentManagement)
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

// All available modules/pages
const ALL_MODULES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  { module: 'COMPANY_MASTER', page: 'Company Master', category: 'Masters' },
  { module: 'CUSTOMER_MASTER', page: 'Customer Master', category: 'Masters' },
  { module: 'EMPLOYEE_MASTER', page: 'Employee Master', category: 'Masters' },
  { module: 'SALES_ORDER', page: 'Sales Order', category: 'Transactions' },
  { module: 'PURCHASE_ORDER', page: 'Purchase Order', category: 'Transactions' },
  { module: 'REPORTS', page: 'Reports', category: 'Reports' },
];

// All available actions
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'APPROVE'];

// Permissions Matrix Component for expanded row
const PermissionsMatrix = ({ permissions = [] }) => {
  const permissionMap = React.useMemo(() => {
    const map = {};
    permissions.forEach(perm => {
      const key = `${perm.module}_${perm.action}`;
      map[key] = true;
    });
    return map;
  }, [permissions]);

  const groupedModules = ALL_MODULES.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
            <TableCell sx={{ color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem' }}>Module</TableCell>
            {ALL_ACTIONS.map(action => (
              <TableCell key={action} align="center" sx={{ color: COLORS.text.light, fontWeight: 600, fontSize: '0.7rem' }}>
                {action}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedModules).map(([category, modules]) => (
            <React.Fragment key={category}>
              <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                <TableCell colSpan={ALL_ACTIONS.length + 1} sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.primary }}>
                  {category}
                </TableCell>
              </TableRow>
              {modules.map((item) => (
                <TableRow key={item.module} hover>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{item.page}</TableCell>
                  {ALL_ACTIONS.map(action => (
                    <TableCell key={action} align="center">
                      <Checkbox
                        checked={!!permissionMap[`${item.module}_${action}`]}
                        disabled
                        size="small"
                        sx={{ color: COLORS.accent, '&.Mui-checked': { color: COLORS.accent } }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
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
const ActionMenu = ({ role, onView, onEdit, onDelete }) => {
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
            onView(role);
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
            onEdit(role);
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
            onDelete(role);
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

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
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
  const [selectedRole, setSelectedRole] = useState(null);

  // Load roles from localStorage
  useEffect(() => {
    loadRolesFromStorage();
  }, []);

  const loadRolesFromStorage = () => {
    setLoading(true);
    try {
      const storedRoles = localStorage.getItem('roles');
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles);
        setRoles(parsedRoles);
        setFilteredRoles(parsedRoles);
      } else {
        // Default roles
        const defaultRoles = [
          {
            id: 'role_1',
            RoleName: 'Super Admin',
            Description: 'Full system access with all permissions',
            IsActive: true,
            isSuperAdmin: true,
            permissions: ALL_MODULES.flatMap(module => 
              ALL_ACTIONS.map(action => ({ module: module.module, action }))
            ),
            permissionsCount: ALL_MODULES.length * ALL_ACTIONS.length,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
          },
          {
            id: 'role_2',
            RoleName: 'Admin',
            Description: 'Administrative access with most permissions',
            IsActive: true,
            isSuperAdmin: false,
            permissions: [
              { module: 'DASHBOARD', action: 'VIEW' },
              { module: 'USERS', action: 'VIEW' },
              { module: 'USERS', action: 'CREATE' },
              { module: 'USERS', action: 'UPDATE' },
              { module: 'ROLES', action: 'VIEW' },
            ],
            permissionsCount: 5,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
          },
          {
            id: 'role_3',
            RoleName: 'User',
            Description: 'Basic user access',
            IsActive: true,
            isSuperAdmin: false,
            permissions: [
              { module: 'DASHBOARD', action: 'VIEW' },
              { module: 'SALES_ORDER', action: 'VIEW' },
            ],
            permissionsCount: 2,
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString()
          }
        ];
        setRoles(defaultRoles);
        setFilteredRoles(defaultRoles);
        localStorage.setItem('roles', JSON.stringify(defaultRoles));
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      showNotification('Failed to load roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveRolesToStorage = (updatedRoles) => {
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredRoles(roles);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = roles.filter(role =>
      role.RoleName?.toLowerCase().includes(value) ||
      role.Description?.toLowerCase().includes(value)
    );
    
    setFilteredRoles(filtered);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Apply search when searchTerm or roles change
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, roles]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredRoles.map(role => role.id));
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
    setExpandedRow(null);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
    setExpandedRow(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadRolesFromStorage();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle add role
  const handleAddRole = (newRole) => {
    const roleWithId = {
      ...newRole,
      id: `role_${Date.now()}`,
      permissionsCount: newRole.permissions?.length || 0,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    };
    const updatedRoles = [...roles, roleWithId];
    setRoles(updatedRoles);
    saveRolesToStorage(updatedRoles);
    showNotification('Role added successfully!', 'success');
  };

  // Handle edit role
  const handleEditRole = (updatedRole) => {
    const updatedRoles = roles.map(role =>
      role.id === updatedRole.id 
        ? { ...updatedRole, permissionsCount: updatedRole.permissions?.length || 0, UpdatedAt: new Date().toISOString() }
        : role
    );
    setRoles(updatedRoles);
    saveRolesToStorage(updatedRoles);
    showNotification('Role updated successfully!', 'success');
  };

  // Handle delete role
  const handleDeleteRole = (roleId) => {
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    setSelected(selected.filter(id => id !== roleId));
    saveRolesToStorage(updatedRoles);
    showNotification('Role deleted successfully!', 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedRoles = roles.filter(role => !selected.includes(role.id));
    setRoles(updatedRoles);
    setSelected([]);
    saveRolesToStorage(updatedRoles);
    showNotification(`${selected.length} roles deleted successfully`, 'success');
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Get avatar color based on role name
  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get role initials
  const getRoleInitials = (name) => {
    if (!name) return 'R';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleExpandRow = (roleId) => {
    setExpandedRow(expandedRow === roleId ? null : roleId);
  };

  // Paginated roles
  const paginatedRoles = filteredRoles.slice(
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
          Roles Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize user roles and permissions
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
              placeholder="Search by role name or description..."
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
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
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
              Add Role
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Roles Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredRoles.length}
                    checked={filteredRoles.length > 0 && selected.length === filteredRoles.length}
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
                <TableCell sx={{ width: 40 }}></TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Role Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Permissions
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
                      Loading roles...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No roles found' : 'No roles available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first role to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => {
                  const isSelected = selected.includes(role.id);
                  const avatarColor = getAvatarColor(role.RoleName);
                  const isExpanded = expandedRow === role.id;

                  return (
                    <React.Fragment key={role.id}>
                      <TableRow
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
                            onChange={() => handleSelect(role.id)}
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
                        <TableCell sx={{ width: 40 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleExpandRow(role.id)}
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
                              {getRoleInitials(role.RoleName)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                                {role.RoleName}
                              </Typography>
                              {role.isSuperAdmin && (
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
                            {role.Description || 'No description provided'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${role.permissionsCount || role.permissions?.length || 0} permissions`}
                            size="small"
                            sx={{
                              bgcolor: `${COLORS.accent}10`,
                              color: COLORS.accent,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              height: 24
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip isActive={role.IsActive} />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {new Date(role.CreatedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: 60 }}>
                          <ActionMenu 
                            role={role}
                            onView={(r) => { setSelectedRole(r); setOpenViewModal(true); }}
                            onEdit={(r) => { setSelectedRole(r); setOpenEditModal(true); }}
                            onDelete={(r) => { setSelectedRole(r); setOpenDeleteDialog(true); }}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row with Permissions Matrix */}
                      <TableRow>
                        <TableCell colSpan={8} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: COLORS.background.light, borderTop: `1px solid ${COLORS.border}` }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary, mb: 2 }}>
                                Permissions Matrix
                              </Typography>
                              <PermissionsMatrix permissions={role.permissions || []} />
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
          count={filteredRoles.length}
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
      <AddRole 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddRole}
      />

      {selectedRole && (
        <>
          <EditRole 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
            onUpdate={handleEditRole}
          />

          <ViewRole 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteRole 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
            onDelete={handleDeleteRole}
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

export default RolesManagement;