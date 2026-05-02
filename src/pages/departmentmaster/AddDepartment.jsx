import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Color constants
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

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validateEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const AddDepartment = ({ open, onClose, onAdd }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [formData, setFormData] = useState({
    college_id: '',
    department_name: '',
    coordinator_name: '',
    coordinator_contact: '',
    coordinator_email: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load colleges from API when dialog opens
  useEffect(() => {
    if (open) {
      loadCollegesFromAPI();
    }
  }, [open]);

  const loadCollegesFromAPI = async () => {
    setLoadingColleges(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/colleges`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: 100 // Load all colleges for dropdown
        }
      });

      if (response.data && response.data.data) {
        const transformedColleges = response.data.data.map(college => ({
          id: college.id,
          name: college.name,
          city: college.city,
          state: college.state,
          pincode: college.pincode,
          address: college.address
        }));
        setColleges(transformedColleges);
      } else {
        setColleges([]);
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
      setError('Failed to load colleges. Please refresh and try again.');
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    let processedValue = value;
    if (name === 'coordinator_contact') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleCollegeChange = (event, newValue) => {
    setSelectedCollege(newValue);
    setFieldErrors(prev => ({ ...prev, college_id: '' }));
    setFormData(prev => ({ 
      ...prev, 
      college_id: newValue ? newValue.id : '' 
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.college_id) {
      errors.college_id = 'College name is required';
      isValid = false;
    }

    if (!formData.department_name?.trim()) {
      errors.department_name = 'Department name is required';
      isValid = false;
    }

    if (!formData.coordinator_name?.trim()) {
      errors.coordinator_name = 'Coordinator name is required';
      isValid = false;
    }

    if (!formData.coordinator_contact?.trim()) {
      errors.coordinator_contact = 'Coordinator contact is required';
      isValid = false;
    } else if (!validatePhone(formData.coordinator_contact)) {
      errors.coordinator_contact = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    if (formData.coordinator_email && !validateEmail(formData.coordinator_email)) {
      errors.coordinator_email = 'Please enter a valid email address';
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
        college_id: formData.college_id,
        department_name: formData.department_name.trim(),
        coordinator_name: formData.coordinator_name.trim(),
        coordinator_contact: formData.coordinator_contact,
        coordinator_email: formData.coordinator_email.trim() || null
      };

      const response = await axios.post(`${BASE_URL}/departments`, payload, {
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
      console.error('Error adding department:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add department. Please try again.';
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
      college_id: '',
      department_name: '',
      coordinator_name: '',
      coordinator_contact: '',
      coordinator_email: ''
    });
    setSelectedCollege(null);
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // TextField styling
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

  const numberFieldSx = {
    ...textFieldSx,
    '& input[type=number]': { MozAppearance: 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0
    }
  };

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
          Add New Department
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
        <Stack spacing={2}>
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
              Department Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COLLEGE NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={colleges}
                    loading={loadingColleges}
                    value={selectedCollege}
                    onChange={handleCollegeChange}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    disabled={loading}
                    renderInput={(params) => {
                      const { InputLabelProps, InputProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          placeholder={loadingColleges ? 'Loading colleges...' : 'Search and select college'}
                          error={!!fieldErrors.college_id}
                          helperText={fieldErrors.college_id}
                          sx={textFieldSx}
                          InputProps={{
                            ...InputProps,
                            endAdornment: (
                              <>
                                {loadingColleges && <CircularProgress color="inherit" size={16} />}
                                {InputProps?.endAdornment}
                              </>
                            ),
                          }}
                        />
                      );
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                            {option.name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            {option.city}, {option.state} - {option.pincode}
                          </Typography>
                        </Box>
                      </li>
                    )}
                    ListboxProps={{
                      sx: {
                        '& .MuiAutocomplete-option': {
                          fontSize: '0.75rem',
                          py: 1,
                          px: 1.5
                        }
                      }
                    }}
                    noOptionsText="No colleges found"
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    DEPARTMENT NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="department_name"
                    value={formData.department_name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Computer Science, Mechanical, Civil"
                    error={!!fieldErrors.department_name}
                    helperText={fieldErrors.department_name}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COORDINATOR NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="coordinator_name"
                    value={formData.coordinator_name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Dr. John Smith"
                    error={!!fieldErrors.coordinator_name}
                    helperText={fieldErrors.coordinator_name}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COORDINATOR CONTACT <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="coordinator_contact"
                    value={formData.coordinator_contact}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 9876543210"
                    error={!!fieldErrors.coordinator_contact}
                    helperText={fieldErrors.coordinator_contact}
                    inputProps={{ maxLength: 10 }}
                    sx={numberFieldSx}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    10-digit mobile number
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COORDINATOR EMAIL (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="coordinator_email"
                    type="email"
                    value={formData.coordinator_email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="coordinator@college.edu"
                    error={!!fieldErrors.coordinator_email}
                    helperText={fieldErrors.coordinator_email}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: 1.5,
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}
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
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Adding...' : 'Add Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDepartment;