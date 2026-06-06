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
  IconButton
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

// Get available actions for a module
const getAvailableActions = (module) => {
  if (VIEW_ONLY_MODULES.includes(module)) {
    return ['VIEW'];
  }
  return ALL_ACTIONS;
};

// All pages with their module keys (TRAINERS removed)
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
    'BATCH_MANAGEMENT_VIEW': 37,
    'BATCH_MANAGEMENT_CREATE': 38,
    'BATCH_MANAGEMENT_UPDATE': 39,
    'BATCH_MANAGEMENT_DELETE': 40,
    'STUDENT_MANAGEMENT_VIEW': 44,
    'STUDENT_MANAGEMENT_CREATE': 45,
    'STUDENT_MANAGEMENT_UPDATE': 46,
    'STUDENT_MANAGEMENT_DELETE': 47,
    // TRAINERS entries removed (51-54)
    'COLLEGE_MANAGEMENT_VIEW': 57,
    'COLLEGE_MANAGEMENT_CREATE': 58,
    'COLLEGE_MANAGEMENT_UPDATE': 59,
    'COLLEGE_MANAGEMENT_DELETE': 60,
    'HOLIDAY_MANAGEMENT_VIEW': 64,
    'HOLIDAY_MANAGEMENT_CREATE': 65,
    'HOLIDAY_MANAGEMENT_UPDATE': 66,
    'HOLIDAY_MANAGEMENT_DELETE': 67,
    'ATTENDANCE_VIEW': 71,
    'ATTENDANCE_CREATE': 72,
    'ATTENDANCE_UPDATE': 73,
    'ATTENDANCE_DELETE': 74,
    'REPORTS_VIEW': 78,
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
  };
  
  const key = `${moduleKey}_${action}`;
  return mapping[key] || null;
};

const AddRole = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    is_super_admin: false
  });
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Initialize permissions when dialog opens
  useEffect(() => {
    if (open) {
      // Reset form data
      setFormData({
        name: '',
        description: '',
        is_active: true,
        is_super_admin: false
      });

      // Initialize all permissions to false (only for available actions)
      const initialPermissions = {};
      ALL_PAGES.forEach(page => {
        const availableActions = getAvailableActions(page.module);
        availableActions.forEach(action => {
          const key = `${page.module}_${action}`;
          initialPermissions[key] = false;
        });
      });
      setPermissions(initialPermissions);
      
      // Expand all categories initially
      const expanded = {};
      Object.keys(groupedPages).forEach(category => {
        expanded[category] = true;
      });
      setExpandedCategories(expanded);
      
      // Clear error
      setError('');
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const permissionIds = getSelectedPermissionIds();
      
      const requestData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        is_active: formData.is_active,
        is_super_admin: formData.is_super_admin,
        permissions: permissionIds
      };

      const response = await axios.post(`${BASE_URL}/roles`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        // Call the onAdd callback with the new role data
        onAdd(response.data.data);
        setLoading(false);
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to add role');
      }
    } catch (err) {
      console.error('Error adding role:', err);
      setError(err.response?.data?.message || 'Failed to add role. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
            Add New Role
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            Create a new role with custom permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={onClose} size="small" disabled={loading}>
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
                  ROLE NAME <span style={{ color: '#EF4444' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="e.g., HR Manager, Admin, Employee"
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
                  STATUS
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', height: 40 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        name="is_active"
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
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_super_admin}
                        onChange={handleInputChange}
                        name="is_super_admin"
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
                        label="Super Admin"
                        size="small"
                        sx={{ 
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: formData.is_super_admin ? '#D1FAE5' : '#FEE2E2',
                          color: formData.is_super_admin ? '#10B981' : '#EF4444'
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                DESCRIPTION
              </Typography>
              <TextField
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                disabled={loading}
                placeholder="Enter role description and responsibilities..."
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

          {/* Permissions Section */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Module Permissions
            </Typography>
            
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
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
                        
                        {/* Pages Rows - Only show if category is expanded */}
                        {expandedCategories[category] && pages.map((page) => {
                          const availableActions = getAvailableActions(page.module);
                          const selectedCount = getPageSelectedCount(page.module);
                          const allSelected = selectedCount === availableActions.length && availableActions.length > 0;
                          const someSelected = selectedCount > 0 && selectedCount < availableActions.length;
                          
                          return (
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
          onClick={onClose} 
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
          disabled={loading || !formData.name.trim()}
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
          {loading ? 'Adding...' : 'Add Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRole;