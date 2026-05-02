import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

const DeleteDomain = ({ open, onClose, domain, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!domain?.id) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/domains/${domain.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Check if response is successful (status 200-299)
      if (response.status === 200 || response.status === 204) {
        onDelete(domain.id);
        onClose();
      } else {
        setError(response.data?.message || 'Failed to delete domain');
      }
    } catch (err) {
      console.error('Error deleting domain:', err);
      setError(err.response?.data?.message || 'Failed to delete domain. Please try again.');
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
        borderBottom: '1px solid #E0E0E0', 
        pb: 2,
        backgroundColor: '#F8FAFC',
        pt: 3,
        px: 3
      }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#101010'
        }}>
          Confirm Delete
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 4,
        px: 3,
        pb: 2
      }}>
        <div>
          <Typography variant="body1" sx={{ mb: 2, fontSize: '0.875rem' }}>
            Are you sure you want to delete the domain <strong>"{domain?.domainName}"</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
            This action cannot be undone.
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3,
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}
        </div>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        pb: 3, 
        pt: 2,
        borderTop: '1px solid #E0E0E0',
        backgroundColor: '#F8FAFC'
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
            backgroundColor: '#D32F2F',
            '&:hover': {
              backgroundColor: '#C62828'
            }
          }}
        >
          {loading ? 'Deleting...' : 'Delete Domain'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDomain;