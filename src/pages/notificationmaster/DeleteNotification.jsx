// DeleteNotification.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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
  error: '#EF4444'
};

const DeleteNotification = ({ open, onClose, notification, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/admin/notifications/${notification.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      onDelete(notification.id);
      onClose();
    } catch (err) {
      console.error('Error deleting notification:', err);
      
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to delete notification. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <DeleteIcon sx={{ fontSize: '1.25rem', color: COLORS.error }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Delete Notification
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2} alignItems="center">
          <WarningIcon sx={{ fontSize: 48, color: COLORS.error }} />
          
          <Typography sx={{ 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            color: COLORS.text.primary,
            textAlign: 'center'
          }}>
            Are you sure you want to delete this notification?
          </Typography>
          
          <Typography sx={{ 
            fontSize: '0.75rem', 
            color: COLORS.text.secondary,
            textAlign: 'center'
          }}>
            This action cannot be undone. The notification will be permanently removed.
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5,
                width: '100%'
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ 
            p: 1.5, 
            bgcolor: COLORS.background.light, 
            borderRadius: 1.5,
            width: '100%',
            border: `1px solid ${COLORS.border}`
          }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                Notification to be deleted:
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                {notification?.title}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, lineHeight: 1.4 }}>
                {notification?.message?.length > 100 
                  ? `${notification.message.substring(0, 100)}...` 
                  : notification?.message}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          size="small"
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
              borderColor: COLORS.accent,
              bgcolor: `${COLORS.accent}10`
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          size="small"
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.error,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: '#DC2626',
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Notification'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNotification;