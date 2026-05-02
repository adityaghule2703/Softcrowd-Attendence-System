import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Autocomplete,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

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

// All pages/modules from sidebar
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

// Group pages by category
const groupedPages = ALL_PAGES.reduce((acc, page) => {
  if (!acc[page.category]) {
    acc[page.category] = [];
  }
  acc[page.category].push(page);
  return acc;
}, {});

const AddUser = ({ open, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    RoleId: '',
    IsActive: true
  });
  
  // Roles data
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Permissions state
  const [permissions, setPermissions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch roles from localStorage
  useEffect(() => {
    if (open) {
      loadRolesFromStorage();
      resetForm();
    }
  }, [open]);

  const loadRolesFromStorage = () => {
    setLoadingRoles(true);
    try {
      const storedRoles = localStorage.getItem('roles');
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles);
        setRoles(parsedRoles);
      } else {
        const defaultRoles = [
          { id: 'role_1', RoleName: 'Super Admin', Description: 'Full system access', permissions: [] },
          { id: 'role_2', RoleName: 'Admin', Description: 'Administrative access', permissions: [] },
          { id: 'role_3', RoleName: 'User', Description: 'Basic user access', permissions: [] }
        ];
        setRoles(defaultRoles);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      setError('Failed to load roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Username: '',
      Email: '',
      Password: '',
      ConfirmPassword: '',
      RoleId: '',
      IsActive: true
    });
    setSelectedRole(null);
    setPermissions({});
    setError('');
    // Expand all categories
    const expanded = {};
    Object.keys(groupedPages).forEach(category => {
      expanded[category] = true;
    });
    setExpandedCategories(expanded);
  };

  // Initialize permissions from selected role
  const initializePermissionsFromRole = (role) => {
    const initialPermissions = {};
    ALL_PAGES.forEach(page => {
      ALL_ACTIONS.forEach(action => {
        const key = `${page.module}_${action}`;
        initialPermissions[key] = false;
      });
    });

    if (role && role.permissions && role.permissions.length > 0) {
      role.permissions.forEach(perm => {
        const key = `${perm.module}_${perm.action}`;
        initialPermissions[key] = true;
      });
    }

    setPermissions(initialPermissions);
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        RoleId: newValue.id
      }));
      initializePermissionsFromRole(newValue);
    } else {
      setFormData(prev => ({
        ...prev,
        RoleId: ''
      }));
      const emptyPermissions = {};
      ALL_PAGES.forEach(page => {
        ALL_ACTIONS.forEach(action => {
          const key = `${page.module}_${action}`;
          emptyPermissions[key] = false;
        });
      });
      setPermissions(emptyPermissions);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      IsActive: checked
    }));
  };

  const handlePermissionChange = (module, action, checked) => {
    const key = `${module}_${action}`;
    setPermissions(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSelectAllForPage = (module, checked) => {
    const newPermissions = { ...permissions };
    ALL_ACTIONS.forEach(action => {
      const key = `${module}_${action}`;
      newPermissions[key] = checked;
    });
    setPermissions(newPermissions);
  };

  const getPageSelectedCount = (module) => {
    let count = 0;
    ALL_ACTIONS.forEach(action => {
      const key = `${module}_${action}`;
      if (permissions[key]) count++;
    });
    return count;
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Transform permissions to the format expected
  const transformPermissionsToFormat = () => {
    const permissionsArray = [];
    
    ALL_PAGES.forEach(page => {
      ALL_ACTIONS.forEach(action => {
        const key = `${page.module}_${action}`;
        if (permissions[key]) {
          permissionsArray.push({
            module: page.module,
            action: action
          });
        }
      });
    });
    
    return permissionsArray;
  };

  const validateForm = () => {
    if (!formData.Username.trim()) {
      setError('Username is required');
      return false;
    }

    if (formData.Username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!formData.Email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.Password) {
      setError('Password is required');
      return false;
    }

    if (formData.Password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.RoleId) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const permissionsArray = transformPermissionsToFormat();
      
      const newUser = {
        id: `user_${Date.now()}`,
        Username: formData.Username.trim(),
        Email: formData.Email.trim(),
        RoleName: selectedRole?.RoleName || '',
        RoleId: formData.RoleId,
        IsActive: formData.IsActive,
        isSuperAdmin: selectedRole?.RoleName === 'Super Admin',
        permissions: permissionsArray,
        permissionsCount: permissionsArray.length,
        CreatedAt: new Date().toISOString(),
        LastLogin: null
      };

      onAdd(newUser);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: `1px solid ${COLORS.border}`,
        py: 1.5,
        px: 2.5,
        mb: 2,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add New User
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            Create a new user with specific permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 1.5 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Basic Information Section */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  USERNAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Username"
                  value={formData.Username}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="john_doe"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.accent },
                      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                    }
                  }}
                />
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                  Minimum 3 characters
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  EMAIL <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="john@example.com"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.accent },
                      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="Password"
                  type="password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.accent },
                      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  CONFIRM PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="ConfirmPassword"
                  type="password"
                  value={formData.ConfirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      bgcolor: COLORS.background.light,
                      fontSize: '0.75rem',
                      '&:hover fieldset': { borderColor: COLORS.accent },
                      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                    }
                  }}
                />
              </Box>
            </Box>

            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, mt: 1 }}>
              Password must be at least 6 characters
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  ROLE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  options={roles}
                  loading={loadingRoles}
                  value={selectedRole}
                  onChange={handleRoleChange}
                  getOptionLabel={(option) => option.RoleName || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a role"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          bgcolor: COLORS.background.light,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.accent },
                          '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          {option.RoleName}
                        </Typography>
                        {option.Description && (
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            {option.Description}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                />
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.IsActive}
                        onChange={handleStatusChange}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: COLORS.accent,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: COLORS.accent,
                          },
                        }}
                      />
                    }
                    label={
                      <Chip
                        label={formData.IsActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.IsActive ? '#D1FAE5' : '#FEE2E2',
                          color: formData.IsActive ? '#10B981' : '#EF4444'
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Permissions Section - Only show if a role is selected */}
          {selectedRole && (
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
                Module Permissions
              </Typography>
              
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${COLORS.border}`, borderRadius: 1.5 }}>
                  <Table size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                        <TableCell sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.7rem',
                          letterSpacing: '0.5px',
                          color: COLORS.text.light,
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
                          {/* Category Header Row */}
                          <TableRow sx={{ bgcolor: `${COLORS.accent}10` }}>
                            <TableCell 
                              colSpan={ALL_ACTIONS.length + 1}
                              sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.7rem', 
                                color: COLORS.accent,
                                py: 1,
                                cursor: 'pointer'
                              }}
                              onClick={() => toggleCategory(category)}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton size="small" sx={{ p: 0 }}>
                                  {expandedCategories[category] ? 
                                    <KeyboardArrowDownIcon fontSize="small" sx={{ color: COLORS.accent }} /> : 
                                    <KeyboardArrowRightIcon fontSize="small" sx={{ color: COLORS.accent }} />
                                  }
                                </IconButton>
                                {category}
                              </Box>
                            </TableCell>
                          </TableRow>
                          
                          {/* Pages Rows */}
                          {expandedCategories[category] && pages.map((page) => {
                            const selectedCount = getPageSelectedCount(page.module);
                            const allSelected = selectedCount === ALL_ACTIONS.length;
                            const someSelected = selectedCount > 0 && selectedCount < ALL_ACTIONS.length;
                            
                            return (
                              <TableRow key={page.module} hover>
                                <TableCell sx={{ fontSize: '0.75rem', color: COLORS.text.primary, py: 1.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                        {page.page}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                        {page.module}
                                      </Typography>
                                    </Box>
                                    <Checkbox
                                      size="small"
                                      checked={allSelected}
                                      indeterminate={someSelected}
                                      onChange={(e) => handleSelectAllForPage(page.module, e.target.checked)}
                                      sx={{
                                        color: COLORS.accent,
                                        '&.Mui-checked': {
                                          color: COLORS.accent,
                                        },
                                        '&.MuiCheckbox-indeterminate': {
                                          color: COLORS.accent,
                                        }
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                {ALL_ACTIONS.map((action) => {
                                  const isChecked = permissions[`${page.module}_${action}`] || false;
                                  return (
                                    <TableCell key={action} align="center" sx={{ p: 1 }}>
                                      <Checkbox
                                        checked={isChecked}
                                        onChange={(e) => handlePermissionChange(page.module, action, e.target.checked)}
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
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{
            height: 36,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
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
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.RoleId || !formData.Username.trim() || !formData.Email.trim() || !formData.Password}
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 2,
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
          {loading ? 'Adding...' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUser;