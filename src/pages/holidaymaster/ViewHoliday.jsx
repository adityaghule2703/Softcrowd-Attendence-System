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
  Celebration as CelebrationIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Edit as EditIcon
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

const ViewHoliday = ({ open, onClose, holiday, onEdit }) => {
  if (!holiday) return null;

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

  const getStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(holiday.start_date);
    const end = new Date(holiday.end_date);
    
    if (today > end) return { label: 'Past', color: '#EF4444', bg: '#FEE2E2' };
    if (today >= start && today <= end) return { label: 'Ongoing', color: '#F59E0B', bg: '#FEF3C7' };
    return { label: 'Upcoming', color: '#10B981', bg: '#D1FAE5' };
  };

  const status = getStatus();

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
          Holiday Details
        </Typography>
        <Chip
          label={`ID: ${holiday?.id || 'N/A'}`}
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
          {/* Holiday Name */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <CelebrationIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                HOLIDAY NAME
              </Typography>
            </Stack>
            <Box sx={{ ml: 3.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: COLORS.text.primary
              }}>
                {holiday?.name || 'N/A'}
              </Typography>
              <Chip 
                label={status.label} 
                size="small" 
                sx={{ 
                  height: 22,
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  bgcolor: status.bg, 
                  color: status.color 
                }} 
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Date Range */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  START DATE
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {formatDate(holiday?.start_date)}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                  END DATE
                </Typography>
              </Stack>
              <Typography sx={{ 
                fontSize: '0.7rem', 
                color: COLORS.text.secondary,
                ml: 3.5
              }}>
                {formatDate(holiday?.end_date)}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Note / Notification Message */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <DescriptionIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                NOTE / NOTIFICATION MESSAGE
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              color: COLORS.text.secondary,
              ml: 3.5,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {holiday?.note || 'No notes added'}
            </Typography>
          </Box>

          {/* Optional: Display Status if needed */}
          {holiday?.status && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    STATUS
                  </Typography>
                </Stack>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  color: COLORS.text.secondary,
                  ml: 3.5,
                  lineHeight: 1.5
                }}>
                  {holiday?.status || 'N/A'}
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

export default ViewHoliday;