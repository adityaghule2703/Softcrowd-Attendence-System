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
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Color constants
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

// Company options (enum values) - Required dropdown options
const COMPANY_OPTIONS = [
  "Exilance Software",
  "Softcrowd Technology",
  "Codiant Solution"
];

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const AddStudent = ({ open, onClose, onAdd }) => {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    college_id: '',
    department_id: '',
    password: '',
    company_name: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load colleges from API when dialog opens
  useEffect(() => {
    if (open) {
      loadCollegesFromAPI();
      loadDepartmentsFromAPI();
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

  const loadDepartmentsFromAPI = async () => {
    setLoadingDepartments(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: 100 // Load all departments for dropdown
        }
      });

      if (response.data && response.data.data) {
        const transformedDepartments = response.data.data.map(dept => ({
          id: dept.id,
          department_name: dept.department_name,
          college_id: dept.college_id,
          coordinator_name: dept.coordinator_name,
          coordinator_contact: dept.coordinator_contact,
          coordinator_email: dept.coordinator_email
        }));
        setDepartments(transformedDepartments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      setError('Failed to load departments. Please refresh and try again.');
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Filter departments based on selected college
  useEffect(() => {
    if (selectedCollege) {
      const filtered = departments.filter(dept => dept.college_id === selectedCollege.id);
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
    // Reset selected department when college changes
    setSelectedDepartment(null);
    setFormData(prev => ({ ...prev, department_id: '' }));
  }, [selectedCollege, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    let processedValue = value;
    if (name === 'mobile') {
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

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    setFieldErrors(prev => ({ ...prev, department_id: '' }));
    setFormData(prev => ({ 
      ...prev, 
      department_id: newValue ? newValue.id : ''
    }));
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    setFieldErrors(prev => ({ ...prev, company_name: '' }));
    setFormData(prev => ({ 
      ...prev, 
      company_name: newValue || ''
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      errors.name = 'Student name is required';
      isValid = false;
    }

    if (!formData.mobile?.trim()) {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!validatePhone(formData.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    if (!formData.college_id) {
      errors.college_id = 'College name is required';
      isValid = false;
    }

    if (!formData.department_id) {
      errors.department_id = 'Department name is required';
      isValid = false;
    }

    if (!formData.password?.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Company name validation - required field
    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
      isValid = false;
    } else if (!COMPANY_OPTIONS.includes(formData.company_name)) {
      errors.company_name = 'Please select a valid company from the options';
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
        mobile: formData.mobile,
        college_id: formData.college_id,
        department_id: formData.department_id,
        password: formData.password,
        company_name: formData.company_name
      };

      const response = await axios.post(`${BASE_URL}/students`, payload, {
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
      console.error('Error adding student:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add student. Please try again.';
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
      mobile: '',
      college_id: '',
      department_id: '',
      password: '',
      company_name: ''
    });
    setSelectedCollege(null);
    setSelectedDepartment(null);
    setSelectedCompany(null);
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
          Add New Student
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
              Student Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    STUDENT NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., John Doe"
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    MOBILE NUMBER <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 9876543210"
                    error={!!fieldErrors.mobile}
                    helperText={fieldErrors.mobile}
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
                  <Autocomplete
                    fullWidth
                    options={filteredDepartments}
                    loading={loadingDepartments}
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    getOptionLabel={(option) => option?.department_name || ''}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    disabled={loading || !selectedCollege}
                    renderInput={(params) => {
                      const { InputLabelProps, InputProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          placeholder={!selectedCollege ? 'Please select college first' : (loadingDepartments ? 'Loading departments...' : 'Search and select department')}
                          error={!!fieldErrors.department_id}
                          helperText={fieldErrors.department_id}
                          sx={textFieldSx}
                          InputProps={{
                            ...InputProps,
                            endAdornment: (
                              <>
                                {loadingDepartments && <CircularProgress color="inherit" size={16} />}
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
                            {option.department_name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            Coordinator: {option.coordinator_name} | Contact: {option.coordinator_contact}
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
                    noOptionsText="No departments found for this college"
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COMPANY NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={COMPANY_OPTIONS}
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    disabled={loading}
                    disableClearable={false}
                    renderInput={(params) => {
                      const { InputLabelProps, InputProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          placeholder="Select company name"
                          error={!!fieldErrors.company_name}
                          helperText={fieldErrors.company_name}
                          sx={textFieldSx}
                        />
                      );
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                          {option}
                        </Typography>
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
                    noOptionsText="No company options available"
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PASSWORD <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter password"
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password || 'Minimum 6 characters'}
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
          {loading ? 'Adding...' : 'Add Student'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudent;