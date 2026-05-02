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
  KeyboardArrowRight as KeyboardArrowRightIcon
} from '@mui/icons-material';

// Color constants (matching StudentManagement)
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

// Only pages from Sidebar
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

const AddRole = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    RoleName: '',
    Description: '',
    IsActive: true,
    isSuperAdmin: false
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
        RoleName: '',
        Description: '',
        IsActive: true,
        isSuperAdmin: false
      });

      // Initialize all permissions to false
      const initialPermissions = {};
      ALL_PAGES.forEach(page => {
        ALL_ACTIONS.forEach(action => {
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.RoleName.trim()) {
      setError('Role name is required');
      return;
    }

    if (formData.RoleName.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const permissionsArray = transformPermissionsToFormat();
      
      const newRole = {
        RoleName: formData.RoleName.trim(),
        Description: formData.Description.trim(),
        IsActive: formData.IsActive,
        isSuperAdmin: formData.isSuperAdmin,
        permissions: permissionsArray,
        permissionsCount: permissionsArray.length,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };

      // Simulate API call with setTimeout
      setTimeout(() => {
        onAdd(newRole);
        setLoading(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Error adding role:', err);
      setError('Failed to add role. Please try again.');
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
                  name="RoleName"
                  value={formData.RoleName}
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
                        checked={formData.IsActive}
                        onChange={handleInputChange}
                        name="IsActive"
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
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isSuperAdmin}
                        onChange={handleInputChange}
                        name="isSuperAdmin"
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
                          bgcolor: formData.isSuperAdmin ? '#D1FAE5' : '#FEE2E2',
                          color: formData.isSuperAdmin ? '#10B981' : '#EF4444'
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
                name="Description"
                value={formData.Description}
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
                          const selectedCount = getPageSelectedCount(page.module);
                          const allSelected = selectedCount === ALL_ACTIONS.length;
                          const someSelected = selectedCount > 0 && selectedCount < ALL_ACTIONS.length;
                          
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
          disabled={loading || !formData.RoleName.trim()}
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