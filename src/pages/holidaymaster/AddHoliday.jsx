import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

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
  border: '#E2E8F0',
  error: '#EF4444'
};

const AddHoliday = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: null,
    end_date: null,
    note: '',
    status: 'active'
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      errors.name = 'Holiday name is required';
      isValid = false;
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
      isValid = false;
    }

    if (!formData.end_date) {
      errors.end_date = 'End date is required';
      isValid = false;
    }

    if (formData.start_date && formData.end_date && formData.start_date.isAfter(formData.end_date)) {
      errors.end_date = 'End date must be after start date';
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
        name: formData.name.trim(),
        start_date: formData.start_date.format('YYYY-MM-DD'),
        end_date: formData.end_date.format('YYYY-MM-DD'),
        note: formData.note.trim() || null,
        status: formData.status
      };

      const response = await axios.post(`${BASE_URL}/holidays`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.data) {
        onAdd(response.data.data);
        resetForm();
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error adding holiday:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add holiday. Please try again.';
      setError(errorMessage);
      
      // Handle field-specific errors from backend
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const newFieldErrors = {};
        Object.keys(backendErrors).forEach(key => {
          newFieldErrors[key] = backendErrors[key][0];
        });
        setFieldErrors(newFieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: null,
      end_date: null,
      note: '',
      status: 'active'
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

  const selectSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
      fontSize: '0.75rem',
      '&:hover fieldset': { borderColor: COLORS.accent },
      '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 },
    },
    '& .MuiSelect-select': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5,mb: 2, bgcolor: COLORS.background.white }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add New Holiday
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5 }}>
                Holiday Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      HOLIDAY NAME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Diwali, Christmas, New Year"
                      error={!!fieldErrors.name}
                      helperText={fieldErrors.name}
                      sx={textFieldSx}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STATUS
                    </Typography>
                    <FormControl fullWidth size="small" sx={selectSx}>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      START DATE <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <DatePicker
                      value={formData.start_date}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, start_date: newValue }));
                        setFieldErrors(prev => ({ ...prev, start_date: '' }));
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldErrors.start_date,
                          helperText: fieldErrors.start_date,
                          sx: textFieldSx,
                          fullWidth: true,
                          placeholder: 'Select start date'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      END DATE <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <DatePicker
                      value={formData.end_date}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, end_date: newValue }));
                        setFieldErrors(prev => ({ ...prev, end_date: '' }));
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldErrors.end_date,
                          helperText: fieldErrors.end_date,
                          sx: textFieldSx,
                          fullWidth: true,
                          placeholder: 'Select end date'
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      NOTE (Will be sent as notification)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      disabled={loading}
                      placeholder="Add any important notes about this holiday..."
                      error={!!fieldErrors.note}
                      helperText={fieldErrors.note}
                      sx={textFieldSx}
                    />
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      This note will be sent as a notification to all users
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ fontSize: '0.75rem' }}>{error}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
          <Button onClick={handleClose} disabled={loading} sx={{ fontSize: '0.75rem' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={loading} 
            startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
            sx={{ fontSize: '0.75rem' }}
          >
            {loading ? 'Adding...' : 'Add Holiday'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddHoliday;