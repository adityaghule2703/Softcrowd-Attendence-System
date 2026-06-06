// BulkSendNotification.jsx - Send notifications to multiple batches
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Grid,
  Paper,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip
} from '@mui/material';
import { 
  Send as SendIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

const COLORS = {
  primary: '#0F172A',
  primaryLight: '#1E293B',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC',
    hover: '#F1F5F9'
  },
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981'
};

const BulkSendNotification = ({ open, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    batch_ids: [],
    title: '',
    message: '',
    send_push: true
  });
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  // Fetch batches for dropdown
  useEffect(() => {
    if (open) {
      fetchBatches();
    }
  }, [open]);

  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        setBatches(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches');
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'send_push' ? checked : value 
    }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBatchChange = (event, values) => {
    const batchIds = values.map(batch => batch.id);
    setFormData(prev => ({ ...prev, batch_ids: batchIds }));
    setFieldErrors(prev => ({ ...prev, batch_ids: '' }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (formData.batch_ids.length === 0) {
      errors.batch_ids = 'Please select at least one batch';
      isValid = false;
    }

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.message?.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      setError('Please fix all validation errors');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        batch_ids: formData.batch_ids,
        title: formData.title.trim(),
        message: formData.message.trim(),
        send_push: formData.send_push
      };

      const response = await axios.post(
        `${BASE_URL}/batches/bulk-notification`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status) {
        onSend(response.data.data);
        resetForm();
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error sending bulk notification:', err);
      
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to send notifications. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      batch_ids: [],
      title: '',
      message: '',
      send_push: true
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.accent },
      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 },
      '&.Mui-error fieldset': { borderColor: COLORS.error }
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
      color: COLORS.text.primary,
      '&::placeholder': {
        color: COLORS.text.tertiary,
        fontSize: '0.75rem'
      }
    }
  };

  const selectedBatches = batches.filter(b => formData.batch_ids.includes(b.id));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
        bgcolor: COLORS.background.white
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Bulk Send Notification
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mt: 0.5 }}>
          Send notifications to students across multiple batches
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <Paper sx={{ 
            p: 2, 
            bgcolor: COLORS.background.white, 
            borderRadius: 1.5, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: 'none'
          }}>
            <Typography sx={{ 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              color: COLORS.accent, 
              mb: 1.5 
            }}>
              Notification Details
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    SELECT BATCHES <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <Autocomplete
                    multiple
                    options={batches}
                    getOptionLabel={(option) => `${option.name} (Strength: ${option.strength})`}
                    loading={loadingBatches}
                    value={selectedBatches}
                    onChange={handleBatchChange}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search and select batches"
                        error={!!fieldErrors.batch_ids}
                        helperText={fieldErrors.batch_ids}
                        sx={textFieldSx}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.name}
                          size="small"
                          {...getTagProps({ index })}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))
                    }
                    sx={{ '& .MuiAutocomplete-endAdornment': { top: 'calc(50% - 14px)' } }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    TITLE <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Important Announcement, Exam Schedule Update"
                    error={!!fieldErrors.title}
                    helperText={fieldErrors.title}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    MESSAGE <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter your notification message here..."
                    error={!!fieldErrors.message}
                    helperText={fieldErrors.message}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="send_push"
                        checked={formData.send_push}
                        onChange={handleChange}
                        disabled={loading}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: COLORS.accent,
                            '&:hover': {
                              bgcolor: `${COLORS.accent}20`
                            }
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: COLORS.accent
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                        Send push notification to mobile devices
                      </Typography>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        justifyContent: 'flex-end'
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
          onClick={handleSubmit}
          disabled={loading}
          size="small"
          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            height: 32,
            px: 2,
            borderRadius: 1.5,
            bgcolor: COLORS.primary,
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: COLORS.primaryDark,
            }
          }}
        >
          {loading ? 'Sending...' : 'Send Notifications'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkSendNotification;