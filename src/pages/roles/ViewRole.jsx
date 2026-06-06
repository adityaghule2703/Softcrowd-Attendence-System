import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
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
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9'
  }
};

// All available actions
const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE'];

// All modules/pages based on the API response structure (TRAINERS removed)
const ALL_MODULES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  { module: 'USER_MANAGEMENT', page: 'User Management', category: 'User Management' },
  { module: 'USERS', page: 'Users', category: 'User Management' },
  { module: 'ROLES', page: 'Roles', category: 'User Management' },
  { module: 'DEPARTMENT_MANAGEMENT', page: 'Department Management', category: 'Masters' },
  { module: 'DOMAIN_MANAGEMENT', page: 'Domain Management', category: 'Masters' },
  { module: 'HOLIDAY_MANAGEMENT', page: 'Holiday Management', category: 'Masters' },
  { module: 'BATCH_MANAGEMENT', page: 'Batch Management', category: 'Masters' },
  { module: 'STUDENT_MANAGEMENT', page: 'Student Management', category: 'Masters' },
  // TRAINERS module removed
  { module: 'COLLEGE_MANAGEMENT', page: 'College Management', category: 'Masters' },
  { module: 'ATTENDANCE', page: 'Attendance', category: 'Operations' },
  { module: 'REPORTS', page: 'Reports', category: 'Operations' }
];

// Group pages by category
const groupedModules = ALL_MODULES.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

const ViewRole = ({ open, onClose, role, onEdit }) => {
  // Comprehensive console logging
  React.useEffect(() => {
    if (open && role) {
      console.log('=== ViewRole Component Debug ===');
      console.log('Role prop received:', role);
      console.log('Role ID:', role.id);
      console.log('Role Name:', role.RoleName);
      console.log('Role Description:', role.Description);
      console.log('Role IsActive:', role.IsActive);
      console.log('Role isSuperAdmin:', role.isSuperAdmin);
      console.log('Role CreatedAt:', role.CreatedAt);
      console.log('Role UpdatedAt:', role.UpdatedAt);
      console.log('Role Permissions:', role.permissions);
      console.log('================================');
    }
  }, [open, role]);

  // Create permission map from the role's permissions
  const permissionMap = React.useMemo(() => {
    const map = {};
    if (role?.permissions && Array.isArray(role.permissions)) {
      console.log('Building permission map from permissions array:', role.permissions);
      role.permissions.forEach(perm => {
        const key = `${perm.module_key}_${perm.action}`;
        map[key] = true;
        console.log(`Added permission: ${key}`);
      });
    }
    console.log('Final permission map:', map);
    return map;
  }, [role]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get role ID display
  const getRoleIdDisplay = () => {
    if (!role?.id) return 'N/A';
    const idStr = String(role.id);
    return idStr.length > 6 ? idStr.slice(-6) : idStr;
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
            View Role Details
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            View role information and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {role?.id && (
            <Chip
              label={`ID: ${getRoleIdDisplay()}`}
              size="small"
              sx={{ 
                fontSize: '0.65rem',
                fontWeight: 500,
                height: 20,
                bgcolor: COLORS.background.light,
                color: COLORS.text.secondary
              }}
            />
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  ROLE NAME
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {role?.RoleName || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Chip
                  label={role?.IsActive ? 'Active' : 'Inactive'}
                  size="small"
                  icon={role?.IsActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  sx={{
                    bgcolor: role?.IsActive ? COLORS.chips.active : COLORS.chips.inactive,
                    color: role?.IsActive ? COLORS.primaryDark : COLORS.text.secondary,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    height: 24
                  }}
                />
              </Box>
            </Box>

            {/* Super Admin Badge */}
            {role?.isSuperAdmin && (
              <Box sx={{ mt: 1.5 }}>
                <Chip
                  label="Super Admin"
                  size="small"
                  sx={{
                    bgcolor: '#D1FAE5',
                    color: '#10B981',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    height: 24
                  }}
                />
              </Box>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                DESCRIPTION
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                {role?.Description || 'No description provided'}
              </Typography>
            </Box>

            {/* Created and Updated Info */}
            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {role?.CreatedAt && (
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    CREATED DATE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDate(role.CreatedAt)}
                  </Typography>
                </Box>
              )}
              
              {role?.UpdatedAt && (
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    LAST UPDATED
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDate(role.UpdatedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Permissions Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Module Permissions
              </Typography>
              <Chip
                label={`${role?.permissions?.length || 0} permission${role?.permissions?.length !== 1 ? 's' : ''} assigned`}
                size="small"
                sx={{
                  bgcolor: COLORS.background.light,
                  color: COLORS.primary,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  height: 24
                }}
              />
            </Box>
            
            {role?.isSuperAdmin ? (
              // Special message for Super Admin
              <Box sx={{ 
                textAlign: 'center', 
                py: 4, 
                bgcolor: COLORS.background.light,
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
              <>
                <Box sx={{ overflowX: 'auto' }}>
                  <TableContainer>
                    <Table size="small" sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                          <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light, minWidth: 200 }}>
                            Pages / Modules
                          </TableCell>
                          {ALL_ACTIONS.map((action) => (
                            <TableCell key={action} align="center" sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light, minWidth: 70 }}>
                              {action}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(groupedModules).map(([category, modules]) => (
                          <React.Fragment key={category}>
                            <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                              <TableCell colSpan={ALL_ACTIONS.length + 1} sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.primary, py: 1 }}>
                                {category}
                              </TableCell>
                            </TableRow>
                            {modules.map((module) => (
                              <TableRow key={module.module} hover>
                                <TableCell sx={{ fontSize: '0.75rem', py: 1.5 }}>
                                  <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{module.page}</Typography>
                                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{module.module}</Typography>
                                  </Box>
                                </TableCell>
                                {ALL_ACTIONS.map((action) => {
                                  const hasPermission = permissionMap[`${module.module}_${action}`];
                                  return (
                                    <TableCell key={action} align="center">
                                      <Checkbox
                                        checked={!!hasPermission}
                                        disabled
                                        size="small"
                                        sx={{ 
                                          color: COLORS.primary, 
                                          '&.Mui-checked': { 
                                            color: COLORS.primary 
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
                  </TableContainer>
                </Box>

                {/* No permissions message */}
                {(!role?.permissions || role.permissions.length === 0) && (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    bgcolor: COLORS.background.light,
                    borderRadius: 1,
                    mt: 2
                  }}>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                      No permissions assigned to this role
                    </Typography>
                  </Box>
                )}
              </>
            )}
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
        <Button onClick={onClose}>
          Close
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default ViewRole;