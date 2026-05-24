// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   TextField,
//   InputAdornment,
//   Tooltip,
//   Typography,
//   TablePagination,
//   Checkbox,
//   Stack,
//   Chip,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Alert,
//   CircularProgress,
//   Snackbar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Autocomplete,
//   List,
//   ListItem
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   Edit as EditIcon,
//   MoreVert as MoreVertIcon,
//   Refresh as RefreshIcon,
//   People as PeopleIcon,
//   Phone as PhoneIcon,
//   School as SchoolIcon,
//   Business as BusinessIcon,
//   Person as PersonIcon,
//   Assignment as AssignmentIcon,
//   Close as CloseIcon,
//   Block as BlockIcon,
//   CheckCircle as CheckCircleIcon,
//   FileDownload as ImportIcon,
//   FileUpload as ExportIcon
// } from '@mui/icons-material';
// import { CheckCircle, XCircle, Lock, LockOpen } from 'lucide-react';
// import axios from 'axios';
// import BASE_URL from '../../config/Config';
// import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';

// // Import modal components
// import AddStudent from './AddStudent';
// import EditStudent from './EditStudent';
// import ViewStudent from './ViewStudent';
// import DeleteStudent from './DeleteStudent';

// // Color constants
// const COLORS = {
//   primary: '#0F172A',
//   primaryLight: '#1E293B',
//   primaryDark: '#0A0F1E',
//   accent: '#00AEED',
//   text: {
//     primary: '#424347',
//     secondary: '#6B7280',
//     tertiary: '#94A3B8',
//     light: '#FFFFFF'
//   },
//   background: {
//     white: '#FFFFFF',
//     light: '#F8FAFC',
//     hover: '#F1F5F9',
//     tableHeader: '#0F172A'
//   },
//   border: '#E2E8F0'
// };

// // Loading state component
// const LoadingState = () => (
//   <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//     <CircularProgress size={40} sx={{ color: COLORS.primary }} />
//   </Box>
// );

// // Access Denied component
// const AccessDenied = () => (
//   <Box sx={{ p: 4, textAlign: 'center' }}>
//     <PeopleIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
//     <Typography variant="h6" sx={{ color: COLORS.text.primary, mb: 1, fontWeight: 600 }}>
//       Access Denied
//     </Typography>
//     <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
//       You don't have permission to view this page. Please contact your administrator.
//     </Typography>
//   </Box>
// );

// // Block/Unblock Dialog Component with permission checks
// const BlockUnblockDialog = ({ open, onClose, student, onBlockUnblock, canDelete, canCreate }) => {
//   const [reason, setReason] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const isBlocked = student?.is_blocked === 1;

//   // Check permission based on action
//   // Block requires DELETE permission, Unblock requires CREATE permission
//   const hasPermission = isBlocked ? canCreate : canDelete;

//   useEffect(() => {
//     if (open && student) {
//       setReason('');
//       setError('');
//     }
//   }, [open, student]);

//   const handleSubmit = async () => {
//     if (!hasPermission) {
//       setError(`You don't have permission to ${isBlocked ? 'unblock' : 'block'} this student`);
//       return;
//     }

//     if (!isBlocked && !reason.trim()) {
//       setError('Please provide a reason for blocking');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const endpoint = isBlocked 
//         ? `${BASE_URL}/student/unblock`
//         : `${BASE_URL}/student/block`;
      
//       const response = await axios.post(endpoint, {
//         student_id: student.id,
//         reason: reason.trim()
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.message) {
//         onBlockUnblock(student.id, !isBlocked);
//         onClose();
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       const errorMessage = err.response?.data?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} student. Please try again.`;
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           {isBlocked ? (
//             <LockOpen sx={{ color: '#10B981' }} />
//           ) : (
//             <Lock sx={{ color: '#EF4444' }} />
//           )}
//           <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
//             {isBlocked ? 'Unblock Student' : 'Block Student'}
//           </Typography>
//         </Stack>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={2}>
//           <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
//             <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
//               Student Information
//             </Typography>
//             <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
//               {student?.name}
//             </Typography>
//             <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//               {student?.mobile}
//             </Typography>
//           </Paper>

//           {error && (
//             <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               {error}
//             </Alert>
//           )}

//           {!isBlocked && (
//             <Box>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
//                 Block Reason <span style={{ color: '#EF4444' }}>*</span>
//               </Typography>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 placeholder="Enter reason for blocking this student..."
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 error={error && !reason.trim()}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 1.5,
//                     fontSize: '0.75rem',
//                   }
//                 }}
//               />
//             </Box>
//           )}

//           {!isBlocked && (
//             <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               Blocking this student will prevent them from accessing the application and joining sessions.
//             </Alert>
//           )}

//           {isBlocked && student?.block_reason && (
//             <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
//                 Previously blocked for:
//               </Typography>
//               <Typography variant="body2">{student.block_reason}</Typography>
//             </Alert>
//           )}

//           {/* Permission warning if user doesn't have required permission */}
//           {!hasPermission && (
//             <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               You don't have permission to {isBlocked ? 'unblock' : 'block'} this student. 
//               {isBlocked ? 'Unblock requires CREATE permission.' : 'Block requires DELETE permission.'}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
//         <Button onClick={onClose} disabled={loading}>Cancel</Button>
//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={loading || (!isBlocked && !reason.trim()) || !hasPermission}
//           startIcon={loading ? <CircularProgress size={16} /> : (isBlocked ? <LockOpen /> : <Lock />)}
//           sx={{
//             bgcolor: isBlocked ? '#10B981' : '#EF4444',
//             textTransform: 'none',
//             fontSize: '0.75rem',
//             '&:hover': {
//               bgcolor: isBlocked ? '#059669' : '#DC2626'
//             }
//           }}
//         >
//           {loading ? (isBlocked ? 'Unblocking...' : 'Blocking...') : (isBlocked ? 'Unblock Student' : 'Block Student')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Assign Batch Dialog Component
// const AssignBatchDialog = ({ open, onClose, student, batches, onAssign }) => {
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [startDate, setStartDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [assignedBatches, setAssignedBatches] = useState(student?.batches || []);

//   useEffect(() => {
//     if (student) {
//       setAssignedBatches(student.batches || []);
//       const today = new Date().toISOString().split('T')[0];
//       setStartDate(today);
//       setError('');
//       setSuccess('');
//     }
//   }, [student]);

//   const showNotification = (message, type = 'success') => {
//     if (type === 'success') {
//       setSuccess(message);
//       setTimeout(() => setSuccess(''), 3000);
//     } else {
//       setError(message);
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedBatch) {
//       setError('Please select a batch');
//       return;
//     }

//     if (!startDate) {
//       setError('Please select start date');
//       return;
//     }

//     if (assignedBatches.some(b => b.id === selectedBatch.id)) {
//       setError('This batch is already assigned to the student');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${BASE_URL}/assign-batch`, {
//         student_id: student.id,
//         batch_id: selectedBatch.id,
//         start_date: startDate
//       }, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.message) {
//         // Fetch updated student data
//         const studentResponse = await axios.get(`${BASE_URL}/students/${student.id}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         if (studentResponse.data && studentResponse.data.data) {
//           const updatedBatches = studentResponse.data.data.batches || [];
//           setAssignedBatches(updatedBatches);
//           onAssign(student.id, updatedBatches);
//           showNotification('Batch assigned successfully!', 'success');
//           setSelectedBatch(null);
//           setStartDate(new Date().toISOString().split('T')[0]);
//         }
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error assigning batch:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to assign batch. Please try again.';
//       showNotification(errorMessage, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveBatch = async (batchId) => {
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.delete(`${BASE_URL}/unassign-batch/${student.id}/${batchId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.status === true) {
//         // Immediately remove the batch from UI
//         const updatedBatches = assignedBatches.filter(batch => batch.id !== batchId);
//         setAssignedBatches(updatedBatches);
        
//         // Show success message
//         showNotification(response.data.message || 'Batch unassigned successfully', 'success');
        
//         // Notify parent component
//         onAssign(student.id, updatedBatches);
//       } else {
//         throw new Error(response.data.message || 'Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error removing batch:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to remove batch. Please try again.';
//       showNotification(errorMessage, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const availableBatches = batches.filter(
//     batch => !assignedBatches.some(assigned => assigned.id === batch.id)
//   );

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
//         <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
//           Manage Batches for {student?.name}
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={3}>
//           {/* Success Message */}
//           {success && (
//             <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               {success}
//             </Alert>
//           )}
          
//           {/* Error Message */}
//           {error && (
//             <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               {error}
//             </Alert>
//           )}

//           {assignedBatches.length > 0 && (
//             <Box>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
//                 Assigned Batches ({assignedBatches.length})
//               </Typography>
//               <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
//                 <List dense disablePadding>
//                   {assignedBatches.map((batch, index) => (
//                     <ListItem key={batch.id} divider={index < assignedBatches.length - 1} sx={{ py: 1.5 }}>
//                       <Box sx={{ flex: 1 }}>
//                         <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
//                           {batch.name}
//                         </Typography>
//                         <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
//                           📅 {batch.start_date} to {batch.end_date} | ⏰ {batch.start_time} - {batch.end_time}
//                         </Typography>
//                       </Box>
//                       <IconButton 
//                         size="small" 
//                         onClick={() => handleRemoveBatch(batch.id)} 
//                         sx={{ 
//                           color: '#EF4444',
//                           '&:hover': {
//                             bgcolor: '#FEE2E2'
//                           }
//                         }} 
//                         disabled={loading}
//                       >
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     </ListItem>
//                   ))}
//                 </List>
//               </Paper>
//             </Box>
//           )}

//           {availableBatches.length > 0 && (
//             <Box>
//               <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
//                 Add New Batch
//               </Typography>
//               <Stack spacing={2}>
//                 <Autocomplete
//                   fullWidth
//                   options={availableBatches}
//                   value={selectedBatch}
//                   onChange={(event, newValue) => {
//                     setSelectedBatch(newValue);
//                     setError('');
//                   }}
//                   getOptionLabel={(option) => option.name}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       size="small"
//                       placeholder="Search and select batch by name"
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           borderRadius: 1.5,
//                           fontSize: '0.75rem',
//                         }
//                       }}
//                     />
//                   )}
//                 />

//                 <TextField
//                   fullWidth
//                   size="small"
//                   label="Start Date"
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   InputLabelProps={{ shrink: true }}
//                 />

//                 <Button
//                   variant="contained"
//                   onClick={handleAssign}
//                   disabled={loading || !selectedBatch || !startDate}
//                   startIcon={loading ? <CircularProgress size={16} /> : <AssignmentIcon />}
//                   sx={{
//                     height: 40,
//                     borderRadius: 1.5,
//                     bgcolor: COLORS.accent,
//                     textTransform: 'none',
//                     fontSize: '0.75rem',
//                     '&:hover': { bgcolor: COLORS.primary }
//                   }}
//                 >
//                   {loading ? 'Assigning...' : 'Assign Batch'}
//                 </Button>
//               </Stack>
//             </Box>
//           )}

//           {availableBatches.length === 0 && assignedBatches.length > 0 && (
//             <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               All available batches have been assigned to this student.
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// // Action Menu Component with permission checks
// const ActionMenu = ({ student, onView, onEdit, onDelete, onAssignBatch, onBlockUnblock, canView, canUpdate, canDelete, canCreate }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const isBlocked = student?.is_blocked === 1;

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // Check if there's ANY action available
//   const hasAnyAction = canView || canUpdate || canDelete || canCreate;

//   if (!hasAnyAction) {
//     return null;
//   }

//   return (
//     <>
//       <Tooltip title="Actions">
//         <IconButton 
//           size="small" 
//           onClick={handleClick} 
//           sx={{ 
//             color: COLORS.text.secondary,
//             '&:hover': {
//               bgcolor: `${COLORS.accent}20`
//             }
//           }}
//         >
//           <MoreVertIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           elevation: 3,
//           sx: { 
//             mt: 1, 
//             minWidth: 180, 
//             borderRadius: 2, 
//             border: `1px solid ${COLORS.border}`,
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//           }
//         }}
//       >
//         {canView && (
//           <MenuItem onClick={() => { onView(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
//               <ViewIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Details</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {canUpdate && (
//           <MenuItem onClick={() => { onEdit(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
//               <EditIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>Edit</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {canCreate && (
//           <MenuItem onClick={() => { onAssignBatch(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
//               <AssignmentIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>Manage Batches</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {/* Block Student - Only show if student is NOT blocked AND user has DELETE permission */}
//         {!isBlocked && canDelete && (
//           <MenuItem onClick={() => { onBlockUnblock(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//               <Lock fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
//                 Block Student
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}

//         {/* Unblock Student - Only show if student IS blocked AND user has CREATE permission */}
//         {isBlocked && canCreate && (
//           <MenuItem onClick={() => { onBlockUnblock(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
//               <LockOpen fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
//                 Unblock Student
//               </Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
        
//         {(canView || canUpdate || canCreate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
//         {canDelete && (
//           <MenuItem onClick={() => { onDelete(student); handleClose(); }} sx={{ py: 1.5 }}>
//             <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
//               <DeleteIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText>
//               <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>Delete</Typography>
//             </ListItemText>
//           </MenuItem>
//         )}
//       </Menu>
//     </>
//   );
// };

// // Batch Status Chip Component
// const BatchStatusChip = ({ batches }) => {
//   const count = batches?.length || 0;
  
//   if (count > 0) {
//     return (
//       <Chip
//         label={`${count} Batch${count > 1 ? 'es' : ''} Assigned`}
//         size="small"
//         icon={<CheckCircle size={14} />}
//         sx={{
//           bgcolor: '#D1FAE5',
//           color: '#10B981',
//           fontSize: '0.65rem',
//           fontWeight: 600,
//           height: 24,
//         }}
//       />
//     );
//   }
//   return (
//     <Chip
//       label="No Batch"
//       size="small"
//       icon={<XCircle size={14} />}
//       sx={{
//         bgcolor: '#FEE2E2',
//         color: '#EF4444',
//         fontSize: '0.65rem',
//         fontWeight: 600,
//         height: 24,
//       }}
//     />
//   );
// };

// // Student Status Chip Component
// const StudentStatusChip = ({ isBlocked, blockReason }) => {
//   if (isBlocked) {
//     return (
//       <Tooltip title={blockReason || 'No reason provided'}>
//         <Chip
//           label="Blocked"
//           size="small"
//           icon={<Lock size={14} />}
//           sx={{
//             bgcolor: '#FEE2E2',
//             color: '#EF4444',
//             fontSize: '0.65rem',
//             fontWeight: 600,
//             height: 24,
//           }}
//         />
//       </Tooltip>
//     );
//   }
//   return (
//     <Chip
//       label="Active"
//       size="small"
//       icon={<LockOpen size={14} />}
//       sx={{
//         bgcolor: '#D1FAE5',
//         color: '#10B981',
//         fontSize: '0.65rem',
//         fontWeight: 600,
//         height: 24,
//       }}
//     />
//   );
// };

// // Import Dialog Component
// const ImportDialog = ({ open, onClose, onImport }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
//       setSelectedFile(file);
//       setError('');
//     } else {
//       setError('Please select a valid CSV file');
//       setSelectedFile(null);
//     }
//   };

//   const handleImport = async () => {
//     if (!selectedFile) {
//       setError('Please select a file');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('file', selectedFile);
      
//       const response = await axios.post(`${BASE_URL}/admin/students/import`, formData, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data && response.data.message) {
//         onImport();
//         onClose();
//         setSelectedFile(null);
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Error importing students:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to import students. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
//         <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
//           Import Students
//         </Typography>
//       </DialogTitle>
      
//       <DialogContent sx={{ pt: 3 }}>
//         <Stack spacing={2}>
//           <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//             Please upload a CSV file
//           </Alert>
          
//           <Button
//             variant="outlined"
//             component="label"
//             sx={{ height: 56, borderRadius: 1.5 }}
//           >
//             {selectedFile ? selectedFile.name : 'Choose CSV File'}
//             <input
//               type="file"
//               accept=".csv"
//               hidden
//               onChange={handleFileChange}
//             />
//           </Button>

//           {error && (
//             <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
//               {error}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>
      
//       <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
//         <Button onClick={onClose} disabled={loading}>Cancel</Button>
//         <Button
//           variant="contained"
//           onClick={handleImport}
//           disabled={loading || !selectedFile}
//           startIcon={loading ? <CircularProgress size={16} /> : <ImportIcon />}
//           sx={{
//             bgcolor: COLORS.accent,
//             textTransform: 'none',
//             fontSize: '0.75rem',
//             '&:hover': { bgcolor: COLORS.primary }
//           }}
//         >
//           {loading ? 'Importing...' : 'Import'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selected, setSelected] = useState([]);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   // User permissions state
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

//   const [totalCount, setTotalCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);

//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openViewModal, setOpenViewModal] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openAssignBatchDialog, setOpenAssignBatchDialog] = useState(false);
//   const [openBlockUnblockDialog, setOpenBlockUnblockDialog] = useState(false);
//   const [openImportDialog, setOpenImportDialog] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // Fetch user permissions from API
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/me`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         if (response.data.success) {
//           const userData = response.data.data;
//           setIsSuperAdmin(userData.is_super_admin || false);
//           setUserPermissions(userData.permissions || []);
//         }
//       } catch (err) {
//         console.error('Error fetching user permissions:', err);
//         setUserPermissions([]);
//       } finally {
//         setPermissionsLoaded(true);
//       }
//     };
    
//     fetchUserPermissions();
//   }, []);

//   // Helper to check permission
//   const checkPermission = (action) => {
//     if (isSuperAdmin) return true;
//     return hasPermission(userPermissions, MODULES.STUDENT_MANAGEMENT, PAGES.STUDENT_MANAGEMENT, action);
//   };

//   // Permission checks
//   const canView = checkPermission(ACTIONS.VIEW);
//   const canCreate = checkPermission(ACTIONS.CREATE);
//   const canUpdate = checkPermission(ACTIONS.UPDATE);
//   const canDelete = checkPermission(ACTIONS.DELETE);

//   const loadBatchesFromAPI = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/batches`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.data && response.data.data) {
//         setBatches(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error loading batches:', error);
//     }
//   }, []);

//   const loadStudentsFromAPI = useCallback(async () => {
//     if (!canView && !isSuperAdmin) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const params = {
//         page: currentPage,
//         per_page: rowsPerPage,
//         search: searchTerm
//       };
      
//       const response = await axios.get(`${BASE_URL}/students`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params: params
//       });

//       if (response.data && response.data.data) {
//         const transformedStudents = response.data.data.map(student => ({
//           id: student.id,
//           name: student.name,
//           mobile: student.mobile,
//           collegeId: student.college_id,
//           collegeName: student.college?.name || 'Unknown College',
//           departmentId: student.department_id,
//           departmentName: student.department?.department_name || 'Unknown Department',
//           image: student.image,
//           batches: student.batches || [],
//           createdAt: student.created_at,
//           updatedAt: student.updated_at,
//           is_blocked: student.is_blocked || 0,
//           block_reason: student.block_reason,
//           blocked_at: student.blocked_at,
//           company_name: student.company_name || ''
//         }));
        
//         setStudents(transformedStudents);
//         setTotalCount(response.data.total || 0);
//       } else {
//         setStudents([]);
//         setTotalCount(0);
//       }
//     } catch (error) {
//       console.error('Error loading students:', error);
//       showNotification(error.response?.data?.message || 'Failed to load students', 'error');
//       setStudents([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, rowsPerPage, searchTerm, canView, isSuperAdmin]);

//   useEffect(() => {
//     if (permissionsLoaded && (canView || isSuperAdmin)) {
//       loadStudentsFromAPI();
//       loadBatchesFromAPI();
//     }
//   }, [loadStudentsFromAPI, loadBatchesFromAPI, permissionsLoaded, canView, isSuperAdmin]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       setCurrentPage(1);
//       setPage(0);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const handleExport = async () => {
//     if (!canView) {
//       showNotification('You don\'t have permission to export', 'error');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/admin/students/export`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         responseType: 'blob'
//       });

//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
      
//       const contentDisposition = response.headers['content-disposition'];
//       let filename = 'students_export.csv';
//       if (contentDisposition) {
//         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//         if (filenameMatch && filenameMatch[1]) {
//           filename = filenameMatch[1].replace(/['"]/g, '');
//         }
//       }
      
//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       showNotification('Students exported successfully!', 'success');
//     } catch (error) {
//       console.error('Error exporting students:', error);
//       showNotification(error.response?.data?.message || 'Failed to export students', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImportSuccess = () => {
//     loadStudentsFromAPI();
//     showNotification('Students imported successfully!', 'success');
//   };

//   const handleAddStudent = (newStudent) => {
//     loadStudentsFromAPI();
//     showNotification('Student added successfully!', 'success');
//   };

//   const handleEditStudent = (updatedStudent) => {
//     loadStudentsFromAPI();
//     showNotification('Student updated successfully!', 'success');
//   };

//   const handleDeleteStudent = async (studentId) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${BASE_URL}/students/${studentId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       loadStudentsFromAPI();
//       showNotification('Student deleted successfully!', 'success');
//     } catch (error) {
//       console.error('Error deleting student:', error);
//       showNotification('Failed to delete student', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAssignBatch = (studentId, assignedBatches) => {
//     loadStudentsFromAPI();
//     loadBatchesFromAPI();
//     showNotification('Batches updated successfully!', 'success');
//   };

//   const handleBlockUnblock = (studentId, newStatus) => {
//     setStudents(prevStudents => 
//       prevStudents.map(student => 
//         student.id === studentId 
//           ? { ...student, is_blocked: newStatus ? 1 : 0 }
//           : student
//       )
//     );
//     loadStudentsFromAPI();
//     showNotification(`Student ${newStatus ? 'blocked' : 'unblocked'} successfully!`, 'success');
//   };

//   const handleRefresh = () => {
//     loadStudentsFromAPI();
//     loadBatchesFromAPI();
//     showNotification('Data refreshed successfully', 'success');
//   };

//   const handleSelectAll = (event) => {
//     if (!canDelete) return;
    
//     if (event.target.checked) {
//       setSelected(students.map(student => student.id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelect = (id) => {
//     if (!canDelete) return;
    
//     const selectedIndex = selected.indexOf(id);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else {
//       newSelected = selected.filter(item => item !== id);
//     }
//     setSelected(newSelected);
//   };

//   const handleBulkDelete = async () => {
//     if (!canDelete || selected.length === 0) return;
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const deletePromises = selected.map(id => 
//         axios.delete(`${BASE_URL}/students/${id}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       );
//       await Promise.all(deletePromises);
//       setSelected([]);
//       if (students.length === selected.length && currentPage > 1) {
//         setCurrentPage(prev => prev - 1);
//         setPage(prev => prev - 1);
//       } else {
//         loadStudentsFromAPI();
//       }
//       showNotification(`${selected.length} students deleted successfully`, 'success');
//     } catch (error) {
//       console.error('Error bulk deleting students:', error);
//       showNotification('Failed to delete some students', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     setCurrentPage(newPage + 1);
//     setSelected([]);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     const newRowsPerPage = parseInt(event.target.value, 10);
//     setRowsPerPage(newRowsPerPage);
//     setPage(0);
//     setCurrentPage(1);
//     setSelected([]);
//   };

//   const showNotification = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const getAvatarColor = (name) => {
//     const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
//     const charCode = name?.charCodeAt(0) || 0;
//     return colors[charCode % colors.length];
//   };

//   const getStudentInitials = (name) => {
//     if (!name) return 'S';
//     const words = name.split(' ');
//     if (words.length >= 2) {
//       return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
//     }
//     return name.substring(0, 2).toUpperCase();
//   };

//   // Show loading state while permissions are being fetched
//   if (!permissionsLoaded) {
//     return <LoadingState />;
//   }

//   // If user doesn't have view permission, show access denied
//   if (!canView && !isSuperAdmin) {
//     return <AccessDenied />;
//   }

//   return (
//     <Box>
//       <Box sx={{ mb: 2.5 }}>
//         <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
//           Student Management
//         </Typography>
//         <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
//           Manage and organize student information
//         </Typography>
//       </Box>

//       <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}` }}>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
//             <TextField
//               placeholder="Search by name, mobile, college, or department..."
//               size="small"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               sx={{ 
//                 width: { xs: '100%', sm: 360 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 1.5,
//                   fontSize: '0.75rem',
//                   '&:hover fieldset': {
//                     borderColor: COLORS.accent,
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
//                   </InputAdornment>
//                 ),
//                 sx: { 
//                   height: 36,
//                   bgcolor: COLORS.background.light,
//                   '& input': {
//                     padding: '6px 12px',
//                     fontSize: '0.75rem',
//                     color: COLORS.text.primary,
//                     '&::placeholder': {
//                       color: COLORS.text.tertiary,
//                       fontSize: '0.75rem'
//                     }
//                   }
//                 }
//               }}
//             />
//           </Stack>

//           <Stack direction="row" spacing={1.5} alignItems="center">
//             {/* Refresh Button */}
//             {/* <Tooltip title="Refresh">
//               <IconButton
//                 size="small"
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 sx={{
//                   color: COLORS.text.secondary,
//                   '&:hover': {
//                     bgcolor: `${COLORS.accent}20`
//                   }
//                 }}
//               >
//                 <RefreshIcon fontSize="small" />
//               </IconButton>
//             </Tooltip> */}

//             {/* Bulk Delete Button - Only show if user has delete permission */}
//             {canDelete && selected.length > 0 && (
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleBulkDelete}
//                 disabled={loading}
//                 sx={{ 
//                   height: 36, 
//                   borderRadius: 1.5, 
//                   textTransform: 'none', 
//                   fontSize: '0.75rem',
//                   fontWeight: 500,
//                   borderColor: '#fee2e2',
//                   color: '#991b1b',
//                   '&:hover': {
//                     borderColor: '#fecaca',
//                     bgcolor: '#fee2e2'
//                   }
//                 }}
//               >
//                 Delete ({selected.length})
//               </Button>
//             )}
            
//             {/* Import Button - Only show if user has create permission */}
//             {canCreate && (
//               <Button
//                 variant="outlined"
//                 startIcon={<ImportIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenImportDialog(true)}
//                 disabled={loading}
//                 sx={{ 
//                   height: 36, 
//                   borderRadius: 1.5, 
//                   textTransform: 'none', 
//                   fontSize: '0.75rem',
//                   fontWeight: 500
//                 }}
//               >
//                 Import
//               </Button>
//             )}

//             {/* Export Button - Only show if user has view permission */}
//             {canView && (
//               <Button
//                 variant="outlined"
//                 startIcon={<ExportIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={handleExport}
//                 disabled={loading}
//                 sx={{ 
//                   height: 36, 
//                   borderRadius: 1.5, 
//                   textTransform: 'none', 
//                   fontSize: '0.75rem',
//                   fontWeight: 500
//                 }}
//               >
//                 Export
//               </Button>
//             )}

//             {/* Add Student Button - Only show if user has create permission */}
//             {canCreate && (
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
//                 onClick={() => setOpenAddModal(true)}
//                 disabled={loading}
//                 sx={{ 
//                   height: 36, 
//                   borderRadius: 1.5, 
//                   bgcolor: COLORS.primary, 
//                   fontSize: '0.75rem', 
//                   textTransform: 'none',
//                   fontWeight: 500,
//                   boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//                   '&:hover': {
//                     bgcolor: COLORS.primaryDark,
//                   }
//                 }}
//               >
//                 Add Student
//               </Button>
//             )}
//           </Stack>
//         </Stack>
//       </Paper>

//       <Paper sx={{ 
//         width: '100%', 
//         borderRadius: 2, 
//         overflow: 'hidden',
//         boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
//         border: `1px solid ${COLORS.border}`
//       }}>
//         <TableContainer>
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ 
//                 bgcolor: COLORS.background.tableHeader,
//                 '& .MuiTableCell-root': {
//                   borderBottom: 'none',
//                   color: COLORS.text.light,
//                   py: 1.5
//                 }
//               }}>
//                 {/* Checkbox Column - Only show if user has delete permission */}
//                 {canDelete && (
//                   <TableCell padding="checkbox" sx={{ width: 40 }}>
//                     <Checkbox
//                       indeterminate={selected.length > 0 && selected.length < students.length}
//                       checked={students.length > 0 && selected.length === students.length}
//                       onChange={handleSelectAll}
//                       disabled={loading || students.length === 0}
//                       sx={{
//                         color: COLORS.text.light,
//                         '&.Mui-checked': {
//                           color: COLORS.text.light,
//                         },
//                         '&.MuiCheckbox-indeterminate': {
//                           color: COLORS.text.light,
//                         },
//                         '& .MuiSvgIcon-root': {
//                           fontSize: '1.25rem'
//                         }
//                       }}
//                     />
//                   </TableCell>
//                 )}
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Student Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Mobile Number
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   College Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Department Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Company Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Status
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light
//                 }}>
//                   Assigned Batches
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   fontSize: '0.7rem',
//                   letterSpacing: '0.5px',
//                   color: COLORS.text.light,
//                   width: 60
//                 }} align="center">
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
//                     <CircularProgress size={32} sx={{ color: COLORS.accent }} />
//                     <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading students...</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : students.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <PeopleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
//                       <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
//                         {searchTerm ? 'No students found' : 'No students available'}
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                         {searchTerm ? 'Try adjusting your search terms' : 'Add your first student to get started'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 students.map((student) => {
//                   const isSelected = selected.includes(student.id);
//                   const avatarColor = getAvatarColor(student.name);
//                   const batchCount = student.batches?.length || 0;
//                   const isBlocked = student.is_blocked === 1;

//                   return (
//                     <TableRow
//                       key={student.id}
//                       hover
//                       selected={isSelected}
//                       sx={{ 
//                         bgcolor: isBlocked ? `${COLORS.text.tertiary}10` : COLORS.background.white,
//                         '&:hover': {
//                           bgcolor: COLORS.background.hover
//                         },
//                         '&.Mui-selected': {
//                           bgcolor: `${COLORS.accent}10`,
//                           '&:hover': {
//                             bgcolor: `${COLORS.accent}20`
//                           }
//                         },
//                         '& .MuiTableCell-root': {
//                           py: 1.5,
//                           fontSize: '0.75rem',
//                           borderColor: COLORS.border
//                         }
//                       }}
//                     >
//                       {canDelete && (
//                         <TableCell padding="checkbox" sx={{ width: 40 }}>
//                           <Checkbox 
//                             checked={isSelected} 
//                             onChange={() => handleSelect(student.id)} 
//                             sx={{
//                               color: COLORS.accent,
//                               '&.Mui-checked': {
//                                 color: COLORS.accent,
//                               },
//                               '& .MuiSvgIcon-root': {
//                                 fontSize: '1.25rem'
//                               }
//                             }}
//                           />
//                         </TableCell>
//                       )}
//                       <TableCell>
//                         <Stack direction="row" spacing={1.5} alignItems="center">
//                           <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
//                             {getStudentInitials(student.name)}
//                           </Avatar>
//                           <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
//                             {student.name}
//                           </Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <PhoneIcon sx={{ fontSize: 14, color: COLORS.text.tertiary }} />
//                           <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.mobile}</Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.collegeName}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.departmentName}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, fontWeight: 500 }}>
//                           {student.company_name || '-'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <StudentStatusChip isBlocked={isBlocked} blockReason={student.block_reason} />
//                       </TableCell>
//                       <TableCell>
//                         <BatchStatusChip batches={student.batches} />
//                         {batchCount > 0 && (
//                           <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
//                             {student.batches.map(b => `Batch #${b.id}`).join(', ')}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell align="center">
//                         <ActionMenu 
//                           student={student}
//                           onView={(s) => { setSelectedStudent(s); setOpenViewModal(true); }}
//                           onEdit={(s) => { setSelectedStudent(s); setOpenEditModal(true); }}
//                           onDelete={(s) => { setSelectedStudent(s); setOpenDeleteDialog(true); }}
//                           onAssignBatch={(s) => { setSelectedStudent(s); setOpenAssignBatchDialog(true); }}
//                           onBlockUnblock={(s) => { setSelectedStudent(s); setOpenBlockUnblockDialog(true); }}
//                           canView={canView}
//                           canUpdate={canUpdate}
//                           canDelete={canDelete}
//                           canCreate={canCreate}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={totalCount}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{
//             borderTop: `1px solid ${COLORS.border}`,
//             '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
//               fontSize: '0.7rem',
//               color: COLORS.text.secondary
//             },
//             '& .MuiTablePagination-select': {
//               fontSize: '0.7rem'
//             },
//             '& .MuiTablePagination-actions button': {
//               color: COLORS.accent,
//             }
//           }}
//         />
//       </Paper>

//       {/* Modal Components - Only render if user has appropriate permissions */}
//       {canCreate && (
//         <AddStudent open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddStudent} />
//       )}

//       {selectedStudent && (
//         <>
//           {canUpdate && (
//             <EditStudent 
//               open={openEditModal}
//               onClose={() => { setOpenEditModal(false); setSelectedStudent(null); }}
//               student={selectedStudent}
//               onUpdate={handleEditStudent}
//             />
//           )}

//           <ViewStudent 
//             open={openViewModal}
//             onClose={() => { setOpenViewModal(false); setSelectedStudent(null); }}
//             student={selectedStudent}
//             onEdit={() => { setOpenViewModal(false); setOpenEditModal(true); }}
//           />

//           {canDelete && (
//             <DeleteStudent 
//               open={openDeleteDialog}
//               onClose={() => { setOpenDeleteDialog(false); setSelectedStudent(null); }}
//               student={selectedStudent}
//               onDelete={handleDeleteStudent}
//             />
//           )}

//           {/* Block/Unblock Dialog - Pass both permissions */}
//           <BlockUnblockDialog 
//             open={openBlockUnblockDialog}
//             onClose={() => { setOpenBlockUnblockDialog(false); setSelectedStudent(null); }}
//             student={selectedStudent}
//             onBlockUnblock={handleBlockUnblock}
//             canDelete={canDelete}
//             canCreate={canCreate}
//           />
//         </>
//       )}

//       {canCreate && (
//         <AssignBatchDialog 
//           open={openAssignBatchDialog}
//           onClose={() => { setOpenAssignBatchDialog(false); setSelectedStudent(null); }}
//           student={selectedStudent}
//           batches={batches}
//           onAssign={handleAssignBatch}
//         />
//       )}

//       {canCreate && (
//         <ImportDialog 
//           open={openImportDialog}
//           onClose={() => { setOpenImportDialog(false); setSelectedStudent(null); }}
//           onImport={handleImportSuccess}
//         />
//       )}

//       <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         <Alert 
//           onClose={() => setSnackbar({...snackbar, open: false})} 
//           severity={snackbar.severity} 
//           variant="filled"
//           sx={{ 
//             width: '100%',
//             borderRadius: 1.5,
//             fontSize: '0.75rem',
//             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//             '& .MuiAlert-icon': {
//               fontSize: '1.25rem'
//             }
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default StudentManagement;



import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
  TablePagination,
  Checkbox,
  Stack,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  List,
  ListItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  FileDownload as ImportIcon,
  FileUpload as ExportIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle, Lock, LockOpen } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';

// Import modal components
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import ViewStudent from './ViewStudent';
import DeleteStudent from './DeleteStudent';

// Color constants
const COLORS = {
  primary: '#0F172A',
  primaryLight: '#1E293B',
  primaryDark: '#0A0F1E',
  accent: '#00AEED',
  text: {
    primary: '#424347',
    secondary: '#6B7280',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC',
    hover: '#F1F5F9',
    tableHeader: '#0F172A'
  },
  border: '#E2E8F0'
};

// Loading state component
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
    <CircularProgress size={40} sx={{ color: COLORS.primary }} />
  </Box>
);

// Access Denied component
const AccessDenied = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <PeopleIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
    <Typography variant="h6" sx={{ color: COLORS.text.primary, mb: 1, fontWeight: 600 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Block/Unblock Dialog Component with permission checks
const BlockUnblockDialog = ({ open, onClose, student, onBlockUnblock, canDelete, canCreate }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isBlocked = student?.is_blocked === 1;

  // Check permission based on action
  // Block requires DELETE permission, Unblock requires CREATE permission
  const hasPermission = isBlocked ? canCreate : canDelete;

  useEffect(() => {
    if (open && student) {
      setReason('');
      setError('');
    }
  }, [open, student]);

  const handleSubmit = async () => {
    if (!hasPermission) {
      setError(`You don't have permission to ${isBlocked ? 'unblock' : 'block'} this student`);
      return;
    }

    if (!isBlocked && !reason.trim()) {
      setError('Please provide a reason for blocking');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const endpoint = isBlocked 
        ? `${BASE_URL}/student/unblock`
        : `${BASE_URL}/student/block`;
      
      const response = await axios.post(endpoint, {
        student_id: student.id,
        reason: reason.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.message) {
        onBlockUnblock(student.id, !isBlocked);
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} student. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {isBlocked ? (
            <LockOpen sx={{ color: '#10B981' }} />
          ) : (
            <Lock sx={{ color: '#EF4444' }} />
          )}
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
            {isBlocked ? 'Unblock Student' : 'Block Student'}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Student Information
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
              {student?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              {student?.mobile}
            </Typography>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {!isBlocked && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1 }}>
                Block Reason <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter reason for blocking this student..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={error && !reason.trim()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                  }
                }}
              />
            </Box>
          )}

          {!isBlocked && (
            <Alert severity="warning" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              Blocking this student will prevent them from accessing the application and joining sessions.
            </Alert>
          )}

          {isBlocked && student?.block_reason && (
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Previously blocked for:
              </Typography>
              <Typography variant="body2">{student.block_reason}</Typography>
            </Alert>
          )}

          {/* Permission warning if user doesn't have required permission */}
          {!hasPermission && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              You don't have permission to {isBlocked ? 'unblock' : 'block'} this student. 
              {isBlocked ? 'Unblock requires CREATE permission.' : 'Block requires DELETE permission.'}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || (!isBlocked && !reason.trim()) || !hasPermission}
          startIcon={loading ? <CircularProgress size={16} /> : (isBlocked ? <LockOpen /> : <Lock />)}
          sx={{
            bgcolor: isBlocked ? '#10B981' : '#EF4444',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              bgcolor: isBlocked ? '#059669' : '#DC2626'
            }
          }}
        >
          {loading ? (isBlocked ? 'Unblocking...' : 'Blocking...') : (isBlocked ? 'Unblock Student' : 'Block Student')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Assign Batch Dialog Component
const AssignBatchDialog = ({ open, onClose, student, batches, onAssign }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedBatches, setAssignedBatches] = useState(student?.batches || []);

  useEffect(() => {
    if (student) {
      setAssignedBatches(student.batches || []);
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
      setError('');
      setSuccess('');
    }
  }, [student]);

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAssign = async () => {
    if (!selectedBatch) {
      setError('Please select a batch');
      return;
    }

    if (!startDate) {
      setError('Please select start date');
      return;
    }

    if (assignedBatches.some(b => b.id === selectedBatch.id)) {
      setError('This batch is already assigned to the student');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/assign-batch`, {
        student_id: student.id,
        batch_id: selectedBatch.id,
        start_date: startDate
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.message) {
        // Fetch updated student data
        const studentResponse = await axios.get(`${BASE_URL}/students/${student.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (studentResponse.data && studentResponse.data.data) {
          const updatedBatches = studentResponse.data.data.batches || [];
          setAssignedBatches(updatedBatches);
          onAssign(student.id, updatedBatches);
          showNotification('Batch assigned successfully!', 'success');
          setSelectedBatch(null);
          setStartDate(new Date().toISOString().split('T')[0]);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error assigning batch:', err);
      const errorMessage = err.response?.data?.message || 'Failed to assign batch. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBatch = async (batchId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/unassign-batch/${student.id}/${batchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.status === true) {
        // Immediately remove the batch from UI
        const updatedBatches = assignedBatches.filter(batch => batch.id !== batchId);
        setAssignedBatches(updatedBatches);
        
        // Show success message
        showNotification(response.data.message || 'Batch unassigned successfully', 'success');
        
        // Notify parent component
        onAssign(student.id, updatedBatches);
      } else {
        throw new Error(response.data.message || 'Invalid response from server');
      }
    } catch (err) {
      console.error('Error removing batch:', err);
      const errorMessage = err.response?.data?.message || 'Failed to remove batch. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const availableBatches = batches.filter(
    batch => !assignedBatches.some(assigned => assigned.id === batch.id)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
          Manage Batches for {student?.name}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {/* Success Message */}
          {success && (
            <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {success}
            </Alert>
          )}
          
          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {assignedBatches.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
                Assigned Batches ({assignedBatches.length})
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                <List dense disablePadding>
                  {assignedBatches.map((batch, index) => (
                    <ListItem key={batch.id} divider={index < assignedBatches.length - 1} sx={{ py: 1.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {batch.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          📅 {batch.start_date} to {batch.end_date} | ⏰ {batch.start_time} - {batch.end_time}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveBatch(batch.id)} 
                        sx={{ 
                          color: '#EF4444',
                          '&:hover': {
                            bgcolor: '#FEE2E2'
                          }
                        }} 
                        disabled={loading}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {availableBatches.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
                Add New Batch
              </Typography>
              <Stack spacing={2}>
                <Autocomplete
                  fullWidth
                  options={availableBatches}
                  value={selectedBatch}
                  onChange={(event, newValue) => {
                    setSelectedBatch(newValue);
                    setError('');
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select batch by name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                        }
                      }}
                    />
                  )}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />

                <Button
                  variant="contained"
                  onClick={handleAssign}
                  disabled={loading || !selectedBatch || !startDate}
                  startIcon={loading ? <CircularProgress size={16} /> : <AssignmentIcon />}
                  sx={{
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: COLORS.accent,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: COLORS.primary }
                  }}
                >
                  {loading ? 'Assigning...' : 'Assign Batch'}
                </Button>
              </Stack>
            </Box>
          )}

          {availableBatches.length === 0 && assignedBatches.length > 0 && (
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              All available batches have been assigned to this student.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ student, onView, onEdit, onDelete, onAssignBatch, onBlockUnblock, canView, canUpdate, canDelete, canCreate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isBlocked = student?.is_blocked === 1;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check if there's ANY action available
  const hasAnyAction = canView || canUpdate || canDelete || canCreate;

  if (!hasAnyAction) {
    return null;
  }

  return (
    <>
      <Tooltip title="Actions">
        <IconButton 
          size="small" 
          onClick={handleClick} 
          sx={{ 
            color: COLORS.text.secondary,
            '&:hover': {
              bgcolor: `${COLORS.accent}20`
            }
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            mt: 1, 
            minWidth: 180, 
            borderRadius: 2, 
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {canView && (
          <MenuItem onClick={() => { onView(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>View Details</Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canUpdate && (
          <MenuItem onClick={() => { onEdit(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>Edit</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {canCreate && (
          <MenuItem onClick={() => { onAssignBatch(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>Manage Batches</Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Block Student - Only show if student is NOT blocked AND user has DELETE permission */}
        {!isBlocked && canDelete && (
          <MenuItem onClick={() => { onBlockUnblock(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <Lock fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#EF4444', fontSize: '0.75rem' }}>
                Block Student
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Unblock Student - Only show if student IS blocked AND user has CREATE permission */}
        {isBlocked && canCreate && (
          <MenuItem onClick={() => { onBlockUnblock(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <LockOpen fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                Unblock Student
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canUpdate || canCreate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
          <MenuItem onClick={() => { onDelete(student); handleClose(); }} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>Delete</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// Batch Status Chip Component
const BatchStatusChip = ({ batches }) => {
  const count = batches?.length || 0;
  
  if (count > 0) {
    return (
      <Chip
        label={`${count} Batch${count > 1 ? 'es' : ''} Assigned`}
        size="small"
        icon={<CheckCircle size={14} />}
        sx={{
          bgcolor: '#D1FAE5',
          color: '#10B981',
          fontSize: '0.65rem',
          fontWeight: 600,
          height: 24,
        }}
      />
    );
  }
  return (
    <Chip
      label="No Batch"
      size="small"
      icon={<XCircle size={14} />}
      sx={{
        bgcolor: '#FEE2E2',
        color: '#EF4444',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
      }}
    />
  );
};

// Student Status Chip Component
const StudentStatusChip = ({ isBlocked, blockReason }) => {
  if (isBlocked) {
    return (
      <Tooltip title={blockReason || 'No reason provided'}>
        <Chip
          label="Blocked"
          size="small"
          icon={<Lock size={14} />}
          sx={{
            bgcolor: '#FEE2E2',
            color: '#EF4444',
            fontSize: '0.65rem',
            fontWeight: 600,
            height: 24,
          }}
        />
      </Tooltip>
    );
  }
  return (
    <Chip
      label="Active"
      size="small"
      icon={<LockOpen size={14} />}
      sx={{
        bgcolor: '#D1FAE5',
        color: '#10B981',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
      }}
    />
  );
};

// Import Dialog Component
const ImportDialog = ({ open, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post(`${BASE_URL}/admin/students/import`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.message) {
        onImport();
        onClose();
        setSelectedFile(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error importing students:', err);
      const errorMessage = err.response?.data?.message || 'Failed to import students. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: `1px solid ${COLORS.border}`, pb: 2, mb: 2 }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: COLORS.text.primary }}>
          Import Students
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
            Please upload a CSV file
          </Alert>
          
          <Button
            variant="outlined"
            component="label"
            sx={{ height: 56, borderRadius: 1.5 }}
          >
            {selectedFile ? selectedFile.name : 'Choose CSV File'}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={loading || !selectedFile}
          startIcon={loading ? <CircularProgress size={16} /> : <ImportIcon />}
          sx={{
            bgcolor: COLORS.accent,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': { bgcolor: COLORS.primary }
          }}
        >
          {loading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // User permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignBatchDialog, setOpenAssignBatchDialog] = useState(false);
  const [openBlockUnblockDialog, setOpenBlockUnblockDialog] = useState(false);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch user permissions from API
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.data;
          setIsSuperAdmin(userData.is_super_admin || false);
          setUserPermissions(userData.permissions || []);
        }
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setUserPermissions([]);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchUserPermissions();
  }, []);

  // Helper to check permission
  const checkPermission = (action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, MODULES.STUDENT_MANAGEMENT, PAGES.STUDENT_MANAGEMENT, action);
  };

  // Permission checks
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  const loadBatchesFromAPI = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setBatches(response.data.data);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  }, []);

  const loadStudentsFromAPI = useCallback(async () => {
    if (!canView && !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      const response = await axios.get(`${BASE_URL}/students`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });

      if (response.data && response.data.data) {
        const transformedStudents = response.data.data.map(student => ({
          id: student.id,
          name: student.name,
          mobile: student.mobile,
          collegeId: student.college_id,
          collegeName: student.college?.name || 'Unknown College',
          departmentId: student.department_id,
          departmentName: student.department?.department_name || 'Unknown Department',
          image: student.image,
          batches: student.batches || [],
          createdAt: student.created_at,
          updatedAt: student.updated_at,
          is_blocked: student.is_blocked || 0,
          block_reason: student.block_reason,
          blocked_at: student.blocked_at,
          company_name: student.company_name || ''
        }));
        
        setStudents(transformedStudents);
        setTotalCount(response.data.total || 0);
      } else {
        setStudents([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      showNotification(error.response?.data?.message || 'Failed to load students', 'error');
      setStudents([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canView, isSuperAdmin]);

  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      loadStudentsFromAPI();
      loadBatchesFromAPI();
    }
  }, [loadStudentsFromAPI, loadBatchesFromAPI, permissionsLoaded, canView, isSuperAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleExport = async () => {
    if (!canView) {
      showNotification('You don\'t have permission to export', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/admin/students/export`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'students_export.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Students exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting students:', error);
      showNotification(error.response?.data?.message || 'Failed to export students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImportSuccess = () => {
    loadStudentsFromAPI();
    showNotification('Students imported successfully!', 'success');
  };

  const handleAddStudent = (newStudent) => {
    loadStudentsFromAPI();
    showNotification('Student added successfully!', 'success');
  };

  const handleEditStudent = (updatedStudent) => {
    loadStudentsFromAPI();
    showNotification('Student updated successfully!', 'success');
  };

  const handleDeleteStudent = async (studentId) => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${BASE_URL}/students/${studentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadStudentsFromAPI();
    showNotification('Student deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting student:', error);
    showNotification('Failed to delete student', 'error');
    throw error; // Re-throw so DeleteStudent can catch it and show its own error
  } finally {
    setLoading(false);
  }
};

  const handleAssignBatch = (studentId, assignedBatches) => {
    // Update local state for the specific student
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, batches: assignedBatches }
          : student
      )
    );
    showNotification('Batches updated successfully!', 'success');
  };

  const handleBlockUnblock = (studentId, newStatus) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, is_blocked: newStatus ? 1 : 0 }
          : student
      )
    );
    showNotification(`Student ${newStatus ? 'blocked' : 'unblocked'} successfully!`, 'success');
  };

  const handleRefresh = () => {
    loadStudentsFromAPI();
    loadBatchesFromAPI();
    showNotification('Data refreshed successfully', 'success');
  };

  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(students.map(student => student.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (!canDelete) return;
    
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(item => item !== id);
    }
    setSelected(newSelected);
  };

  // ✅ FIXED: handleBulkDelete - No longer calls loadStudentsFromAPI
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    const deletedIds = [...selected];
    const failedDeletes = [];
    
    try {
      const token = localStorage.getItem('token');
      
      // Delete each student individually
      for (const studentId of selected) {
        try {
          await axios.delete(`${BASE_URL}/students/${studentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (err) {
          console.error(`Failed to delete student ${studentId}:`, err);
          failedDeletes.push(studentId);
        }
      }
      
      // Update local state: remove successfully deleted students
      const successfullyDeleted = deletedIds.filter(id => !failedDeletes.includes(id));
      setStudents(prevStudents => prevStudents.filter(student => !successfullyDeleted.includes(student.id)));
      setTotalCount(prevCount => prevCount - successfullyDeleted.length);
      setSelected([]);
      
      if (failedDeletes.length > 0) {
        showNotification(`Deleted ${successfullyDeleted.length} students, failed to delete ${failedDeletes.length} students`, 'warning');
      } else {
        showNotification(`${selected.length} students deleted successfully`, 'success');
      }
      
      // If all students on current page were deleted and we're not on first page, go to previous page
      if (students.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error bulk deleting students:', error);
      showNotification('Failed to delete some students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  const showNotification = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const getStudentInitials = (name) => {
    if (!name) return 'S';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Show loading state while permissions are being fetched
  if (!permissionsLoaded) {
    return <LoadingState />;
  }

  // If user doesn't have view permission, show access denied
  if (!canView && !isSuperAdmin) {
    return <AccessDenied />;
  }

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.text.primary, mb: 0.5 }}>
          Student Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize student information
        </Typography>
      </Box>

      <Paper sx={{ p: 1.5, mb: 2.5, borderRadius: 2, bgcolor: COLORS.background.white, border: `1px solid ${COLORS.border}` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by name, mobile, college, or department..."
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ 
                width: { xs: '100%', sm: 360 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  fontSize: '0.75rem',
                  '&:hover fieldset': {
                    borderColor: COLORS.accent,
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  </InputAdornment>
                ),
                sx: { 
                  height: 36,
                  bgcolor: COLORS.background.light,
                  '& input': {
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: COLORS.text.primary,
                    '&::placeholder': {
                      color: COLORS.text.tertiary,
                      fontSize: '0.75rem'
                    }
                  }
                }
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Bulk Delete Button - Only show if user has delete permission */}
            {canDelete && selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
                disabled={loading}
                sx={{ 
                  height: 36, 
                  borderRadius: 1.5, 
                  textTransform: 'none', 
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderColor: '#fee2e2',
                  color: '#991b1b',
                  '&:hover': {
                    borderColor: '#fecaca',
                    bgcolor: '#fee2e2'
                  }
                }}
              >
                Delete ({selected.length})
              </Button>
            )}
            
            {/* Import Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="outlined"
                startIcon={<ImportIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenImportDialog(true)}
                disabled={loading}
                sx={{ 
                  height: 36, 
                  borderRadius: 1.5, 
                  textTransform: 'none', 
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                Import
              </Button>
            )}

            {/* Export Button - Only show if user has view permission */}
            {canView && (
              <Button
                variant="outlined"
                startIcon={<ExportIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleExport}
                disabled={loading}
                sx={{ 
                  height: 36, 
                  borderRadius: 1.5, 
                  textTransform: 'none', 
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}
              >
                Export
              </Button>
            )}

            {/* Add Student Button - Only show if user has create permission */}
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={() => setOpenAddModal(true)}
                disabled={loading}
                sx={{ 
                  height: 36, 
                  borderRadius: 1.5, 
                  bgcolor: COLORS.primary, 
                  fontSize: '0.75rem', 
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
              >
                Add Student
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                bgcolor: COLORS.background.tableHeader,
                '& .MuiTableCell-root': {
                  borderBottom: 'none',
                  color: COLORS.text.light,
                  py: 1.5
                }
              }}>
                {/* Checkbox Column - Only show if user has delete permission */}
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < students.length}
                      checked={students.length > 0 && selected.length === students.length}
                      onChange={handleSelectAll}
                      disabled={loading || students.length === 0}
                      sx={{
                        color: COLORS.text.light,
                        '&.Mui-checked': {
                          color: COLORS.text.light,
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: COLORS.text.light,
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.25rem'
                        }
                      }}
                    />
                  </TableCell>
                )}
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Mobile Number
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  College Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Department Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Company Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Assigned Batches
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light,
                  width: 60
                }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>Loading students...</Typography>
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No students found' : 'No students available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first student to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => {
                  const isSelected = selected.includes(student.id);
                  const avatarColor = getAvatarColor(student.name);
                  const batchCount = student.batches?.length || 0;
                  const isBlocked = student.is_blocked === 1;

                  return (
                    <TableRow
                      key={student.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isBlocked ? `${COLORS.text.tertiary}10` : COLORS.background.white,
                        '&:hover': {
                          bgcolor: COLORS.background.hover
                        },
                        '&.Mui-selected': {
                          bgcolor: `${COLORS.accent}10`,
                          '&:hover': {
                            bgcolor: `${COLORS.accent}20`
                          }
                        },
                        '& .MuiTableCell-root': {
                          py: 1.5,
                          fontSize: '0.75rem',
                          borderColor: COLORS.border
                        }
                      }}
                    >
                      {canDelete && (
                        <TableCell padding="checkbox" sx={{ width: 40 }}>
                          <Checkbox 
                            checked={isSelected} 
                            onChange={() => handleSelect(student.id)} 
                            sx={{
                              color: COLORS.accent,
                              '&.Mui-checked': {
                                color: COLORS.accent,
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: '1.25rem'
                              }
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: avatarColor, fontSize: '0.7rem', fontWeight: 600 }}>
                            {getStudentInitials(student.name)}
                          </Avatar>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                            {student.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon sx={{ fontSize: 14, color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.mobile}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.collegeName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>{student.departmentName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary, fontWeight: 500 }}>
                          {student.company_name || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StudentStatusChip isBlocked={isBlocked} blockReason={student.block_reason} />
                      </TableCell>
                      <TableCell>
                        <BatchStatusChip batches={student.batches} />
                        {batchCount > 0 && (
                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                            {student.batches.map(b => `Batch #${b.id}`).join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <ActionMenu 
                          student={student}
                          onView={(s) => { setSelectedStudent(s); setOpenViewModal(true); }}
                          onEdit={(s) => { setSelectedStudent(s); setOpenEditModal(true); }}
                          onDelete={(s) => { setSelectedStudent(s); setOpenDeleteDialog(true); }}
                          onAssignBatch={(s) => { setSelectedStudent(s); setOpenAssignBatchDialog(true); }}
                          onBlockUnblock={(s) => { setSelectedStudent(s); setOpenBlockUnblockDialog(true); }}
                          canView={canView}
                          canUpdate={canUpdate}
                          canDelete={canDelete}
                          canCreate={canCreate}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${COLORS.border}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.7rem',
              color: COLORS.text.secondary
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.7rem'
            },
            '& .MuiTablePagination-actions button': {
              color: COLORS.accent,
            }
          }}
        />
      </Paper>

      {/* Modal Components - Only render if user has appropriate permissions */}
      {canCreate && (
        <AddStudent open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddStudent} />
      )}

      {selectedStudent && (
        <>
          {canUpdate && (
            <EditStudent 
              open={openEditModal}
              onClose={() => { setOpenEditModal(false); setSelectedStudent(null); }}
              student={selectedStudent}
              onUpdate={handleEditStudent}
            />
          )}

          <ViewStudent 
            open={openViewModal}
            onClose={() => { setOpenViewModal(false); setSelectedStudent(null); }}
            student={selectedStudent}
            onEdit={() => { setOpenViewModal(false); setOpenEditModal(true); }}
          />

          {canDelete && (
            <DeleteStudent 
              open={openDeleteDialog}
              onClose={() => { setOpenDeleteDialog(false); setSelectedStudent(null); }}
              student={selectedStudent}
              onDelete={handleDeleteStudent}
            />
          )}

          {/* Block/Unblock Dialog - Pass both permissions */}
          <BlockUnblockDialog 
            open={openBlockUnblockDialog}
            onClose={() => { setOpenBlockUnblockDialog(false); setSelectedStudent(null); }}
            student={selectedStudent}
            onBlockUnblock={handleBlockUnblock}
            canDelete={canDelete}
            canCreate={canCreate}
          />
        </>
      )}

      {canCreate && (
        <AssignBatchDialog 
          open={openAssignBatchDialog}
          onClose={() => { setOpenAssignBatchDialog(false); setSelectedStudent(null); }}
          student={selectedStudent}
          batches={batches}
          onAssign={handleAssignBatch}
        />
      )}

      {canCreate && (
        <ImportDialog 
          open={openImportDialog}
          onClose={() => { setOpenImportDialog(false); setSelectedStudent(null); }}
          onImport={handleImportSuccess}
        />
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 1.5,
            fontSize: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;