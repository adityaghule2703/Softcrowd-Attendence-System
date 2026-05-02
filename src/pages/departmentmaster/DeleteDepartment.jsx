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

const DeleteDepartment = ({ open, onClose, department, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDepartmentInitials = (name) => {
    if (!name) return 'D';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleDelete = async () => {
    if (!department?.id) {
      setError('Invalid department data');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/departments/${department.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if delete was successful (status 200, 201, 204)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        // Call the onDelete callback with the department ID
        onDelete(department.id);
        onClose();
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (err) {
      console.error('Error deleting department:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          'Failed to delete department. Please try again.';
      setError(errorMessage);
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
        mb: 2,
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
              {getDepartmentInitials(department?.departmentName)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600} color={COLORS.text.primary}>
                {department?.departmentName}
              </Typography>
              <Typography variant="body2" color={COLORS.text.secondary}>
                {department?.collegeName}
              </Typography>
            </Box>
          </Stack>
          
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Coordinator:</strong> {department?.coordinatorName}
            </Typography>
            <Typography variant="body2">
              <strong>Contact:</strong> {department?.coordinatorContact}
            </Typography>
            {department?.coordinatorEmail && (
              <Typography variant="body2">
                <strong>Email:</strong> {department?.coordinatorEmail}
              </Typography>
            )}
          </Stack>
        </Stack>
        
        <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Are you sure you want to delete this department?
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.error }}>
          ⚠️ This action cannot be undone. All department records will be permanently deleted.
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
          {loading ? 'Deleting...' : 'Delete Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDepartment;