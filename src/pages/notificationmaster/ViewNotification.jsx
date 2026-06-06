// ViewNotification.jsx
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
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Article as ArticleIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Markunread as MarkunreadIcon,
  NotificationsActive as PushIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#0F172A',
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
  border: '#E2E8F0',
  success: '#10B981'
};

const ViewNotification = ({ open, onClose, notification }) => {
  if (!notification) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Notification Details
        </Typography>
        <Chip
          label={`ID: ${notification.id}`}
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
          {/* Title */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <NotificationsIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                TITLE
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: COLORS.text.primary,
              ml: 3.5
            }}>
              {notification.title}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Message */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <ArticleIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                MESSAGE
              </Typography>
            </Stack>
            <Typography sx={{ 
              fontSize: '0.75rem', 
              color: COLORS.text.secondary,
              ml: 3.5,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {notification.message}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Recipient Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <GroupIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                RECIPIENT INFORMATION
              </Typography>
            </Stack>
            
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    STUDENT NAME
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {notification.studentName}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <GroupIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    BATCH NAME
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {notification.batchName}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Status Information */}
          <Box>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                {notification.isRead ? (
                  <CheckCircleIcon sx={{ fontSize: '1rem', color: COLORS.success }} />
                ) : (
                  <MarkunreadIcon sx={{ fontSize: '1rem', color: COLORS.accent }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    STATUS
                  </Typography>
                  <Chip
                    label={notification.isRead ? 'Read' : 'Unread'}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      bgcolor: notification.isRead ? `${COLORS.success}10` : `${COLORS.accent}10`,
                      color: notification.isRead ? COLORS.success : COLORS.accent
                    }}
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    SENT AT
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                    {formatDate(notification.createdAt)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white
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

export default ViewNotification;