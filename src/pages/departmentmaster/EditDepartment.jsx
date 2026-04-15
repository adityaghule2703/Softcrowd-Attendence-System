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
  Chip,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon
} from '@mui/icons-material';

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

const EditDepartment = ({ open, onClose, department, onUpdate }) => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [formData, setFormData] = useState({
    collegeName: '',
    departmentName: '',
    coordinatorName: '',
    coordinatorContact: '',
    coordinatorEmail: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load colleges from localStorage
  useEffect(() => {
    if (open) {
      loadColleges();
    }
  }, [open]);

  const loadColleges = () => {
    setLoadingColleges(true);
    try {
      const storedColleges = localStorage.getItem('colleges');
      if (storedColleges) {
        const parsedColleges = JSON.parse(storedColleges);
        setColleges(parsedColleges);
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
    } finally {
      setLoadingColleges(false);
    }
  };

  useEffect(() => {
    if (department && colleges.length > 0) {
      setFormData({
        collegeName: department.collegeName || '',
        departmentName: department.departmentName || '',
        coordinatorName: department.coordinatorName || '',
        coordinatorContact: department.coordinatorContact || '',
        coordinatorEmail: department.coordinatorEmail || ''
      });
      
      // Find and set selected college
      const foundCollege = colleges.find(c => c.name === department.collegeName);
      setSelectedCollege(foundCollege || null);
    }
  }, [department, colleges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    let processedValue = value;
    if (name === 'coordinatorContact') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleCollegeChange = (event, newValue) => {
    setSelectedCollege(newValue);
    setFieldErrors(prev => ({ ...prev, collegeName: '' }));
    setFormData(prev => ({ 
      ...prev, 
      collegeName: newValue ? newValue.name : '' 
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.collegeName?.trim()) {
      errors.collegeName = 'College name is required';
      isValid = false;
    }

    if (!formData.departmentName?.trim()) {
      errors.departmentName = 'Department name is required';
      isValid = false;
    }

    if (!formData.coordinatorName?.trim()) {
      errors.coordinatorName = 'Coordinator name is required';
      isValid = false;
    }

    if (!formData.coordinatorContact?.trim()) {
      errors.coordinatorContact = 'Coordinator contact is required';
      isValid = false;
    } else if (!validatePhone(formData.coordinatorContact)) {
      errors.coordinatorContact = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    if (formData.coordinatorEmail && !validateEmail(formData.coordinatorEmail)) {
      errors.coordinatorEmail = 'Please enter a valid email address';
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
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdate({ ...formData, id: department.id });
      onClose();
    } catch (err) {
      setError('Failed to update department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFieldErrors({});
    setError('');
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
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Department
        </Typography>
        {department?.id && (
          <Chip
            label={`ID: ${department.id}`}
            size="small"
            sx={{ 
              fontSize: '0.65rem',
              fontWeight: 500,
              height: 20,
              bgcolor: COLORS.background.light,
              color: COLORS.text.secondary
            }}
          />
        )}
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
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={loading}
                    renderInput={(params) => {
                      const { InputLabelProps, InputProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          placeholder={loadingColleges ? 'Loading colleges...' : 'Search and select college'}
                          error={!!fieldErrors.collegeName}
                          helperText={fieldErrors.collegeName}
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
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Computer Science, Mechanical, Civil"
                    error={!!fieldErrors.departmentName}
                    helperText={fieldErrors.departmentName}
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
                    name="coordinatorName"
                    value={formData.coordinatorName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., Dr. John Smith"
                    error={!!fieldErrors.coordinatorName}
                    helperText={fieldErrors.coordinatorName}
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
                    name="coordinatorContact"
                    value={formData.coordinatorContact}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 9876543210"
                    error={!!fieldErrors.coordinatorContact}
                    helperText={fieldErrors.coordinatorContact}
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
                    name="coordinatorEmail"
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="coordinator@college.edu"
                    error={!!fieldErrors.coordinatorEmail}
                    helperText={fieldErrors.coordinatorEmail}
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
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
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
          {loading ? 'Updating...' : 'Update Department'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDepartment;