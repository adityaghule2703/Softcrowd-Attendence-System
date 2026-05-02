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
import { Calendar } from 'lucide-react';
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

const DeleteHoliday = ({ open, onClose, holiday, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getHolidayInitials = (name) => {
    if (!name) return 'H';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = async () => {
    if (!holiday?.id) {
      setError('Invalid holiday data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/holidays/${holiday.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if delete was successful (status 200, 201, 204)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        // Call the onDelete callback with the holiday ID
        onDelete(holiday.id);
        onClose();
      } else {
        throw new Error('Failed to delete holiday');
      }
    } catch (err) {
      console.error('Error deleting holiday:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Failed to delete holiday. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2,mb: 2, backgroundColor: COLORS.background.light }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
          Confirm Delete
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 60, height: 60, bgcolor: COLORS.accent, fontSize: '1.25rem' }}>
              {getHolidayInitials(holiday?.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} color={COLORS.text.primary}>
                {holiday?.name}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Calendar size={12} />
                {formatDate(holiday?.startDate)} - {formatDate(holiday?.endDate)}
              </Typography>
            </Box>
          </Stack>
          
          {holiday?.note && (
            <Typography variant="body2" sx={{ color: COLORS.text.secondary, fontStyle: 'italic' }}>
              Note: {holiday.note}
            </Typography>
          )}
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Are you sure you want to delete this holiday?
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.error }}>
          ⚠️ This action cannot be undone. All holiday records will be permanently deleted.
        </Typography>
        
        {error && <Alert severity="error" sx={{ mt: 3, borderRadius: 1 }}>{error}</Alert>}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2, backgroundColor: COLORS.background.light }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete} 
          disabled={loading} 
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {loading ? 'Deleting...' : 'Delete Holiday'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteHoliday;