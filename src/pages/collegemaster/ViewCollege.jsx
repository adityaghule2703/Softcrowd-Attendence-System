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
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  PinDrop as PinDropIcon,
  CalendarToday as CalendarIcon
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

const ViewCollege = ({ open, onClose, college, onEdit }) => {
  if (!college) return null;

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

  // Get college initials for ID chip
  const getCollegeInitials = (name) => {
    if (!name) return 'CLG';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  // Helper function to get contact number
  const getContactNumber = () => {
    return college.contact_number || college.contact || '-';
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
          College Details
        </Typography>
        <Chip
          label={`ID: ${college?.id || 'N/A'}`}
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
          {/* College Name */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <BusinessIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                COLLEGE NAME
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: COLORS.text.primary,
              ml: 3.5
            }}>
              {college?.name || 'N/A'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Address */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <LocationIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                ADDRESS
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              color: COLORS.text.secondary,
              ml: 3.5,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {college?.address || 'No address provided'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Location Details (City, State, Pincode) */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <PinDropIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  CITY
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {college?.city || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <LocationIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  STATE
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {college?.state || 'N/A'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <PinDropIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  PINCODE
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {college?.pincode || 'N/A'}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Contact Information */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <PhoneIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  CONTACT NUMBER
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {getContactNumber()}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <EmailIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  EMAIL
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {college?.email || 'Not provided'}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Metadata Information */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                {formatDate(college?.created_at)}
              </Typography>
            </Box>

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
                {formatDate(college?.updated_at)}
              </Typography>
            </Box>
          </Stack>

          {/* User ID (if available) */}
          {college?.user_id && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <BusinessIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    USER ID
                  </Typography>
                </Stack>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: COLORS.text.secondary,
                  ml: 3.5
                }}>
                  {college?.user_id}
                </Typography>
              </Box>
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

export default ViewCollege;