import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import {
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  PinDrop as PinDropIcon
} from '@mui/icons-material';

// Color constants
const COLORS = {
  primary: '#0F172A',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC'
  },
  border: '#E2E8F0'
};

const ViewDepartment = ({ open, onClose, department, onEdit }) => {
  if (!department) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get department initials
  const getDepartmentInitials = (name) => {
    if (!name) return 'DEPT';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  // Helper function to get contact number
  const getContactNumber = () => {
    return department.coordinator_contact || department.coordinatorContact || '-';
  };

  // Get college name from nested college object or direct property
  const getCollegeName = () => {
    return department.college?.name || department.collegeName || 'N/A';
  };

  // Get college location from nested college object
  const getCollegeLocation = () => {
    if (department.college) {
      return `${department.college.city}, ${department.college.state}`;
    }
    return department.collegeCity || department.collegeState ? 
      `${department.collegeCity || ''}, ${department.collegeState || ''}` : 'N/A';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
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
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Department Details
        </Typography>
        <Chip
          label={`ID: ${department?.id || 'N/A'}`}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.65rem',
            fontWeight: 500,
            bgcolor: COLORS.background.light,
            color: COLORS.text.secondary
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          {/* Department Name */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <SchoolIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                DEPARTMENT NAME
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: COLORS.text.primary,
              ml: 3.5
            }}>
              {department?.department_name || department?.departmentName || 'N/A'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

       

          

          {/* Coordinator Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                COORDINATOR INFORMATION
              </Typography>
            </Stack>
            
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    NAME
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 500,
                    color: COLORS.text.primary
                  }}>
                    {department?.coordinator_name || department?.coordinatorName || 'N/A'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <PhoneIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    CONTACT NUMBER
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: COLORS.text.primary
                  }}>
                    {getContactNumber()}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <EmailIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    EMAIL ADDRESS
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: COLORS.text.primary
                  }}>
                    {department?.coordinator_email || department?.coordinatorEmail || 'Not provided'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* College Address Details (if college object exists) */}
          {department.college && (
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  COLLEGE ADDRESS
                </Typography>
              </Stack>
              
              <Typography sx={{ 
                fontSize: '0.75rem', 
                color: COLORS.text.secondary,
                ml: 3.5,
                mb: 1.5,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {department.college.address || 'No address provided'}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ ml: 3.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    PINCODE
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    {department.college.pincode || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    CONTACT
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    {department.college.contact_number || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          {/* Metadata Information */}
          {(department.created_at || department.updated_at) && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {department.created_at && (
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        CREATED AT
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      fontSize: '0.7rem', 
                      color: COLORS.text.secondary,
                      ml: 3.5
                    }}>
                      {formatDate(department.created_at)}
                    </Typography>
                  </Box>
                )}

                {department.updated_at && (
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        LAST UPDATED
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      fontSize: '0.7rem', 
                      color: COLORS.text.secondary,
                      ml: 3.5
                    }}>
                      {formatDate(department.updated_at)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>

       
      </DialogActions>
    </Dialog>
  );
};

export default ViewDepartment;