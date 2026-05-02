import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';

const COLORS = {
  primary: '#063C3F',
  text: {
    primary: '#151C26',
    secondary: '#4B5568'
  },
  border: '#E3E8EF'
};

const DeleteRole = ({ open, onClose, role, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      onDelete(role.id);
      setLoading(false);
      onClose();
    }, 500);
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
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WarningIcon sx={{ color: '#EF4444' }} />
        <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
          Delete Role
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <DeleteIcon sx={{ fontSize: 48, color: '#EF4444', mb: 2 }} />
          <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.primary, mb: 1 }}>
            Are you sure you want to delete the role?
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
            <strong>"{role?.RoleName}"</strong> will be permanently removed.
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#EF4444', mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2.5, 
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`, 
        bgcolor: COLORS.background?.white || '#FFFFFF',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{
            height: 36,
            px: 2,
            borderRadius: 1.5,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.secondary,
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 36,
            px: 2,
            borderRadius: 1.5,
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none'
          }}
        >
          {loading ? 'Deleting...' : 'Delete Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRole;