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
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

// Color constants
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

const DeleteCollege = ({ open, onClose, college, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCollegeInitials = (name) => {
    if (!name) return 'C';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleDelete = async () => {
    if (!college?.id) return;

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDelete(college.id);
      onClose();
    } catch (err) {
      setError('Failed to delete college. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        pb: 2,
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
              fontSize: '1.25rem'
            }}>
              {getCollegeInitials(college?.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} color={COLORS.text.primary}>
                {college?.name}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary}>
                {college?.city}, {college?.state}
              </Typography>
            </Box>
          </Stack>
          
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Address:</strong> {college?.address}
            </Typography>
            <Typography variant="body2">
              <strong>Contact:</strong> {college?.contact}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {college?.email || '-'}
            </Typography>
          </Stack>
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Are you sure you want to delete this college?
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.error }}>
          ⚠️ This action cannot be undone. All college records will be permanently deleted.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 1 }}>
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
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? null : <DeleteIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: COLORS.error,
            '&:hover': {
              backgroundColor: '#DC2626'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete College'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCollege;