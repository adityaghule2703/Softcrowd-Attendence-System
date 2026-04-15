import React, { useState } from 'react';
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
  People as PeopleIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Color constants - Using sidebar background color (#0F172A)
const COLORS = {
  primary: '#0F172A',  // Sidebar background color
  primaryLight: '#1E293B',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',  // Accent color for highlights
  text: {
    primary: '#424347',
    secondary: '#6B7280',
    tertiary: '#94A3B8',
    light: '#FFFFFF',
    lightMuted: 'rgba(255, 255, 255, 0.9)'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC',
    hover: '#F1F5F9',
    tableHeader: '#0F172A'  // Sidebar color for table header
  },
  border: '#E2E8F0',
  status: {
    active: '#10B981',
    inactive: '#EF4444',
    pending: '#F59E0B'
  }
};

// Demo User Data
const demoUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Administrator",
    department: "IT",
    status: "active",
    lastActive: "2024-01-15",
    avatar: "AJ",
    phone: "+1 234 567 8900",
    location: "New York, USA"
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    role: "Manager",
    department: "HR",
    status: "active",
    lastActive: "2024-01-14",
    avatar: "SM",
    phone: "+1 234 567 8901",
    location: "Los Angeles, USA"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Trainer",
    department: "Training",
    status: "active",
    lastActive: "2024-01-15",
    avatar: "MC",
    phone: "+1 234 567 8902",
    location: "Chicago, USA"
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "User",
    department: "Sales",
    status: "inactive",
    lastActive: "2023-12-20",
    avatar: "ED",
    phone: "+1 234 567 8903",
    location: "Houston, USA"
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "Trainer",
    department: "Training",
    status: "active",
    lastActive: "2024-01-13",
    avatar: "JW",
    phone: "+1 234 567 8904",
    location: "Phoenix, USA"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "Manager",
    department: "Operations",
    status: "pending",
    lastActive: "2024-01-10",
    avatar: "LA",
    phone: "+1 234 567 8905",
    location: "Philadelphia, USA"
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    role: "User",
    department: "Marketing",
    status: "active",
    lastActive: "2024-01-14",
    avatar: "RT",
    phone: "+1 234 567 8906",
    location: "San Antonio, USA"
  },
  {
    id: 8,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    role: "Administrator",
    department: "IT",
    status: "active",
    lastActive: "2024-01-15",
    avatar: "MG",
    phone: "+1 234 567 8907",
    location: "San Diego, USA"
  }
];

// Action Menu Component
const ActionMenu = ({ user, onView, onEdit, onDelete, onStatusToggle }) => {
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

        <MenuItem 
          onClick={() => {
            onStatusToggle(user);
            handleClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: user.status === 'active' ? '#EF4444' : '#10B981', minWidth: 36 }}>
            {user.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: user.status === 'active' ? '#EF4444' : '#10B981', fontSize: '0.75rem' }}>
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
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

// Status Chip Component
const StatusChip = ({ status }) => {
  const statusConfig = {
    active: { label: 'Active', color: COLORS.status.active, bg: '#D1FAE5' },
    inactive: { label: 'Inactive', color: COLORS.status.inactive, bg: '#FEE2E2' },
    pending: { label: 'Pending', color: COLORS.status.pending, bg: '#FEF3C7' }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        '& .MuiChip-label': {
          px: 1.5
        }
      }}
    />
  );
};

// Role Chip Component
const RoleChip = ({ role }) => {
  const roleColors = {
    Administrator: { bg: '#E8F4FE', color: COLORS.accent },
    Manager: { bg: '#FEF3C7', color: '#F59E0B' },
    Trainer: { bg: '#D1FAE5', color: '#10B981' },
    User: { bg: '#F3F4F6', color: '#6B7280' }
  };

  const config = roleColors[role] || roleColors.User;

  return (
    <Chip
      label={role}
      size="small"
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontSize: '0.65rem',
        fontWeight: 500,
        height: 24,
        '& .MuiChip-label': {
          px: 1.5
        }
      }}
    />
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState(demoUsers);
  const [filteredUsers, setFilteredUsers] = useState(demoUsers);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value) ||
      user.department?.toLowerCase().includes(value)
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

  // Apply search when searchTerm changes
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredUsers.map(user => user.id));
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
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers([...demoUsers]);
      setFilteredUsers([...demoUsers]);
      setLoading(false);
      showNotification('Data refreshed successfully', 'success');
    }, 1000);
  };

  // Handle view user
  const handleViewUser = (user) => {
    showNotification(`Viewing ${user.name}`, 'info');
  };

  // Handle edit user
  const handleEditUser = (user) => {
    showNotification(`Edit ${user.name}`, 'info');
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    setSelected(selected.filter(id => id !== user.id));
    showNotification(`${user.name} deleted successfully`, 'success');
  };

  // Handle status toggle
  const handleStatusToggle = (user) => {
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    );
    setUsers(updatedUsers);
    const newStatus = user.status === 'active' ? 'deactivated' : 'activated';
    showNotification(`${user.name} ${newStatus} successfully`, 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedUsers = users.filter(u => !selected.includes(u.id));
    setUsers(updatedUsers);
    setSelected([]);
    showNotification(`${selected.length} users deleted successfully`, 'success');
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
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
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
          Manage and organize user accounts and permissions
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
              placeholder="Search by name, email, role, or department..."
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
              onClick={() => showNotification('Add User feature coming soon', 'info')}
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
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredUsers.length}
                    checked={filteredUsers.length > 0 && selected.length === filteredUsers.length}
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
                  User
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
                  Department
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Contact
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
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
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
                  const isSelected = selected.includes(user.id);
                  const avatarColor = getAvatarColor(user.name);

                  return (
                    <TableRow
                      key={user.id}
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
                          onChange={() => handleSelect(user.id)}
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
                            {user.avatar}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {user.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <RoleChip role={user.role} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {user.department}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Last active: {user.lastActive}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {user.phone}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {user.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={user.status} />
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          user={user}
                          onView={handleViewUser}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          onStatusToggle={handleStatusToggle}
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

export default UserManagement;