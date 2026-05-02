import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Stack,
  Avatar,
  Box,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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

const DeleteBatch = ({ open, onClose, batch, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getBatchInitials = (name) => {
    if (!name) return 'B';
    return name.substring(0, 2).toUpperCase();
  };

  // Format time (remove seconds if present)
  const formatTime = (time) => {
    if (!time) return '-';
    if (time.includes(':')) {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  const handleDelete = async () => {
    if (!batch?.id) {
      setError('Invalid batch data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/batches/${batch.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if delete was successful (status 200, 201, 204)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        // Call the onDelete callback with the batch ID
        onDelete(batch.id);
        onClose();
      } else {
        throw new Error('Failed to delete batch');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Failed to delete batch. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get display values (handle both camelCase and snake_case)
  const domainName = batch?.domainName || batch?.domain?.name || 'Unknown Domain';
  const startTime = batch?.startTime || batch?.start_time;
  const endTime = batch?.endTime || batch?.end_time;
  const strength = batch?.strength;
  const trainerName = batch?.trainer || batch?.trainer_name;

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
        pb: 2, 
        mb:2,
        backgroundColor: COLORS.background.light
      }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
          Confirm Delete
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              bgcolor: COLORS.accent, 
              fontSize: '1.25rem',
              fontWeight: 600
            }}>
              {getBatchInitials(domainName)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} color={COLORS.text.primary}>
                {domainName}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary}>
                ⏰ {formatTime(startTime)} - {formatTime(endTime)}
              </Typography>
            </Box>
          </Stack>
          
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Strength:</strong> {strength} students
            </Typography>
            {trainerName && (
              <Typography variant="body2">
                <strong>Trainer:</strong> {trainerName}
              </Typography>
            )}
            {(batch?.start_date || batch?.startDate) && (
              <Typography variant="body2">
                <strong>Duration:</strong> {batch?.start_date || batch?.startDate} to {batch?.end_date || batch?.endDate}
              </Typography>
            )}
          </Stack>
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Are you sure you want to delete this batch?
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.error }}>
          ⚠️ This action cannot be undone. All batch records and associated student assignments will be permanently deleted.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 1.5, fontSize: '0.75rem' }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        borderTop: `1px solid ${COLORS.border}`, 
        pt: 2, 
        backgroundColor: COLORS.background.light
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
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
          color="error" 
          onClick={handleDelete} 
          disabled={loading} 
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          sx={{
            borderRadius: 1.5,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            backgroundColor: COLORS.error,
            '&:hover': {
              backgroundColor: '#DC2626'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Batch'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBatch;