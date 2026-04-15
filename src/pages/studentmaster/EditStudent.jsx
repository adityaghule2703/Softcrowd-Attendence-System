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
import { Edit as EditIcon } from '@mui/icons-material';

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

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const EditStudent = ({ open, onClose, student, onUpdate }) => {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    collegeName: '',
    departmentName: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load data from localStorage
  useEffect(() => {
    if (open) {
      loadColleges();
      loadDepartments();
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

  const loadDepartments = () => {
    setLoadingDepartments(true);
    try {
      const storedDepartments = localStorage.getItem('departments');
      if (storedDepartments) {
        const parsedDepartments = JSON.parse(storedDepartments);
        setDepartments(parsedDepartments);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    if (student && colleges.length > 0 && departments.length > 0) {
      setFormData({
        name: student.name || '',
        mobile: student.mobile || '',
        collegeName: student.collegeName || '',
        departmentName: student.departmentName || '',
        password: ''
      });
      
      const foundCollege = colleges.find(c => c.name === student.collegeName);
      setSelectedCollege(foundCollege || null);
      
      const foundDepartment = departments.find(d => d.departmentName === student.departmentName && d.collegeName === student.collegeName);
      setSelectedDepartment(foundDepartment || null);
    }
  }, [student, colleges, departments]);

  // Filter departments based on selected college
  const getFilteredDepartments = () => {
    if (!selectedCollege) return departments;
    return departments.filter(dept => dept.collegeName === selectedCollege.name);
  };

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
    setSelectedDepartment(null);
    setFieldErrors(prev => ({ ...prev, collegeName: '', departmentName: '' }));
    setFormData(prev => ({ 
      ...prev, 
      collegeName: newValue ? newValue.name : '',
      departmentName: ''
    }));
  };

  const handleDepartmentChange = (event, newValue) => {
    setSelectedDepartment(newValue);
    setFieldErrors(prev => ({ ...prev, departmentName: '' }));
    setFormData(prev => ({ 
      ...prev, 
      departmentName: newValue ? newValue.departmentName : ''
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

    if (!formData.collegeName?.trim()) {
      errors.collegeName = 'College name is required';
      isValid = false;
    }

    if (!formData.departmentName?.trim()) {
      errors.departmentName = 'Department name is required';
      isValid = false;
    }

    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      const updateData = { ...formData, id: student.id };
      if (!updateData.password) {
        delete updateData.password;
      }
      onUpdate(updateData);
      onClose();
    } catch (err) {
      setError('Failed to update student. Please try again.');
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
          Edit Student
        </Typography>
        {student?.id && (
          <Chip
            label={`ID: ${student.id}`}
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
                  <Autocomplete
                    fullWidth
                    options={getFilteredDepartments()}
                    loading={loadingDepartments}
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                    getOptionLabel={(option) => option.departmentName || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={loading || !selectedCollege}
                    renderInput={(params) => {
                      const { InputLabelProps, InputProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          placeholder={!selectedCollege ? 'Please select college first' : (loadingDepartments ? 'Loading departments...' : 'Search and select department')}
                          error={!!fieldErrors.departmentName}
                          helperText={fieldErrors.departmentName}
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
                            {option.departmentName}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            Coordinator: {option.coordinatorName} | Contact: {option.coordinatorContact}
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
                    PASSWORD (Leave blank to keep current)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter new password"
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
          {loading ? 'Updating...' : 'Update Student'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;