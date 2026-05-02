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
  CircularProgress,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Edit as EditIcon } from '@mui/icons-material';
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

const EditBatch = ({ open, onClose, batch, onUpdate }) => {
  const [domains, setDomains] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain_id: '',
    start_date: null,
    end_date: null,
    start_time: null,
    end_time: null,
    strength: '',
    trainer_name: '',
    latitude: '',
    longitude: '',
    radius: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load domains and trainers from API when dialog opens
  useEffect(() => {
    if (open) {
      loadDomainsFromAPI();
      loadTrainersFromAPI();
    }
  }, [open]);

  const loadDomainsFromAPI = async () => {
    setLoadingDomains(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/domains`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: 100
        }
      });

      if (response.data && response.data.data) {
        const transformedDomains = response.data.data.map(domain => ({
          id: domain.id,
          name: domain.name,
          description: domain.description
        }));
        setDomains(transformedDomains);
      } else {
        setDomains([]);
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      setError('Failed to load domains. Please refresh and try again.');
    } finally {
      setLoadingDomains(false);
    }
  };

  const loadTrainersFromAPI = async () => {
    setLoadingTrainers(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/trainers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: 100
        }
      });

      if (response.data && response.data.data) {
        const transformedTrainers = response.data.data.map(trainer => ({
          id: trainer.id,
          name: trainer.name,
          mobile: trainer.mobile,
          email: trainer.email
        }));
        setTrainers(transformedTrainers);
      } else {
        setTrainers([]);
      }
    } catch (error) {
      console.error('Error loading trainers:', error);
      setError('Failed to load trainers. Please refresh and try again.');
    } finally {
      setLoadingTrainers(false);
    }
  };

  // Populate form when batch data is available
  useEffect(() => {
    if (batch && domains.length > 0) {
      console.log('Batch data received in EditBatch:', batch);
      
      // Handle both camelCase (from parent transform) and snake_case (raw API) formats
      const batchName = batch.name || batch.batchName || '';
      const domainId = batch.domainId || batch.domain_id;
      const startDate = batch.startDate || batch.start_date;
      const endDate = batch.endDate || batch.end_date;
      let startTime = batch.startTime || batch.start_time || '';
      let endTime = batch.endTime || batch.end_time || '';
      const strength = batch.strength || '';
      const trainerName = batch.trainer || batch.trainer_name || '';
      const latitude = batch.latitude || '';
      const longitude = batch.longitude || '';
      const radius = batch.radius || '';
      
      // Parse time strings to dayjs objects
      let startTimeObj = null;
      let endTimeObj = null;
      
      if (startTime) {
        // Remove seconds if present (e.g., "15:30:00" -> "15:30")
        if (startTime.includes(':')) {
          const parts = startTime.split(':');
          const timeStr = `${parts[0]}:${parts[1]}`;
          startTimeObj = dayjs(timeStr, 'HH:mm');
        }
      }
      
      if (endTime) {
        if (endTime.includes(':')) {
          const parts = endTime.split(':');
          const timeStr = `${parts[0]}:${parts[1]}`;
          endTimeObj = dayjs(timeStr, 'HH:mm');
        }
      }
      
      setFormData({
        name: batchName,
        domain_id: domainId || '',
        start_date: startDate ? dayjs(startDate) : null,
        end_date: endDate ? dayjs(endDate) : null,
        start_time: startTimeObj,
        end_time: endTimeObj,
        strength: strength?.toString() || '',
        trainer_name: trainerName || '',
        latitude: latitude?.toString() || '',
        longitude: longitude?.toString() || '',
        radius: radius?.toString() || ''
      });
      
      // Find and set selected domain
      if (domainId) {
        const foundDomain = domains.find(d => d.id === parseInt(domainId));
        setSelectedDomain(foundDomain || null);
      }
      
      // Find and set selected trainer (only if trainers are loaded)
      if (trainerName && trainers.length > 0) {
        const foundTrainer = trainers.find(t => t.name === trainerName);
        setSelectedTrainer(foundTrainer || null);
      }
    }
  }, [batch, domains, trainers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'strength') {
      const processedValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    } else if (name === 'radius') {
      const processedValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    } else if (name === 'latitude' || name === 'longitude') {
      const processedValue = value.replace(/[^\d.-]/g, '');
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDomainChange = (event, newValue) => {
    setSelectedDomain(newValue);
    setFieldErrors(prev => ({ ...prev, domain_id: '' }));
    setFormData(prev => ({ 
      ...prev, 
      domain_id: newValue ? newValue.id : ''
    }));
    // DO NOT auto-set batch name from domain
  };

  const handleTrainerChange = (event, newValue) => {
    setSelectedTrainer(newValue);
    setFieldErrors(prev => ({ ...prev, trainer_name: '' }));
    setFormData(prev => ({ 
      ...prev, 
      trainer_name: newValue ? newValue.name : '' 
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      errors.name = 'Batch name is required';
      isValid = false;
    }

    if (!formData.domain_id) {
      errors.domain_id = 'Domain name is required';
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

    if (!formData.start_time) {
      errors.start_time = 'Start time is required';
      isValid = false;
    }

    if (!formData.end_time) {
      errors.end_time = 'End time is required';
      isValid = false;
    }

    if (formData.start_time && formData.end_time) {
      const startTimeStr = formData.start_time.format('HH:mm');
      const endTimeStr = formData.end_time.format('HH:mm');
      if (startTimeStr >= endTimeStr) {
        errors.end_time = 'End time must be after start time';
        isValid = false;
      }
    }

    if (!formData.strength) {
      errors.strength = 'Strength is required';
      isValid = false;
    } else if (parseInt(formData.strength) <= 0) {
      errors.strength = 'Strength must be greater than 0';
      isValid = false;
    }

    if (!formData.trainer_name?.trim()) {
      errors.trainer_name = 'Trainer name is required';
      isValid = false;
    }

    // Validate radius if provided
    if (formData.radius && (parseInt(formData.radius) <= 0 || parseInt(formData.radius) > 1000)) {
      errors.radius = 'Radius must be between 1 and 1000 meters';
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
        domain_id: parseInt(formData.domain_id),
        start_date: formData.start_date.format('YYYY-MM-DD'),
        end_date: formData.end_date.format('YYYY-MM-DD'),
        start_time: formData.start_time.format('HH:mm'),
        end_time: formData.end_time.format('HH:mm'),
        strength: parseInt(formData.strength),
        trainer_name: formData.trainer_name.trim()
      };

      // Add location fields only if they have values
      if (formData.latitude && formData.latitude.trim() !== '') {
        payload.latitude = parseFloat(formData.latitude);
      }
      if (formData.longitude && formData.longitude.trim() !== '') {
        payload.longitude = parseFloat(formData.longitude);
      }
      if (formData.radius && formData.radius.trim() !== '') {
        payload.radius = parseInt(formData.radius);
      }

      console.log('Update payload:', payload);

      const response = await axios.put(`${BASE_URL}/batches/${batch.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.data) {
        onUpdate(response.data.data);
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating batch:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update batch. Please try again.';
      setError(errorMessage);
      
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

  const handleClose = () => {
    setFieldErrors({});
    setError('');
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

  const numberFieldSx = {
    ...textFieldSx,
    '& input[type=number]': { MozAppearance: 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0
    }
  };

  // Custom clock dialog styles to make it circular
  const clockDialogSx = {
    '& .MuiPickersClock-clock': {
      backgroundColor: '#f5f5f5',
      borderRadius: '50%',
      width: 260,
      height: 260
    },
    '& .MuiPickersClockPointer-pointer': {
      backgroundColor: COLORS.accent
    },
    '& .MuiPickersClockPointer-thumb': {
      backgroundColor: COLORS.accent,
      borderColor: COLORS.accent
    },
    '& .MuiPickersClockNumber-root': {
      fontSize: '0.875rem'
    },
    '& .MuiPickersClockNumber-root.Mui-selected': {
      backgroundColor: COLORS.accent,
      color: 'white'
    },
    '& .MuiDialogActions-root': {
      padding: '16px'
    },
    '& .MuiButton-text': {
      color: COLORS.accent
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
            Edit Batch
          </Typography>
          {batch?.id && (
            <Chip 
              label={`ID: ${batch.id}`} 
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
            <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5, letterSpacing: '0.5px' }}>
                Batch Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      BATCH NAME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Java Batch 2024, Python Spring Batch"
                      error={!!fieldErrors.name}
                      helperText={fieldErrors.name}
                      sx={textFieldSx}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      DOMAIN NAME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={domains}
                      loading={loadingDomains}
                      value={selectedDomain}
                      onChange={handleDomainChange}
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      disabled={loading}
                      renderInput={(params) => {
                        const { InputLabelProps, InputProps, ...rest } = params;
                        return (
                          <TextField
                            {...rest}
                            size="small"
                            placeholder={loadingDomains ? 'Loading domains...' : 'Search and select domain'}
                            error={!!fieldErrors.domain_id}
                            helperText={fieldErrors.domain_id}
                            sx={textFieldSx}
                            InputProps={{
                              ...InputProps,
                              endAdornment: (
                                <>
                                  {loadingDomains && <CircularProgress color="inherit" size={16} />}
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
                            {option.description && (
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                {option.description}
                              </Typography>
                            )}
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
                      noOptionsText="No domains found"
                    />
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

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      START TIME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <MobileTimePicker
                      value={formData.start_time}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, start_time: newValue }));
                        setFieldErrors(prev => ({ ...prev, start_time: '' }));
                      }}
                      views={['hours', 'minutes']}
                      format="HH:mm"
                      ampm={false}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldErrors.start_time,
                          helperText: fieldErrors.start_time,
                          sx: textFieldSx,
                          fullWidth: true,
                          placeholder: 'Select start time',
                          onClick: (e) => e.stopPropagation()
                        },
                        dialog: {
                          sx: clockDialogSx
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      END TIME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <MobileTimePicker
                      value={formData.end_time}
                      onChange={(newValue) => {
                        setFormData(prev => ({ ...prev, end_time: newValue }));
                        setFieldErrors(prev => ({ ...prev, end_time: '' }));
                      }}
                      views={['hours', 'minutes']}
                      format="HH:mm"
                      ampm={false}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldErrors.end_time,
                          helperText: fieldErrors.end_time,
                          sx: textFieldSx,
                          fullWidth: true,
                          placeholder: 'Select end time',
                          onClick: (e) => e.stopPropagation()
                        },
                        dialog: {
                          sx: clockDialogSx
                        }
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      STRENGTH <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="strength"
                      type="number"
                      value={formData.strength}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 30"
                      error={!!fieldErrors.strength}
                      helperText={fieldErrors.strength}
                      inputProps={{ min: 1 }}
                      sx={numberFieldSx}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      TRAINER NAME <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={trainers}
                      loading={loadingTrainers}
                      value={selectedTrainer}
                      onChange={handleTrainerChange}
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      disabled={loading}
                      renderInput={(params) => {
                        const { InputLabelProps, InputProps, ...rest } = params;
                        return (
                          <TextField
                            {...rest}
                            size="small"
                            placeholder={loadingTrainers ? 'Loading trainers...' : 'Search and select trainer'}
                            error={!!fieldErrors.trainer_name}
                            helperText={fieldErrors.trainer_name}
                            sx={textFieldSx}
                            InputProps={{
                              ...InputProps,
                              endAdornment: (
                                <>
                                  {loadingTrainers && <CircularProgress color="inherit" size={16} />}
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
                              {option.mobile} {option.email && `| ${option.email}`}
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
                      noOptionsText="No trainers found"
                    />
                  </Box>
                </Grid>

                {/* Location Fields */}
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1, mt: 1 }}>
                    Location Settings (Optional)
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LATITUDE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 20.005094"
                      error={!!fieldErrors.latitude}
                      helperText={fieldErrors.latitude}
                      sx={textFieldSx}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      LONGITUDE
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 73.774546"
                      error={!!fieldErrors.longitude}
                      helperText={fieldErrors.longitude}
                      sx={textFieldSx}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                      RADIUS (meters)
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="radius"
                      type="number"
                      value={formData.radius}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., 100"
                      error={!!fieldErrors.radius}
                      helperText={fieldErrors.radius || '1-1000 meters'}
                      inputProps={{ min: 1, max: 1000 }}
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

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={loading} 
            startIcon={loading ? <CircularProgress size={16} /> : <EditIcon />}
          >
            {loading ? 'Updating...' : 'Update Batch'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditBatch;