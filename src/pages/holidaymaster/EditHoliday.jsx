// import React, { useState, useEffect } from 'react';
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
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
//   Checkbox,
//   ListItemText,
//   CircularProgress
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { Edit as EditIcon } from '@mui/icons-material';
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

// const EditHoliday = ({ open, onClose, holiday, onUpdate }) => {
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

//   useEffect(() => {
//     if (holiday) {
//       // Extract batch IDs from the batches array in the holiday object
//       const batchIds = holiday.batches ? holiday.batches.map(batch => batch.id) : [];
      
//       setFormData({
//         name: holiday.name || '',
//         start_date: holiday.start_date ? dayjs(holiday.start_date) : null,
//         end_date: holiday.end_date ? dayjs(holiday.end_date) : null,
//         note: holiday.note || '',
//         status: holiday.status || 'active',
//         batch_ids: batchIds
//       });
//     }
//   }, [holiday]);

//   // Fetch all batches when dialog opens (no pagination)
//   useEffect(() => {
//     if (open) {
//       fetchAllBatches();
//     }
//   }, [open]);

//   const fetchAllBatches = async () => {
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
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleBatchChange = (event) => {
//     const { value } = event.target;
//     setFormData(prev => ({ ...prev, batch_ids: value }));
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

//       const response = await axios.put(`${BASE_URL}/holidays/${holiday.id}`, payload, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data && response.data.data) {
//         onUpdate(response.data.data);
//         onClose();
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error updating holiday:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to update holiday. Please try again.';
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

//   const handleClose = () => {
//     setFieldErrors({});
//     setError('');
//     onClose();
//   };

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

//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle sx={{ 
//           borderBottom: `1px solid ${COLORS.border}`, 
//           py: 1.5, 
//           px: 2.5, 
//           mb: 2,
//           bgcolor: COLORS.background.white, 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center' 
//         }}>
//           <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//             Edit Holiday
//           </Typography>
//           {holiday?.id && (
//             <Chip label={`ID: ${holiday.id}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
//           )}
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
//                     <FormControl fullWidth size="small" sx={selectSx}>
//                       <Select
//                         name="status"
//                         value={formData.status}
//                         onChange={handleChange}
//                         disabled={loading}
//                       >
//                         <MenuItem value="active">Active</MenuItem>
//                         <MenuItem value="inactive">Inactive</MenuItem>
//                       </Select>
//                     </FormControl>
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
//                           fullWidth: true
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
//                           fullWidth: true
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
//                     <FormControl fullWidth size="small" error={!!fieldErrors.batch_ids}>
//                       <InputLabel id="batch-select-label" sx={{ fontSize: '0.75rem' }}>
//                         Select Batches
//                       </InputLabel>
//                       <Select
//                         labelId="batch-select-label"
//                         multiple
//                         value={formData.batch_ids}
//                         onChange={handleBatchChange}
//                         input={<OutlinedInput label="Select Batches" />}
//                         renderValue={(selected) => (
//                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                             {selected.map((value) => {
//                               const batch = batches.find(b => b.id === value);
//                               return batch ? (
//                                 <Chip 
//                                   key={value} 
//                                   label={batch.name} 
//                                   size="small"
//                                   sx={{ fontSize: '0.7rem' }}
//                                 />
//                               ) : null;
//                             })}
//                           </Box>
//                         )}
//                         MenuProps={MenuProps}
//                         disabled={loading || batchesLoading}
//                         sx={selectSx}
//                       >
//                         {batchesLoading && batches.length === 0 ? (
//                           <MenuItem disabled>
//                             <CircularProgress size={20} /> Loading...
//                           </MenuItem>
//                         ) : (
//                           batches.map((batch) => (
//                             <MenuItem key={batch.id} value={batch.id}>
//                               <Checkbox checked={formData.batch_ids.indexOf(batch.id) > -1} />
//                               <ListItemText 
//                                 primary={batch.name} 
//                                 secondary={`Trainer: ${batch.trainer_name || 'Not assigned'}`}
//                                 sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }}
//                               />
//                             </MenuItem>
//                           ))
//                         )}
//                       </Select>
//                       {fieldErrors.batch_ids && (
//                         <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 0.5, ml: 1.5 }}>
//                           {fieldErrors.batch_ids}
//                         </Typography>
//                       )}
//                     </FormControl>
//                     <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                       Select one or more batches for this holiday
//                     </Typography>
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
//             startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
//             sx={{ fontSize: '0.75rem' }}
//           >
//             {loading ? 'Updating...' : 'Update Holiday'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </LocalizationProvider>
//   );
// };

// export default EditHoliday;


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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

const EditHoliday = ({ open, onClose, holiday, onUpdate }) => {
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

  useEffect(() => {
    if (holiday) {
      // Extract batch IDs from the batches array in the holiday object
      const batchIds = holiday.batches ? holiday.batches.map(batch => batch.id) : [];
      
      setFormData({
        name: holiday.name || '',
        start_date: holiday.start_date ? dayjs(holiday.start_date) : null,
        end_date: holiday.end_date ? dayjs(holiday.end_date) : null,
        note: holiday.note || '',
        status: holiday.status || 'active',
        batch_ids: batchIds
      });
    }
  }, [holiday]);

  // Fetch all batches when dialog opens (no pagination)
  useEffect(() => {
    if (open) {
      fetchAllBatches();
    }
  }, [open]);

  const fetchAllBatches = async () => {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBatchChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, batch_ids: value }));
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

      const response = await axios.put(`${BASE_URL}/holidays/${holiday.id}`, payload, {
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
      console.error('Error updating holiday:', err);
      
      // Extract error message - prioritize 'error' field over 'message'
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update holiday. Please try again.';
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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
            Edit Holiday
          </Typography>
          {holiday?.id && (
            <Chip label={`ID: ${holiday.id}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
          )}
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
                          fullWidth: true
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
                          fullWidth: true
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
                    <FormControl fullWidth size="small" error={!!fieldErrors.batch_ids}>
                      <InputLabel id="batch-select-label" sx={{ fontSize: '0.75rem' }}>
                        Select Batches
                      </InputLabel>
                      <Select
                        labelId="batch-select-label"
                        multiple
                        value={formData.batch_ids}
                        onChange={handleBatchChange}
                        input={<OutlinedInput label="Select Batches" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                              const batch = batches.find(b => b.id === value);
                              return batch ? (
                                <Chip 
                                  key={value} 
                                  label={batch.name} 
                                  size="small"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ) : null;
                            })}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        disabled={loading || batchesLoading}
                        sx={selectSx}
                      >
                        {batchesLoading && batches.length === 0 ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} /> Loading...
                          </MenuItem>
                        ) : (
                          batches.map((batch) => (
                            <MenuItem key={batch.id} value={batch.id}>
                              <Checkbox checked={formData.batch_ids.indexOf(batch.id) > -1} />
                              <ListItemText 
                                primary={batch.name} 
                                secondary={`Trainer: ${batch.trainer_name || 'Not assigned'}`}
                                sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }}
                              />
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {fieldErrors.batch_ids && (
                        <Typography sx={{ fontSize: '0.7rem', color: COLORS.error, mt: 0.5, ml: 1.5 }}>
                          {fieldErrors.batch_ids}
                        </Typography>
                      )}
                    </FormControl>
                    <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                      Select one or more batches for this holiday
                    </Typography>
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
            startIcon={loading ? <CircularProgress size={16} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
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
            {loading ? 'Updating...' : 'Update Holiday'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditHoliday;