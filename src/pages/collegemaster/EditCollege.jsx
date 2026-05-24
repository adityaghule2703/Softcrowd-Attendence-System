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
//   CircularProgress
// } from '@mui/material';
// import { 
//   Edit as EditIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import BASE_URL from '../../config/Config';

// // Color constants
// const COLORS = {
//   primary: '#0F172A',
//   primaryLight: '#1E293B',
//   primaryDark: '#0A0F1E',
//   accent: '#00AEED',
//   accentLight: '#E0F2FE',
//   text: {
//     primary: '#1E293B',
//     secondary: '#64748B',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FAFC',
//     hover: '#F1F5F9'
//   },
//   border: '#E2E8F0',
//   error: '#EF4444',
//   success: '#10B981'
// };

// const validateEmail = (email) => {
//   if (!email) return true; // Email is optional
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validatePhone = (phone) => {
//   const phoneRegex = /^[0-9]{10}$/;
//   return phoneRegex.test(phone);
// };

// const EditCollege = ({ open, onClose, college, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     contact_number: '',
//     email: ''
//   });
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (college) {
//       setFormData({
//         name: college.name || '',
//         address: college.address || '',
//         city: college.city || '',
//         state: college.state || '',
//         pincode: college.pincode || '',
//         contact_number: college.contact || college.contact_number || '',
//         email: college.email || ''
//       });
//     }
//   }, [college]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     setFieldErrors(prev => ({
//       ...prev,
//       [name]: ''
//     }));
    
//     let processedValue = value;
//     if (name === 'contact_number') {
//       processedValue = value.replace(/\D/g, '').slice(0, 10);
//     }
//     if (name === 'pincode') {
//       processedValue = value.replace(/\D/g, '').slice(0, 6);
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: processedValue
//     }));
//   };

//   const validateAllFields = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.name?.trim()) {
//       errors.name = 'College name is required';
//       isValid = false;
//     }

//     if (!formData.address?.trim()) {
//       errors.address = 'Address is required';
//       isValid = false;
//     }

//     if (!formData.city?.trim()) {
//       errors.city = 'City is required';
//       isValid = false;
//     }

//     if (!formData.state?.trim()) {
//       errors.state = 'State is required';
//       isValid = false;
//     }

//     if (!formData.pincode?.trim()) {
//       errors.pincode = 'Pincode is required';
//       isValid = false;
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       errors.pincode = 'Please enter a valid 6-digit pincode';
//       isValid = false;
//     }

//     if (!formData.contact_number?.trim()) {
//       errors.contact_number = 'Contact number is required';
//       isValid = false;
//     } else if (!validatePhone(formData.contact_number)) {
//       errors.contact_number = 'Please enter a valid 10-digit mobile number';
//       isValid = false;
//     }

//     if (formData.email && !validateEmail(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     if (!isValid) {
//       setError('Please fix all validation errors');
//     }
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     if (!validateAllFields()) {
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const payload = {
//         name: formData.name.trim(),
//         address: formData.address.trim(),
//         city: formData.city.trim(),
//         state: formData.state.trim(),
//         pincode: formData.pincode,
//         contact_number: formData.contact_number,
//         email: formData.email.trim() || null
//       };

//       const response = await axios.put(`${BASE_URL}/colleges/${college.id}`, payload, {
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
//       console.error('Error updating college:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to update college. Please try again.';
//       setError(errorMessage);
      
//       // Handle field-specific errors from backend
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
//     },
//     '& input[type=number]': {
//       MozAppearance: 'textfield'
//     },
//     '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
//       WebkitAppearance: 'none',
//       margin: 0
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//           border: `1px solid ${COLORS.border}`,
//           overflow: 'hidden'
//         }
//       }}
//     >
//       <DialogTitle sx={{
//         borderBottom: `1px solid ${COLORS.border}`,
//         py: 1.5,
//         px: 2.5,
//         mb: 2,
//         bgcolor: COLORS.background.white,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
//           Edit College
//         </Typography>
//         {college?.id && (
//           <Chip
//             label={`ID: ${college.id}`}
//             size="small"
//             sx={{ 
//               fontSize: '0.65rem',
//               fontWeight: 500,
//               height: 20,
//               bgcolor: COLORS.background.light,
//               color: COLORS.text.secondary
//             }}
//           />
//         )}
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.white }}>
//         <Stack spacing={2}>
//           <Paper sx={{ 
//             p: 2, 
//             bgcolor: COLORS.background.white, 
//             borderRadius: 1.5, 
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: 'none'
//           }}>
//             <Typography sx={{ 
//               fontSize: '0.8rem', 
//               fontWeight: 600, 
//               color: COLORS.accent, 
//               mb: 1.5 
//             }}>
//               College Information
//             </Typography>
            
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     COLLEGE NAME <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., ABC College of Engineering"
//                     error={!!fieldErrors.name}
//                     helperText={fieldErrors.name}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     ADDRESS <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     multiline
//                     rows={2}
//                     disabled={loading}
//                     placeholder="Enter complete address"
//                     error={!!fieldErrors.address}
//                     helperText={fieldErrors.address}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     CITY <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., New York"
//                     error={!!fieldErrors.city}
//                     helperText={fieldErrors.city}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     STATE <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., New York"
//                     error={!!fieldErrors.state}
//                     helperText={fieldErrors.state}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     PINCODE <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="pincode"
//                     value={formData.pincode}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., 10001"
//                     error={!!fieldErrors.pincode}
//                     helperText={fieldErrors.pincode}
//                     inputProps={{ maxLength: 6 }}
//                     type="text"
//                     sx={textFieldSx}
//                   />
//                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                     6-digit pincode
//                   </Typography>
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     CONTACT NUMBER <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="contact_number"
//                     value={formData.contact_number}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="e.g., 9876543210"
//                     error={!!fieldErrors.contact_number}
//                     helperText={fieldErrors.contact_number}
//                     inputProps={{ maxLength: 10 }}
//                     type="text"
//                     sx={textFieldSx}
//                   />
//                   <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                     10-digit mobile number
//                   </Typography>
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
//                     EMAIL (Optional)
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="college@example.com"
//                     error={!!fieldErrors.email}
//                     helperText={fieldErrors.email}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 borderRadius: 1.5,
//                 fontSize: '0.75rem',
//                 py: 0.5
//               }}
//             >
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{
//         px: 2.5,
//         py: 1.5,
//         borderTop: `1px solid ${COLORS.border}`,
//         bgcolor: COLORS.background.white,
//         justifyContent: 'flex-end'
//       }}>
//         <Button
//           onClick={handleClose}
//           disabled={loading}
//           size="small"
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             border: `1px solid ${COLORS.border}`,
//             color: COLORS.text.secondary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: COLORS.accent,
//               bgcolor: `${COLORS.accent}10`
//             }
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading}
//           size="small"
//           startIcon={loading ? <CircularProgress size={16} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
//           sx={{
//             height: 32,
//             px: 2,
//             borderRadius: 1.5,
//             bgcolor: COLORS.primary,
//             fontSize: '0.7rem',
//             fontWeight: 500,
//             textTransform: 'none',
//             boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//             '&:hover': {
//               bgcolor: COLORS.primaryDark,
//             }
//           }}
//         >
//           {loading ? 'Updating...' : 'Update College'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditCollege;



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
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Color constants
const COLORS = {
  primary: '#0F172A',
  primaryLight: '#1E293B',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',
  accentLight: '#E0F2FE',
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

const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const EditCollege = ({ open, onClose, college, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contact_number: '',
    email: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (college) {
      setFormData({
        name: college.name || '',
        address: college.address || '',
        city: college.city || '',
        state: college.state || '',
        pincode: college.pincode || '',
        contact_number: college.contact || college.contact_number || '',
        email: college.email || ''
      });
    }
  }, [college]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    let processedValue = value;
    if (name === 'contact_number') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'pincode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      errors.name = 'College name is required';
      isValid = false;
    }

    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.city?.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state?.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    if (!formData.pincode?.trim()) {
      errors.pincode = 'Pincode is required';
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
      isValid = false;
    }

    if (!formData.contact_number?.trim()) {
      errors.contact_number = 'Contact number is required';
      isValid = false;
    } else if (!validatePhone(formData.contact_number)) {
      errors.contact_number = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setFieldErrors(errors);
    if (!isValid) {
      setError('Please fix all validation errors');
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
        contact_number: formData.contact_number,
        email: formData.email.trim() || null
      };

      const response = await axios.put(`${BASE_URL}/colleges/${college.id}`, payload, {
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
      console.error('Error updating college:', err);
      
      // Extract error message - prioritize 'error' field over 'message'
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update college. Please try again.';
      }
      
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
    },
    '& input[type=number]': {
      MozAppearance: 'textfield'
    },
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
          Edit College
        </Typography>
        {college?.id && (
          <Chip
            label={`ID: ${college.id}`}
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
              College Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    COLLEGE NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., ABC College of Engineering"
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    ADDRESS <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    disabled={loading}
                    placeholder="Enter complete address"
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    CITY <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., New York"
                    error={!!fieldErrors.city}
                    helperText={fieldErrors.city}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    STATE <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., New York"
                    error={!!fieldErrors.state}
                    helperText={fieldErrors.state}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    PINCODE <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 10001"
                    error={!!fieldErrors.pincode}
                    helperText={fieldErrors.pincode}
                    inputProps={{ maxLength: 6 }}
                    type="text"
                    sx={textFieldSx}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    6-digit pincode
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    CONTACT NUMBER <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g., 9876543210"
                    error={!!fieldErrors.contact_number}
                    helperText={fieldErrors.contact_number}
                    inputProps={{ maxLength: 10 }}
                    type="text"
                    sx={textFieldSx}
                  />
                  <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                    10-digit mobile number
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    EMAIL (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="college@example.com"
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    sx={textFieldSx}
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
          {loading ? 'Updating...' : 'Update College'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCollege;