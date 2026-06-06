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
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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

// Modules that only have VIEW permission
const VIEW_ONLY_MODULES = ['DASHBOARD', 'REPORTS'];

// All pages/modules from sidebar (TRAINERS removed)
const ALL_PAGES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard', viewOnly: true },
  { module: 'DEPARTMENT_MANAGEMENT', page: 'Department Management', category: 'Masters', viewOnly: false },
  { module: 'DOMAIN_MANAGEMENT', page: 'Domain Management', category: 'Masters', viewOnly: false },
  { module: 'HOLIDAY_MANAGEMENT', page: 'Holiday Management', category: 'Masters', viewOnly: false },
  { module: 'COLLEGE_MANAGEMENT', page: 'College Management', category: 'Masters', viewOnly: false },
  { module: 'STUDENT_MANAGEMENT', page: 'Student Management', category: 'Masters', viewOnly: false },
  { module: 'BATCH_MANAGEMENT', page: 'Batch Management', category: 'Masters', viewOnly: false },
  // TRAINERS module removed
  { module: 'ATTENDANCE', page: 'Attendance', category: 'Transactions', viewOnly: false },
  { module: 'USER_MANAGEMENT', page: 'User Management', category: 'Administration', viewOnly: false },
  { module: 'USERS', page: 'Users', category: 'Administration', viewOnly: false },
  { module: 'ROLES', page: 'Roles', category: 'Administration', viewOnly: false },
  { module: 'REPORTS', page: 'Reports', category: 'Reports', viewOnly: true }
];

// Get available actions for a module
const getAvailableActions = (module) => {
  if (VIEW_ONLY_MODULES.includes(module)) {
    return ['VIEW'];
  }
  return ALL_ACTIONS;
};

// Group pages by category
const groupedPages = ALL_PAGES.reduce((acc, page) => {
  if (!acc[page.category]) {
    acc[page.category] = [];
  }
  acc[page.category].push(page);
  return acc;
}, {});

// Map module and action to permission ID (TRAINERS entries removed)
const getPermissionId = (moduleKey, action) => {
  const mapping = {
    'DASHBOARD_VIEW': 1,
    'DEPARTMENT_MANAGEMENT_VIEW': 23,
    'DEPARTMENT_MANAGEMENT_CREATE': 24,
    'DEPARTMENT_MANAGEMENT_UPDATE': 25,
    'DEPARTMENT_MANAGEMENT_DELETE': 26,
    'DOMAIN_MANAGEMENT_VIEW': 30,
    'DOMAIN_MANAGEMENT_CREATE': 31,
    'DOMAIN_MANAGEMENT_UPDATE': 32,
    'DOMAIN_MANAGEMENT_DELETE': 33,
    'HOLIDAY_MANAGEMENT_VIEW': 64,
    'HOLIDAY_MANAGEMENT_CREATE': 65,
    'HOLIDAY_MANAGEMENT_UPDATE': 66,
    'HOLIDAY_MANAGEMENT_DELETE': 67,
    'COLLEGE_MANAGEMENT_VIEW': 57,
    'COLLEGE_MANAGEMENT_CREATE': 58,
    'COLLEGE_MANAGEMENT_UPDATE': 59,
    'COLLEGE_MANAGEMENT_DELETE': 60,
    'BATCH_MANAGEMENT_VIEW': 37,
    'BATCH_MANAGEMENT_CREATE': 38,
    'BATCH_MANAGEMENT_UPDATE': 39,
    'BATCH_MANAGEMENT_DELETE': 40,
    'STUDENT_MANAGEMENT_VIEW': 44,
    'STUDENT_MANAGEMENT_CREATE': 45,
    'STUDENT_MANAGEMENT_UPDATE': 46,
    'STUDENT_MANAGEMENT_DELETE': 47,
    // TRAINERS entries removed (51-54)
    'ATTENDANCE_VIEW': 71,
    'ATTENDANCE_CREATE': 72,
    'ATTENDANCE_UPDATE': 73,
    'ATTENDANCE_DELETE': 74,
    'USER_MANAGEMENT_VIEW': 2,
    'USER_MANAGEMENT_CREATE': 3,
    'USER_MANAGEMENT_UPDATE': 4,
    'USER_MANAGEMENT_DELETE': 5,
    'USERS_VIEW': 9,
    'USERS_CREATE': 10,
    'USERS_UPDATE': 11,
    'USERS_DELETE': 12,
    'ROLES_VIEW': 16,
    'ROLES_CREATE': 17,
    'ROLES_UPDATE': 18,
    'ROLES_DELETE': 19,
    'REPORTS_VIEW': 78
  };
  
  const key = `${moduleKey}_${action}`;
  return mapping[key] || null;
};

const AddUser = ({ open, onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: '',
    is_active: true,
    college: ''
  });
  
  // Roles data
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});

  // Colleges data
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Permissions state - store as object with module_action keys
  const [permissions, setPermissions] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch roles from API
  useEffect(() => {
    if (open) {
      fetchRoles();
      fetchColleges();
      resetForm();
    }
  }, [open]);

  const fetchRoles = async () => {
    setLoadingRoles(true);
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
          is_super_admin: role.is_super_admin,
          permissions: role.permissions || []
        }));
        setRoles(rolesList);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to load roles');
    } finally {
      setLoadingRoles(false);
    }
  };

  // Fetch colleges from API
  const fetchColleges = async () => {
    setLoadingColleges(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/colleges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        const collegesList = response.data.data.map(college => ({
          id: college.id,
          name: college.name,
          address: college.address,
          city: college.city,
          state: college.state,
          pincode: college.pincode,
          contact_number: college.contact_number,
          email: college.email
        }));
        setColleges(collegesList);
      } else {
        setColleges([]);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setError('Failed to load colleges');
    } finally {
      setLoadingColleges(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      password: '',
      password_confirmation: '',
      role_id: '',
      is_active: true,
      college: ''
    });
    setSelectedRole(null);
    setSelectedCollege(null);
    setPermissions({});
    setRolePermissions({});
    setError('');
    setFieldErrors({});
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
    
    // Initialize all possible permissions to false
    ALL_PAGES.forEach(page => {
      const availableActions = getAvailableActions(page.module);
      availableActions.forEach(action => {
        const key = `${page.module}_${action}`;
        initialPermissions[key] = false;
      });
    });

    // Store role permissions for reference
    const rolePermMap = {};
    
    if (role && role.permissions && role.permissions.length > 0) {
      role.permissions.forEach(perm => {
        let module, action;
        
        if (perm.module_key && perm.action) {
          module = perm.module_key;
          action = perm.action;
        } else if (perm.module && perm.action) {
          module = perm.module;
          action = perm.action;
        }
        
        if (module && action) {
          // Only set if this action is available for the module
          const availableActions = getAvailableActions(module);
          if (availableActions.includes(action)) {
            const key = `${module}_${action}`;
            initialPermissions[key] = true;
            rolePermMap[key] = true;
          }
        }
      });
    }

    setPermissions(initialPermissions);
    setRolePermissions(rolePermMap);
  };

  const handleRoleChange = (event, newValue) => {
    setSelectedRole(newValue);
    // Clear field errors when user makes changes
    setFieldErrors(prev => ({ ...prev, role_id: '' }));
    
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        role_id: newValue.id,
        college: newValue.name.toLowerCase() === 'college' ? prev.college : ''
      }));
      initializePermissionsFromRole(newValue);
      
      // Reset selected college if role is not college
      if (newValue.name.toLowerCase() !== 'college') {
        setSelectedCollege(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        role_id: '',
        college: ''
      }));
      setSelectedCollege(null);
      const emptyPermissions = {};
      ALL_PAGES.forEach(page => {
        const availableActions = getAvailableActions(page.module);
        availableActions.forEach(action => {
          const key = `${page.module}_${action}`;
          emptyPermissions[key] = false;
        });
      });
      setPermissions(emptyPermissions);
      setRolePermissions({});
    }
  };

  const handleCollegeChange = (event, newValue) => {
    setSelectedCollege(newValue);
    // Clear field errors when user makes changes
    setFieldErrors(prev => ({ ...prev, college: '' }));
    setFormData(prev => ({
      ...prev,
      college: newValue ? newValue.name : ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Clear field error for this specific field when user starts typing
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      is_active: checked
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
    const availableActions = getAvailableActions(module);
    availableActions.forEach(action => {
      const key = `${module}_${action}`;
      newPermissions[key] = checked;
    });
    setPermissions(newPermissions);
  };

  const getPageSelectedCount = (module) => {
    let count = 0;
    const availableActions = getAvailableActions(module);
    availableActions.forEach(action => {
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

  // Check if a permission is from the role (inherited) - for display only
  const isPermissionFromRole = (module, action) => {
    const key = `${module}_${action}`;
    return rolePermissions[key] === true;
  };

  // Transform permissions to array of permission IDs
  const getSelectedPermissionIds = () => {
    const permissionIds = [];
    
    ALL_PAGES.forEach(page => {
      const availableActions = getAvailableActions(page.module);
      availableActions.forEach(action => {
        const key = `${page.module}_${action}`;
        if (permissions[key]) {
          const permissionId = getPermissionId(page.module, action);
          if (permissionId) {
            permissionIds.push(permissionId);
          }
        }
      });
    });
    
    return permissionIds;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.role_id) {
      errors.role_id = 'Please select a role';
    }

    // Validate college selection if role is college
    if (selectedRole && selectedRole.name.toLowerCase() === 'college' && !formData.college) {
      errors.college = 'Please select a college';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to parse API errors
  const parseApiErrors = (errorResponse) => {
    const errors = {};
    
    if (errorResponse.data && errorResponse.data.errors) {
      // Handle Laravel style validation errors
      const apiErrors = errorResponse.data.errors;
      Object.keys(apiErrors).forEach(field => {
        if (Array.isArray(apiErrors[field])) {
          errors[field] = apiErrors[field][0]; // Take first error message
        } else {
          errors[field] = apiErrors[field];
        }
      });
    } else if (errorResponse.data && errorResponse.data.message) {
      // Handle general error message
      setError(errorResponse.data.message);
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setError('');
    setFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const permissionIds = getSelectedPermissionIds();
      
      const requestData = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role_id: formData.role_id,
        is_active: formData.is_active,
        permissions: permissionIds
      };

      // Add college field to request if role is college
      if (selectedRole && selectedRole.name.toLowerCase() === 'college') {
        requestData.college = formData.college;
      }

      const response = await axios.post(`${BASE_URL}/users`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      
      if (err.response) {
        // Check if it's a validation error (422)
        if (err.response.status === 422) {
          const fieldErrors = parseApiErrors(err.response);
          if (Object.keys(fieldErrors).length > 0) {
            setFieldErrors(fieldErrors);
          } else {
            setError(err.response.data?.message || 'Validation failed. Please check your input.');
          }
        } else {
          // Handle other errors
          setError(err.response.data?.message || 'Failed to create user. Please try again.');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Check if selected role is "college"
  const isCollegeRole = selectedRole && selectedRole.name.toLowerCase() === 'college';

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
                  FULL NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="John Doe"
                  size="small"
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
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
                  MOBILE NUMBER <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="9876543210"
                  size="small"
                  error={!!fieldErrors.mobile}
                  helperText={fieldErrors.mobile}
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
                  10-digit mobile number
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  EMAIL <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="john@example.com"
                  size="small"
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
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
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 40 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
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
                        label={formData.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.is_active ? '#D1FAE5' : '#FEE2E2',
                          color: formData.is_active ? '#10B981' : '#EF4444'
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  PASSWORD <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
                  size="small"
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
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
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="••••••••"
                  size="small"
                  error={!!fieldErrors.password_confirmation}
                  helperText={fieldErrors.password_confirmation}
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

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                ROLE <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <Autocomplete
                options={roles}
                loading={loadingRoles}
                value={selectedRole}
                onChange={handleRoleChange}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select a role"
                    error={!!fieldErrors.role_id}
                    helperText={fieldErrors.role_id}
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
                        {option.name}
                      </Typography>
                      {option.description && (
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                          {option.description}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
            </Box>

            {/* College Dropdown - Only show when role is college */}
            {isCollegeRole && (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  COLLEGE <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <Autocomplete
                  options={colleges}
                  loading={loadingColleges}
                  value={selectedCollege}
                  onChange={handleCollegeChange}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a college"
                      error={!!fieldErrors.college}
                      helperText={fieldErrors.college}
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
                          {option.name}
                        </Typography>
                        {option.city && option.state && (
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            {option.city}, {option.state}
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                />
              </Box>
            )}
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
                            const availableActions = getAvailableActions(page.module);
                            const selectedCount = getPageSelectedCount(page.module);
                            const allSelected = selectedCount === availableActions.length && availableActions.length > 0;
                            const someSelected = selectedCount > 0 && selectedCount < availableActions.length;
                            const hasRolePermissions = availableActions.some(action => isPermissionFromRole(page.module, action));
                            
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
                                      {page.viewOnly && (
                                        <Chip 
                                          label="View Only" 
                                          size="small" 
                                          sx={{ 
                                            fontSize: '0.6rem', 
                                            height: 18, 
                                            mt: 0.5,
                                            bgcolor: '#E0F2FE',
                                            color: '#00AEED'
                                          }} 
                                        />
                                      )}
                                    </Box>
                                    {!page.viewOnly && availableActions.length > 0 && (
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
                                    )}
                                    {page.viewOnly && (
                                      <Box sx={{ width: 42 }} />
                                    )}
                                  </Box>
                                </TableCell>
                                {ALL_ACTIONS.map((action) => {
                                  const isActionAvailable = availableActions.includes(action);
                                  const isChecked = isActionAvailable && (permissions[`${page.module}_${action}`] || false);
                                  const isRolePermission = isActionAvailable && isPermissionFromRole(page.module, action);
                                  
                                  if (!isActionAvailable) {
                                    // Show dash (-) for unavailable actions
                                    return (
                                      <TableCell key={action} align="center" sx={{ p: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                          <RemoveIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                        </Box>
                                      </TableCell>
                                    );
                                  }
                                  
                                  return (
                                    <TableCell key={action} align="center" sx={{ p: 1 }}>
                                      <Box sx={{ textAlign: 'center' }}>
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
                                        {isRolePermission && (
                                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                            Inherited
                                          </Typography>
                                        )}
                                      </Box>
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
          disabled={loading || !formData.role_id || !formData.name.trim() || !formData.mobile.trim() || !formData.email.trim() || !formData.password || (isCollegeRole && !formData.college)}
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