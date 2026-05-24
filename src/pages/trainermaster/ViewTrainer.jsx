import React, { useEffect } from 'react';
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
  Divider,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon
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

const ViewTrainer = ({ open, onClose, trainer, onEdit }) => {
  // Debug log
  useEffect(() => {
    if (open && trainer) {
      console.log('========== TRAINER DATA RECEIVED ==========');
      console.log('Full trainer object:', trainer);
      console.log('Trainer name:', trainer.name);
      console.log('Trainer mobile:', trainer.mobile);
      console.log('Trainer email:', trainer.email);
      console.log('Trainer address:', trainer.address);
      console.log('==========================================');
    }
  }, [open, trainer]);

  if (!trainer) return null;

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

  // Get trainer initials
  const getTrainerInitials = (name) => {
    if (!name) return 'T';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
          Trainer Details
        </Typography>
        <Chip
          label={`ID: ${trainer?.id || 'N/A'}`}
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
          {/* Trainer Name with Avatar */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Avatar 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: COLORS.accent,
                  fontSize: '1.3rem',
                  fontWeight: 600
                }}
              >
                {getTrainerInitials(trainer.name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: COLORS.text.primary
                }}>
                  {trainer?.name || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Personal Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                PERSONAL INFORMATION
              </Typography>
            </Stack>
            
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <BadgeIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    TRAINER ID
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {trainer?.id || 'N/A'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <PhoneIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    MOBILE NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {trainer?.mobile || 'N/A'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <EmailIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    EMAIL ADDRESS
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {trainer?.email || 'Not provided'}
                  </Typography>
                </Box>
              </Stack>

              {trainer?.address && (
                <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ ml: 3.5 }}>
                  <LocationIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary, mt: 0.2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                      ADDRESS
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, whiteSpace: 'pre-wrap' }}>
                      {trainer.address}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Assigned Batches Section */}
          {trainer.batches && trainer.batches.length > 0 && (
            <>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <PersonIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    ASSIGNED BATCHES ({trainer.batches.length})
                  </Typography>
                </Stack>

                <Stack spacing={1} sx={{ ml: 3.5 }}>
                  {trainer.batches.map((batch) => (
                    <Chip
                      key={batch.id}
                      label={batch.name}
                      size="small"
                      sx={{
                        bgcolor: COLORS.background.light,
                        color: COLORS.text.primary,
                        fontSize: '0.7rem',
                        height: 28,
                        justifyContent: 'flex-start',
                        width: '100%',
                        '& .MuiChip-label': {
                          px: 1.5,
                          width: '100%'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ borderColor: COLORS.border }} />
            </>
          )}

          {/* Metadata Information */}
          {(trainer.createdAt || trainer.updatedAt) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {trainer.createdAt && (
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
                    {formatDate(trainer.createdAt)}
                  </Typography>
                </Box>
              )}

              {trainer.updatedAt && (
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
                    {formatDate(trainer.updatedAt)}
                  </Typography>
                </Box>
              )}
            </Stack>
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

export default ViewTrainer;