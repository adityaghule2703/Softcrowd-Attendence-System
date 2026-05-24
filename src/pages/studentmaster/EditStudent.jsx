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
//   Autocomplete,
//   CircularProgress
// } from '@mui/material';
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

// const COMPANY_OPTIONS = [
//   "Exilance Software",
//   "Softcrowd Technology",
//   "Codiant Solution"
// ];

// const validatePhone = (phone) => {
//   const phoneRegex = /^[0-9]{10}$/;
//   return phoneRegex.test(phone);
// };

// const EditStudent = ({ open, onClose, student, onUpdate }) => {
//   const [colleges, setColleges] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [filteredDepartments, setFilteredDepartments] = useState([]);
//   const [selectedCollege, setSelectedCollege] = useState(null);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [loadingColleges, setLoadingColleges] = useState(false);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     college_id: '',
//     department_id: '',
//     password: '',
//     company_name: ''
//   });
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (open) {
//       loadCollegesFromAPI();
//       loadDepartmentsFromAPI();
//     }
//   }, [open]);

//   const loadCollegesFromAPI = async () => {
//     setLoadingColleges(true);
//     try {
//       const token = localStorage.getItem('token');
//       // Removed pagination params - just the basic URL
//       const response = await axios.get(`${BASE_URL}/colleges`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.data) {
//         const transformedColleges = response.data.data.map(college => ({
//           id: college.id,
//           name: college.name,
//           city: college.city,
//           state: college.state,
//           pincode: college.pincode,
//           address: college.address
//         }));
//         setColleges(transformedColleges);
//       }
//     } catch (error) {
//       console.error('Error loading colleges:', error);
//       setError('Failed to load colleges');
//     } finally {
//       setLoadingColleges(false);
//     }
//   };

//   const loadDepartmentsFromAPI = async () => {
//     setLoadingDepartments(true);
//     try {
//       const token = localStorage.getItem('token');
//       // Removed pagination params - just the basic URL
//       const response = await axios.get(`${BASE_URL}/departments`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.data) {
//         const transformedDepartments = response.data.data.map(dept => ({
//           id: dept.id,
//           department_name: dept.department_name,
//           college_id: dept.college_id,
//           coordinator_name: dept.coordinator_name,
//           coordinator_contact: dept.coordinator_contact,
//           coordinator_email: dept.coordinator_email
//         }));
//         setDepartments(transformedDepartments);
//       }
//     } catch (error) {
//       console.error('Error loading departments:', error);
//       setError('Failed to load departments');
//     } finally {
//       setLoadingDepartments(false);
//     }
//   };

//   // Populate form when student data is available
//   useEffect(() => {
//     if (student && colleges.length > 0 && departments.length > 0) {
//       console.log('Student data in EditStudent:', student);
      
//       setFormData({
//         name: student.name || '',
//         mobile: student.mobile || '',
//         college_id: student.collegeId || student.college_id || '',
//         department_id: student.departmentId || student.department_id || '',
//         password: '',
//         company_name: student.company_name || ''
//       });
      
//       // Find and set selected college
//       const collegeId = student.collegeId || student.college_id;
//       const foundCollege = colleges.find(c => c.id === collegeId);
//       setSelectedCollege(foundCollege || null);
      
//       // Find and set selected department
//       if (collegeId) {
//         const filtered = departments.filter(dept => dept.college_id === collegeId);
//         const departmentId = student.departmentId || student.department_id;
//         const foundDepartment = filtered.find(d => d.id === departmentId);
//         setSelectedDepartment(foundDepartment || null);
//       }
      
//       // Set selected company
//       const companyName = student.company_name || '';
//       console.log('Setting company name to:', companyName);
//       if (companyName && COMPANY_OPTIONS.includes(companyName)) {
//         setSelectedCompany(companyName);
//       }
//     }
//   }, [student, colleges, departments]);

//   // Filter departments based on selected college
//   useEffect(() => {
//     if (selectedCollege) {
//       const filtered = departments.filter(dept => dept.college_id === selectedCollege.id);
//       setFilteredDepartments(filtered);
      
//       if (selectedDepartment && selectedDepartment.college_id !== selectedCollege.id) {
//         setSelectedDepartment(null);
//         setFormData(prev => ({ ...prev, department_id: '' }));
//       }
//     } else {
//       setFilteredDepartments([]);
//     }
//   }, [selectedCollege, departments, selectedDepartment]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFieldErrors(prev => ({ ...prev, [name]: '' }));
    
//     let processedValue = value;
//     if (name === 'mobile') {
//       processedValue = value.replace(/\D/g, '').slice(0, 10);
//     }
    
//     setFormData(prev => ({ ...prev, [name]: processedValue }));
//   };

//   const handleCollegeChange = (event, newValue) => {
//     setSelectedCollege(newValue);
//     setSelectedDepartment(null);
//     setFieldErrors(prev => ({ ...prev, college_id: '' }));
//     setFormData(prev => ({ 
//       ...prev, 
//       college_id: newValue ? newValue.id : '',
//       department_id: ''
//     }));
//   };

//   const handleDepartmentChange = (event, newValue) => {
//     setSelectedDepartment(newValue);
//     setFieldErrors(prev => ({ ...prev, department_id: '' }));
//     setFormData(prev => ({ 
//       ...prev, 
//       department_id: newValue ? newValue.id : ''
//     }));
//   };

//   const handleCompanyChange = (event, newValue) => {
//     setSelectedCompany(newValue);
//     setFieldErrors(prev => ({ ...prev, company_name: '' }));
//     setFormData(prev => ({ 
//       ...prev, 
//       company_name: newValue || ''
//     }));
//   };

//   const validateAllFields = () => {
//     const errors = {};
//     let isValid = true;

//     if (!formData.name?.trim()) {
//       errors.name = 'Student name is required';
//       isValid = false;
//     }

//     if (!formData.mobile?.trim()) {
//       errors.mobile = 'Mobile number is required';
//       isValid = false;
//     } else if (!validatePhone(formData.mobile)) {
//       errors.mobile = 'Please enter a valid 10-digit mobile number';
//       isValid = false;
//     }

//     if (!formData.college_id) {
//       errors.college_id = 'College name is required';
//       isValid = false;
//     }

//     if (!formData.department_id) {
//       errors.department_id = 'Department name is required';
//       isValid = false;
//     }

//     if (!formData.company_name?.trim()) {
//       errors.company_name = 'Company name is required';
//       isValid = false;
//     } else if (!COMPANY_OPTIONS.includes(formData.company_name)) {
//       errors.company_name = 'Please select a valid company from the options';
//       isValid = false;
//     }

//     if (formData.password && formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters';
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
//         mobile: formData.mobile,
//         college_id: parseInt(formData.college_id),
//         department_id: parseInt(formData.department_id),
//         company_name: formData.company_name
//       };
      
//       if (formData.password) {
//         payload.password = formData.password;
//       }

//       console.log('Update payload:', payload);

//       const response = await axios.put(`${BASE_URL}/students/${student.id}`, payload, {
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
//       console.error('Error updating student:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to update student. Please try again.';
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
//     },
//     '& .MuiInputBase-input': {
//       py: 1,
//       px: 1.5,
//       fontSize: '0.75rem',
//     }
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, py: 1.5, px: 2.5,mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>Edit Student</Typography>
//         {student?.id && <Chip label={`ID: ${student.id}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />}
//       </DialogTitle>

//       <DialogContent sx={{ p: 2.5 }}>
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
//             <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5 }}>Student Information</Typography>
            
//             <Grid container spacing={1.5}>
//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     STUDENT NAME <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     disabled={loading}
//                     error={!!fieldErrors.name}
//                     helperText={fieldErrors.name}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12, sm: 6 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     MOBILE NUMBER <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     disabled={loading}
//                     error={!!fieldErrors.mobile}
//                     helperText={fieldErrors.mobile}
//                     inputProps={{ maxLength: 10 }}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     COLLEGE NAME <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <Autocomplete
//                     fullWidth
//                     options={colleges}
//                     loading={loadingColleges}
//                     value={selectedCollege}
//                     onChange={handleCollegeChange}
//                     getOptionLabel={(option) => option?.name || ''}
//                     isOptionEqualToValue={(option, value) => option?.id === value?.id}
//                     disabled={loading}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         placeholder="Search and select college"
//                         error={!!fieldErrors.college_id}
//                         helperText={fieldErrors.college_id}
//                         sx={textFieldSx}
//                       />
//                     )}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     DEPARTMENT NAME <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <Autocomplete
//                     fullWidth
//                     options={filteredDepartments}
//                     loading={loadingDepartments}
//                     value={selectedDepartment}
//                     onChange={handleDepartmentChange}
//                     getOptionLabel={(option) => option?.department_name || ''}
//                     isOptionEqualToValue={(option, value) => option?.id === value?.id}
//                     disabled={loading || !selectedCollege}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         placeholder={!selectedCollege ? 'Please select college first' : 'Search and select department'}
//                         error={!!fieldErrors.department_id}
//                         helperText={fieldErrors.department_id}
//                         sx={textFieldSx}
//                       />
//                     )}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     COMPANY NAME <span style={{ color: COLORS.error }}>*</span>
//                   </Typography>
//                   <Autocomplete
//                     fullWidth
//                     options={COMPANY_OPTIONS}
//                     value={selectedCompany}
//                     onChange={handleCompanyChange}
//                     disabled={loading}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         size="small"
//                         placeholder="Select company name"
//                         error={!!fieldErrors.company_name}
//                         helperText={fieldErrors.company_name}
//                         sx={textFieldSx}
//                       />
//                     )}
//                   />
//                 </Box>
//               </Grid>

//               <Grid size={{ xs: 12 }}>
//                 <Box>
//                   <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
//                     PASSWORD (Leave blank to keep current)
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     name="password"
//                     type="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     disabled={loading}
//                     placeholder="Enter new password"
//                     error={!!fieldErrors.password}
//                     helperText={fieldErrors.password || 'Minimum 6 characters'}
//                     sx={textFieldSx}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Paper>

//           {error && <Alert severity="error" sx={{ borderRadius: 1.5 }}>{error}</Alert>}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
//         <Button onClick={handleClose} disabled={loading}>Cancel</Button>
//         <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : <EditIcon />}>
//           {loading ? 'Updating...' : 'Update Student'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditStudent;



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

const COMPANY_OPTIONS = [
  "Exilance Software",
  "Softcrowd Technology",
  "Codiant Solution"
];

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const EditStudent = ({ open, onClose, student, onUpdate }) => {
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
        headers: { 'Authorization': `Bearer ${token}` }
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
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
      setError('Failed to load colleges');
    } finally {
      setLoadingColleges(false);
    }
  };

  const loadDepartmentsFromAPI = async () => {
    setLoadingDepartments(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
      }
    } catch (error) {
      console.error('Error loading departments:', error);
      setError('Failed to load departments');
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Populate form when student data is available
  useEffect(() => {
    if (student && colleges.length > 0 && departments.length > 0) {
      console.log('Student data in EditStudent:', student);
      
      setFormData({
        name: student.name || '',
        mobile: student.mobile || '',
        college_id: student.collegeId || student.college_id || '',
        department_id: student.departmentId || student.department_id || '',
        password: '',
        company_name: student.company_name || ''
      });
      
      // Find and set selected college
      const collegeId = student.collegeId || student.college_id;
      const foundCollege = colleges.find(c => c.id === collegeId);
      setSelectedCollege(foundCollege || null);
      
      // Find and set selected department
      if (collegeId) {
        const filtered = departments.filter(dept => dept.college_id === collegeId);
        const departmentId = student.departmentId || student.department_id;
        const foundDepartment = filtered.find(d => d.id === departmentId);
        setSelectedDepartment(foundDepartment || null);
      }
      
      // Set selected company
      const companyName = student.company_name || '';
      console.log('Setting company name to:', companyName);
      if (companyName && COMPANY_OPTIONS.includes(companyName)) {
        setSelectedCompany(companyName);
      }
    }
  }, [student, colleges, departments]);

  // Filter departments based on selected college
  useEffect(() => {
    if (selectedCollege) {
      const filtered = departments.filter(dept => dept.college_id === selectedCollege.id);
      setFilteredDepartments(filtered);
      
      if (selectedDepartment && selectedDepartment.college_id !== selectedCollege.id) {
        setSelectedDepartment(null);
        setFormData(prev => ({ ...prev, department_id: '' }));
      }
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedCollege, departments, selectedDepartment]);

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
    setFieldErrors(prev => ({ ...prev, college_id: '' }));
    setFormData(prev => ({ 
      ...prev, 
      college_id: newValue ? newValue.id : '',
      department_id: ''
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

    if (!formData.company_name?.trim()) {
      errors.company_name = 'Company name is required';
      isValid = false;
    } else if (!COMPANY_OPTIONS.includes(formData.company_name)) {
      errors.company_name = 'Please select a valid company from the options';
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
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile,
        college_id: parseInt(formData.college_id),
        department_id: parseInt(formData.department_id),
        company_name: formData.company_name
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      console.log('Update payload:', payload);

      const response = await axios.put(`${BASE_URL}/students/${student.id}`, payload, {
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
      console.error('Error updating student:', err);
      
      // Extract error message - prioritize 'error' field over 'message'
      let errorMessage = '';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = 'Failed to update student. Please try again.';
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
    },
    '& .MuiInputBase-input': {
      py: 1,
      px: 1.5,
      fontSize: '0.75rem',
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`, 
        py: 1.5, 
        px: 2.5,
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, color: COLORS.text.primary }}>
          Edit Student
        </Typography>
        {student?.id && <Chip label={`ID: ${student.id}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />}
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
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
              Student Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    STUDENT NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    MOBILE NUMBER <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.mobile}
                    helperText={fieldErrors.mobile}
                    inputProps={{ maxLength: 10 }}
                    sx={textFieldSx}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search and select college"
                        error={!!fieldErrors.college_id}
                        helperText={fieldErrors.college_id}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder={!selectedCollege ? 'Please select college first' : 'Search and select department'}
                        error={!!fieldErrors.department_id}
                        helperText={fieldErrors.department_id}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                    COMPANY NAME <span style={{ color: COLORS.error }}>*</span>
                  </Typography>
                  <Autocomplete
                    fullWidth
                    options={COMPANY_OPTIONS}
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    disabled={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select company name"
                        error={!!fieldErrors.company_name}
                        helperText={fieldErrors.company_name}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
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
          {loading ? 'Updating...' : 'Update Student'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudent;