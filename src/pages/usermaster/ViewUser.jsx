import React, { useState, useEffect } from 'react';
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
  IconButton,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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

// All possible pages/modules - This ensures ALL pages are shown
const ALL_PAGES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  { module: 'DEPARTMENT_MANAGEMENT', page: 'Department Management', category: 'Masters' },
  { module: 'DOMAIN_MANAGEMENT', page: 'Domain Management', category: 'Masters' },
  { module: 'HOLIDAY_MANAGEMENT', page: 'Holiday Management', category: 'Masters' },
  { module: 'COLLEGE_MANAGEMENT', page: 'College Management', category: 'Masters' },
  { module: 'STUDENT_MANAGEMENT', page: 'Student Management', category: 'Masters' },
  { module: 'BATCH_MANAGEMENT', page: 'Batch Management', category: 'Masters' },
  { module: 'TRAINERS', page: 'Trainers', category: 'Masters' },
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

const ViewUser = ({ open, onClose, userId, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data when modal opens
  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
    }
  }, [open, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setUser(response.data.data);
        console.log('User data fetched:', response.data.data);
        console.log('User permissions:', response.data.data.user_permissions);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

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

  // Get user ID display
  const getUserIdDisplay = () => {
    if (!user?.id) return 'N/A';
    const idStr = String(user.id);
    return idStr.length > 6 ? idStr.slice(-6) : idStr;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.substring(0, 2).toUpperCase();
  };

  // Get avatar color based on username
  const getAvatarColor = () => {
    const colors = [COLORS.primary, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = user?.name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get role chip color
  const getRoleColor = () => {
    switch (user?.role?.name) {
      case 'Super Admin':
        return { bg: '#D1FAE5', color: '#10B981' };
      case 'ADMIN':
        return { bg: '#E0F2FE', color: '#00AEED' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Render permissions table - Shows ALL pages from ALL_PAGES constant
  const renderPermissionsTable = () => {
    // Create a permission map from user_permissions for quick lookup
    const permissionMap = {};
    if (user?.user_permissions && Array.isArray(user.user_permissions)) {
      user.user_permissions.forEach(perm => {
        const key = `${perm.module_key}_${perm.action}`;
        permissionMap[key] = true;
      });
    }

    return (
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
              {Object.entries(groupedAllPages).map(([category, pages]) => (
                <React.Fragment key={category}>
                  <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                    <TableCell colSpan={ALL_ACTIONS.length + 1} sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.primary, py: 1 }}>
                      {category}
                    </TableCell>
                  </TableRow>
                  {pages.map((page) => (
                    <TableRow key={page.module} hover>
                      <TableCell sx={{ fontSize: '0.75rem', py: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{page.page}</Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{page.module}</Typography>
                        </Box>
                      </TableCell>
                      {ALL_ACTIONS.map((action) => {
                        const hasPermission = !!permissionMap[`${page.module}_${action}`];
                        return (
                          <TableCell key={action} align="center">
                            <Checkbox
                              checked={hasPermission}
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
    );
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
            View User Details
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            View user information and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user?.id && (
            <Chip
              label={`ID: ${getUserIdDisplay()}`}
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress sx={{ color: COLORS.primary }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#EF4444', mb: 1 }}>Error loading user details</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>{error}</Typography>
          </Box>
        ) : user ? (
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
                Basic Information
              </Typography>
              
              {/* User Avatar and Name Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    bgcolor: getAvatarColor(),
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}
                >
                  {getUserInitials()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
                    {user?.name || 'N/A'}
                  </Typography>
                  <Chip
                    label={user?.role?.name || 'No Role'}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor: getRoleColor().bg,
                      color: getRoleColor().color,
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      height: 24
                    }}
                  />
                  {user?.role?.name === 'Super Admin' && (
                    <Chip
                      label="Super Admin"
                      size="small"
                      sx={{
                        mt: 0.5,
                        ml: 1,
                        bgcolor: '#D1FAE5',
                        color: '#10B981',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        height: 24
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: '0.7rem' }} />
                    EMAIL ADDRESS
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {user?.email || 'N/A'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: '0.7rem' }} />
                    MOBILE NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {user?.mobile || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    STATUS
                  </Typography>
                  <Chip
                    label={user?.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    icon={user?.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    sx={{
                      bgcolor: user?.is_active ? COLORS.chips.active : COLORS.chips.inactive,
                      color: user?.is_active ? COLORS.primaryDark : COLORS.text.secondary,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      height: 24
                    }}
                  />
                </Box>
                
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BadgeIcon sx={{ fontSize: '0.7rem' }} />
                    ROLE SLUG
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {user?.role?.slug || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Created and Updated Info */}
              <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {user?.created_at && (
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: '0.7rem' }} />
                      CREATED DATE
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(user.created_at)}
                    </Typography>
                  </Box>
                )}
                
                {user?.updated_at && (
                  <Box>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                      LAST UPDATED
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {formatDate(user.updated_at)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Permissions Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User Permissions
                </Typography>
                <Chip
                  label={`${user?.user_permissions?.length || 0} permission${user?.user_permissions?.length !== 1 ? 's' : ''} assigned`}
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
              
              {user?.role?.name === 'Super Admin' ? (
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
                renderPermissionsTable()
              )}
            </Box>
          </Stack>
        ) : null}
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
          onClick={() => {
            console.log('🔴 Close button clicked - Closing View User modal');
            onClose();
          }}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: COLORS.background.hover
            }
          }}
        >
          Close
        </Button>
       
      </DialogActions>
    </Dialog>
  );
};

export default ViewUser;