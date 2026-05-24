// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   Chip,
//   Autocomplete,
//   CircularProgress,
//   MenuItem
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../config/Config';

// const COLORS = {
//   primary: '#0F172A',
//   primaryDark: '#0A0F1E',
//   accent: '#00AEED',
//   text: {
//     primary: '#1E293B',
//     secondary: '#64748B',
//     tertiary: '#94A3B8'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FAFC'
//   },
//   border: '#E2E8F0',
//   error: '#EF4444'
// };

// const AddHoliday = ({ open, onClose, onAdd }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     start_date: null,
//     end_date: null,
//     note: '',
//     status: 'active',
//     batch_ids: []
//   });
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [batches, setBatches] = useState([]);
//   const [batchesLoading, setBatchesLoading] = useState(false);

//   // Fetch all batches (no pagination)
//   const fetchAllBatches = useCallback(async () => {
//     setBatchesLoading(true);
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/batches`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (response.data && response.data.data) {
//         setBatches(response.data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching batches:', err);
//     } finally {
//       setBatchesLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (open) {
//       fetchAllBatches();
//     }
//   }, [open, fetchAllBatches]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleBatchChange = (event, value) => {
//     const selectedBatchIds = value.map(batch => batch.id);
//     setFormData(prev => ({ ...prev, batch_ids: selectedBatchIds }));
//     setFieldErrors(prev => ({ ...prev, batch_ids: '' }));
//   };

//   const validateAllFields = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.name?.trim()) {
//       errors.name = 'Holiday name is required';
//       isValid = false;
//     }

//     if (!formData.start_date) {
//       errors.start_date = 'Start date is required';
//       isValid = false;
//     }

//     if (!formData.end_date) {
//       errors.end_date = 'End date is required';
//       isValid = false;
//     }

//     if (formData.start_date && formData.end_date && formData.start_date.isAfter(formData.end_date)) {
//       errors.end_date = 'End date must be after start date';
//       isValid = false;
//     }

//     if (formData.batch_ids.length === 0) {
//       errors.batch_ids = 'Please select at least one batch';
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     if (!validateAllFields()) {
//       setError('Please fix all validation errors');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const payload = {
//         name: formData.name.trim(),
//         start_date: formData.start_date.format('YYYY-MM-DD'),
//         end_date: formData.end_date.format('YYYY-MM-DD'),
//         note: formData.note.trim() || null,
//         status: formData.status,
//         batch_ids: formData.batch_ids
//       };

//       const response = await axios.post(`${BASE_URL}/holidays`, payload, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data && response.data.data) {
//         onAdd(response.data.data);
//         resetForm();
//         onClose();
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error adding holiday:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to add holiday. Please try again.';
//       setError(errorMessage);
      
//       if (err.response?.data?.errors) {
//         const backendErrors = err.response.data.errors;
//         const newFieldErrors = {};
//         Object.keys(backendErrors).forEach(key => {
//           newFieldErrors[key] = backendErrors[key][0];
//         });
//         setFieldErrors(newFieldErrors);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       start_date: null,
//       end_date: null,
//       note: '',
//       status: 'active',
//       batch_ids: []
//     });
//     setFieldErrors({});
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   // Get selected batch objects for Autocomplete
//   const selectedBatches = batches.filter(batch => formData.batch_ids.includes(batch.id));

//   const textFieldSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 1.5,
//       fontSize: '0.75rem',
//       '&:hover fieldset': { borderColor: COLORS.accent },
//       '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 },
//       '&.Mui-error fieldset': { borderColor: COLORS.error }
//     },
//     '& .MuiInputBase-input': {
//       py: 1,
//       px: 1.5,
//       fontSize: '0.75rem',
//       color: COLORS.text.primary,
//       '&::placeholder': {
//         color: COLORS.text.tertiary,
//         fontSize: '0.75rem'
//       }
//     }
//   };

//   const selectSx = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: 1.5,
//       fontSize: '0.75rem',
//       '&:hover fieldset': { borderColor: COLORS.accent },
//       '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 },
//     },
//     '& .MuiSelect-select': {
//       py: 1,
//       px: 1.5,
//       fontSize: '0.75rem',
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, mb: 2, bgcolor: COLORS.background.white }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Add New Holiday
//           </Typography>
//         </DialogTitle>

//         <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//           <Stack spacing={2}>
//             <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5 }}>
//                 Holiday Information
//               </Typography>
              
//               <Grid container spacing={1.5}>
//                 <Grid size={{ xs: 12, sm: 8 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       HOLIDAY NAME <span style={{ color: COLORS.error }}>*</span>
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       disabled={loading}
//                       placeholder="e.g., Diwali, Christmas, New Year"
//                       error={!!fieldErrors.name}
//                       helperText={fieldErrors.name}
//                       sx={textFieldSx}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       STATUS
//                     </Typography>
//                     <TextField
//                       select
//                       fullWidth
//                       size="small"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleChange}
//                       disabled={loading}
//                       SelectProps={{
//                         sx: selectSx
//                       }}
//                     >
//                       <MenuItem value="active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
//                       <MenuItem value="inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
//                     </TextField>
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       START DATE <span style={{ color: COLORS.error }}>*</span>
//                     </Typography>
//                     <DatePicker
//                       value={formData.start_date}
//                       onChange={(newValue) => {
//                         setFormData(prev => ({ ...prev, start_date: newValue }));
//                         setFieldErrors(prev => ({ ...prev, start_date: '' }));
//                       }}
//                       slotProps={{
//                         textField: {
//                           size: 'small',
//                           error: !!fieldErrors.start_date,
//                           helperText: fieldErrors.start_date,
//                           sx: textFieldSx,
//                           fullWidth: true,
//                           placeholder: 'Select start date'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       END DATE <span style={{ color: COLORS.error }}>*</span>
//                     </Typography>
//                     <DatePicker
//                       value={formData.end_date}
//                       onChange={(newValue) => {
//                         setFormData(prev => ({ ...prev, end_date: newValue }));
//                         setFieldErrors(prev => ({ ...prev, end_date: '' }));
//                       }}
//                       slotProps={{
//                         textField: {
//                           size: 'small',
//                           error: !!fieldErrors.end_date,
//                           helperText: fieldErrors.end_date,
//                           sx: textFieldSx,
//                           fullWidth: true,
//                           placeholder: 'Select end date'
//                         }
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       SELECT BATCHES <span style={{ color: COLORS.error }}>*</span>
//                     </Typography>
//                     <Autocomplete
//                       multiple
//                       fullWidth
//                       options={batches}
//                       getOptionLabel={(option) => `${option.name}${option.trainer_name ? ` (Trainer: ${option.trainer_name})` : ''}`}
//                       value={selectedBatches}
//                       onChange={handleBatchChange}
//                       loading={batchesLoading}
//                       loadingText="Loading batches..."
//                       disableCloseOnSelect
//                       filterSelectedOptions
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           size="small"
//                           placeholder="Search and select batches..."
//                           error={!!fieldErrors.batch_ids}
//                           helperText={fieldErrors.batch_ids}
//                           sx={{
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: 1.5,
//                               fontSize: '0.75rem',
//                               '&:hover fieldset': { borderColor: COLORS.accent },
//                               '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 },
//                               '&.Mui-error fieldset': { borderColor: COLORS.error }
//                             },
//                             '& .MuiInputBase-input': {
//                               py: 1,
//                               px: 1.5,
//                               fontSize: '0.75rem',
//                               color: COLORS.text.primary,
//                               '&::placeholder': {
//                                 color: COLORS.text.tertiary,
//                                 fontSize: '0.75rem'
//                               }
//                             }
//                           }}
//                         />
//                       )}
//                       renderTags={(value, getTagProps) =>
//                         value.map((option, index) => (
//                           <Chip
//                             label={option.name}
//                             size="small"
//                             sx={{ fontSize: '0.7rem' }}
//                             {...getTagProps({ index })}
//                           />
//                         ))
//                       }
//                       renderOption={(props, option) => (
//                         <li {...props} style={{ fontSize: '0.75rem' }}>
//                           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                             <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
//                               {option.name}
//                             </Typography>
//                             {option.trainer_name && (
//                               <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                                 Trainer: {option.trainer_name}
//                               </Typography>
//                             )}
//                           </Box>
//                         </li>
//                       )}
//                       isOptionEqualToValue={(option, value) => option.id === value.id}
//                     />
//                   </Box>
//                 </Grid>

//                 <Grid size={{ xs: 12 }}>
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                       NOTE (Will be sent as notification)
//                     </Typography>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       name="note"
//                       value={formData.note}
//                       onChange={handleChange}
//                       multiline
//                       rows={3}
//                       disabled={loading}
//                       placeholder="Add any important notes about this holiday..."
//                       error={!!fieldErrors.note}
//                       helperText={fieldErrors.note}
//                       sx={textFieldSx}
//                     />
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       This note will be sent as a notification to all users in selected batches
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Paper>

//             {error && <Alert severity="error" sx={{ fontSize: '0.75rem' }}>{error}</Alert>}
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
//           <Button onClick={handleClose} disabled={loading} sx={{ fontSize: '0.75rem' }}>
//             Cancel
//           </Button>
//           <Button 
//             variant="contained" 
//             onClick={handleSubmit} 
//             disabled={loading} 
//             startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//             sx={{ fontSize: '0.75rem' }}
//           >
//             {loading ? 'Adding...' : 'Add Holiday'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// };

// export default AddHoliday;




import React, { useState, useEffect, useCallback } from 'react';
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
    status: 'active',
    batch_ids: []
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  // Fetch all batches (no pagination)
  const fetchAllBatches = useCallback(async () => {
    setBatchesLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.data) {
        setBatches(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setBatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchAllBatches();
    }
  }, [open, fetchAllBatches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBatchChange = (event, value) => {
    const selectedBatchIds = value.map(batch => batch.id);
    setFormData(prev => ({ ...prev, batch_ids: selectedBatchIds }));
    setFieldErrors(prev => ({ ...prev, batch_ids: '' }));
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

    if (formData.batch_ids.length === 0) {
      errors.batch_ids = 'Please select at least one batch';
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
        status: formData.status,
        batch_ids: formData.batch_ids
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
      
      // Extract error message - prioritize 'error' field over 'message'
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to add holiday. Please try again.';
      }
      
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

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: null,
      end_date: null,
      note: '',
      status: 'active',
      batch_ids: []
    });
    setFieldErrors({});
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get selected batch objects for Autocomplete
  const selectedBatches = batches.filter(batch => formData.batch_ids.includes(batch.id));

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
        <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5, mb: 2, bgcolor: COLORS.background.white }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
            Add New Holiday
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
          <Stack spacing={2}>
            {/* Error Alert at the top */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  py: 0.5,
                  mb: 1
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

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
                    <TextField
                      select
                      fullWidth
                      size="small"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                      SelectProps={{
                        sx: selectSx
                      }}
                    >
                      <MenuItem value="active" sx={{ fontSize: '0.75rem' }}>Active</MenuItem>
                      <MenuItem value="inactive" sx={{ fontSize: '0.75rem' }}>Inactive</MenuItem>
                    </TextField>
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
                      SELECT BATCHES <span style={{ color: COLORS.error }}>*</span>
                    </Typography>
                    <Autocomplete
                      multiple
                      fullWidth
                      options={batches}
                      getOptionLabel={(option) => `${option.name}${option.trainer_name ? ` (Trainer: ${option.trainer_name})` : ''}`}
                      value={selectedBatches}
                      onChange={handleBatchChange}
                      loading={batchesLoading}
                      loadingText="Loading batches..."
                      disableCloseOnSelect
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="Search and select batches..."
                          error={!!fieldErrors.batch_ids}
                          helperText={fieldErrors.batch_ids}
                          sx={{
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
                          }}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option.name}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderOption={(props, option) => (
                        <li {...props} style={{ fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {option.name}
                            </Typography>
                            {option.trainer_name && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Trainer: {option.trainer_name}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
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
                      This note will be sent as a notification to all users in selected batches
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
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
            {loading ? 'Adding...' : 'Add Holiday'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddHoliday;