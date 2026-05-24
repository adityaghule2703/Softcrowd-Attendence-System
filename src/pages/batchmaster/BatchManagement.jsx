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
  List,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  ListItemIcon as MuiListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Domain as DomainIcon,
  LocationOn as LocationOnIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Upload as UploadIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import axios from 'axios';
import BASE_URL from '../../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../utils/modulePermissions';

// Import modal components
import AddBatch from './AddBatch';
import EditBatch from './EditBatch';
import ViewBatch from './ViewBatch';
import DeleteBatch from './DeleteBatch';

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
    <ScheduleIcon sx={{ fontSize: 64, color: COLORS.text.tertiary, mb: 2 }} />
    <Typography variant="h6" sx={{ color: COLORS.text.primary, mb: 1, fontWeight: 600 }}>
      Access Denied
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
      You don't have permission to view this page. Please contact your administrator.
    </Typography>
  </Box>
);

// Document Viewer Dialog Component
const DocumentViewerDialog = ({ open, onClose, batch }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (open && batch) {
      setDocuments(batch.documents || []);
    }
  }, [open, batch]);

  const handleDownload = async (document) => {
    try {
      if (document.file_url) {
        window.open(document.file_url, '_blank');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type === 'pdf') {
      return <PictureAsPdfIcon sx={{ color: '#EF4444' }} />;
    } else if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif') {
      return <ImageIcon sx={{ color: '#10B981' }} />;
    } else if (type === 'xlsx' || type === 'xls' || type === 'csv') {
      return <TableChartIcon sx={{ color: '#F59E0B' }} />;
    } else {
      return <DescriptionIcon sx={{ color: COLORS.accent }} />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.tableHeader,
        color: COLORS.text.light,
        fontSize: '1rem',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AttachFileIcon />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Documents - {batch?.name}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <AttachFileIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 2 }} />
            <Typography sx={{ fontSize: '0.875rem', color: COLORS.text.secondary }}>
              No documents uploaded yet
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 1 }}>
              Use the upload option in actions menu to add documents
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%', bgcolor: COLORS.background.white }}>
            {documents.map((doc, index) => (
              <MuiListItem
                key={doc.id}
                divider={index < documents.length - 1}
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: COLORS.background.hover
                  }
                }}
                secondaryAction={
                  <Tooltip title="Download">
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDownload(doc)}
                      sx={{ color: COLORS.accent }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <MuiListItemIcon>
                  {getFileIcon(doc.file_type)}
                </MuiListItemIcon>
                <MuiListItemText
                  primary={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {doc.file_name}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                      Type: {doc.file_type?.toUpperCase() || 'Unknown'}
                    </Typography>
                  }
                />
              </MuiListItem>
            ))}
          </List>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button 
          onClick={onClose}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Upload Documents Dialog Component
const UploadDocumentsDialog = ({ open, onClose, batch, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  useEffect(() => {
    if (open && batch) {
      setUploadedDocuments(batch.documents || []);
    }
  }, [open, batch]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('batch_id', batch.id);
      formData.append('file', selectedFile);

      const response = await axios.post(`${BASE_URL}/batches/upload-document`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.message) {
        if (response.data.document) {
          setUploadedDocuments(prev => [...prev, response.data.document]);
        }
        
        setSelectedFile(null);
        if (onUploadComplete) {
          onUploadComplete(batch.id);
        }
        const fileInput = document.getElementById('file-upload-input');
        if (fileInput) fileInput.value = '';
        
        setError('');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload document. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      if (document.file_url) {
        window.open(document.file_url, '_blank');
      }
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/batches/documents/${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      if (onUploadComplete) {
        onUploadComplete(batch.id);
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type === 'pdf') {
      return <PictureAsPdfIcon sx={{ fontSize: 20, color: '#EF4444' }} />;
    } else if (type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'gif') {
      return <ImageIcon sx={{ fontSize: 20, color: '#10B981' }} />;
    } else if (type === 'xlsx' || type === 'xls' || type === 'csv') {
      return <TableChartIcon sx={{ fontSize: 20, color: '#F59E0B' }} />;
    } else {
      return <DescriptionIcon sx={{ fontSize: 20, color: COLORS.accent }} />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.tableHeader,
        color: COLORS.text.light,
        fontSize: '1rem',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <UploadIcon />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Upload Documents - {batch?.name}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.text.light }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5 }}>
              Upload New Document
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload-input"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AttachFileIcon />}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      borderColor: COLORS.border,
                      color: COLORS.text.primary,
                      '&:hover': {
                        borderColor: COLORS.accent,
                        bgcolor: `${COLORS.accent}10`
                      }
                  }}>
                    Select File
                  </Button>
                </label>
                {selectedFile && (
                  <Typography sx={{ mt: 1, fontSize: '0.75rem', color: COLORS.text.secondary }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </Typography>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.75rem' }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading || !selectedFile}
                startIcon={loading ? <CircularProgress size={16} /> : <UploadIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: COLORS.accent,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: COLORS.primary }
                }}
              >
                {loading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 1.5 }}>
              Uploaded Documents ({uploadedDocuments.length})
            </Typography>
            
            {uploadedDocuments.length === 0 ? (
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, textAlign: 'center', py: 3 }}>
                No documents uploaded yet
              </Typography>
            ) : (
              <List sx={{ width: '100%', bgcolor: COLORS.background.white }}>
                {uploadedDocuments.map((doc, index) => (
                  <MuiListItem
                    key={doc.id}
                    divider={index < uploadedDocuments.length - 1}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        bgcolor: COLORS.background.hover
                      }
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDownload(doc)}
                          sx={{ color: COLORS.accent }}
                          size="small"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteDocument(doc.id)}
                          sx={{ color: '#EF4444' }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <MuiListItemIcon>
                      {getFileIcon(doc.file_type)}
                    </MuiListItemIcon>
                    <MuiListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                          {doc.file_name}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          Type: {doc.file_type?.toUpperCase() || 'Unknown'}
                        </Typography>
                      }
                    />
                  </MuiListItem>
                ))}
              </List>
            )}
          </Paper>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// QR Code View Dialog Component
const QRViewDialog = ({ open, onClose, qrData, batchName }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.tableHeader,
        color: COLORS.text.light,
        fontSize: '1rem',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        QR Code - {batchName}
      </DialogTitle>
      <DialogContent sx={{ py: 4, textAlign: 'center' }}>
        {qrData && (
          <Stack spacing={3} alignItems="center">
            <Box
              component="img"
              src={qrData.qr_image_url}
              alt="QR Code"
              sx={{
                width: 280,
                height: 280,
                border: `2px solid ${COLORS.border}`,
                borderRadius: 2,
                p: 2,
                mx: 'auto'
              }}
            />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Expires at: {new Date(qrData.expires_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Remaining time: {Math.floor(qrData.remaining_time / 60)} minutes {Math.floor(qrData.remaining_time % 60)} seconds
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(qrData.qr_image_url, '_blank')}
              sx={{
                mt: 1,
                fontSize: '0.75rem',
                borderColor: COLORS.accent,
                color: COLORS.accent,
                '&:hover': {
                  borderColor: COLORS.primary,
                  bgcolor: `${COLORS.accent}10`
                }
              }}
            >
              Download QR Code
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: `1px solid ${COLORS.border}`, p: 2, justifyContent: 'center' }}>
        <Button 
          onClick={onClose}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none',
            color: COLORS.text.secondary
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Pause/Resume Dialog Component
const PauseResumeDialog = ({ open, onClose, batch, onTogglePause, canDelete, canCreate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isPaused = batch?.is_paused === 1;

  // Check permission based on action
  // Pause requires DELETE permission, Resume requires CREATE permission
  const hasPermission = isPaused ? canCreate : canDelete;

  const handleSubmit = async () => {
    if (!hasPermission) {
      setError(`You don't have permission to ${isPaused ? 'resume' : 'pause'} this batch`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/batches/toggle-pause/${batch.id}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.message !== undefined) {
        onTogglePause(batch.id, response.data.is_paused);
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error toggling batch pause status:', err);
      const errorMessage = err.response?.data?.message || `Failed to ${isPaused ? 'resume' : 'pause'} batch. Please try again.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`,
        bgcolor: isPaused ? COLORS.accent : '#EF4444',
        color: COLORS.text.light,
        fontSize: '1rem',
        fontWeight: 600,
        py: 2
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
            {isPaused ? 'Resume Batch' : 'Pause Batch'}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Batch Information
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
              {batch?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Domain: {batch?.domainName} | Trainer: {batch?.trainer}
            </Typography>
            {batch?.is_paused === 1 && (
              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary, mt: 1 }}>
                ⏸️ Currently Paused
              </Typography>
            )}
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5, 
                fontSize: '0.75rem',
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Alert 
            severity={isPaused ? "info" : "warning"} 
            sx={{ 
              borderRadius: 1.5, 
              fontSize: '0.75rem',
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
            {isPaused ? (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Resume this batch?
                </Typography>
                <Typography variant="body2">
                  Students will be able to join sessions and attendance tracking will resume.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Pause this batch?
                </Typography>
                <Typography variant="body2">
                  Students won't be able to join sessions and attendance won't be tracked while paused.
                  You can resume it anytime.
                </Typography>
              </>
            )}
          </Alert>

          {!hasPermission && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 1.5, 
                fontSize: '0.75rem',
                '& .MuiAlert-icon': {
                  fontSize: '1.25rem'
                }
              }}
            >
              You don't have permission to {isPaused ? 'resume' : 'pause'} this batch. 
              {isPaused ? 'Resume requires CREATE permission.' : 'Pause requires DELETE permission.'}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !hasPermission}
          startIcon={loading ? <CircularProgress size={16} /> : (isPaused ? <PlayArrowIcon /> : <PauseIcon />)}
          sx={{
            bgcolor: isPaused ? COLORS.accent : '#EF4444',
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              bgcolor: isPaused ? COLORS.primary : '#DC2626'
            }
          }}
        >
          {loading 
            ? (isPaused ? 'Resuming...' : 'Pausing...') 
            : (isPaused ? 'Resume Batch' : 'Pause Batch')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Switch Batch Dialog Component - Updated to fetch users with Trainer role
const SwitchBatchDialog = ({ open, onClose, batch, onSwitchComplete }) => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && batch) {
      fetchTrainers();
    }
  }, [open, batch]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch users from the users endpoint
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.success && response.data.data) {
        // Filter users where role name is 'Trainer' (case insensitive)
        const trainerUsers = response.data.data.filter(
          user => user.role && user.role.name && user.role.name.toLowerCase() === 'trainer'
        );
        
        // Transform user data to match the expected trainer format
        const transformedTrainers = trainerUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          is_active: user.is_active
        }));
        
        // Filter out the current batch's trainer
        const filteredTrainers = transformedTrainers.filter(
          trainer => trainer.id !== batch.trainer_id
        );
        
        setTrainers(filteredTrainers);
      } else {
        setTrainers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load trainers');
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTrainerId) {
      setError('Please select a trainer to switch to');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const requestBody = {
        from_trainer_id: batch.trainer_id,
        to_user_id: parseInt(selectedTrainerId),
        batch_id: batch.id
      };

      const response = await axios.post(`${BASE_URL}/trainer/switch-batch`, requestBody, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.message) {
        onSwitchComplete(batch.id, parseInt(selectedTrainerId));
        onClose();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error switching batch:', err);
      const errorMessage = err.response?.data?.message || 'Failed to switch batch. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentTrainerName = () => {
    if (batch && batch.trainer) {
      return batch.trainer;
    }
    return 'Unknown';
  };

  const getSelectedTrainerName = () => {
    const selected = trainers.find(t => t.id === parseInt(selectedTrainerId));
    return selected ? selected.name : '';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.tableHeader,
        color: COLORS.text.light,
        fontSize: '1rem',
        fontWeight: 600,
        py: 2
      }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SwapHorizIcon />
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Switch Batch Trainer
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 2, bgcolor: COLORS.background.light, borderRadius: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', color: COLORS.text.secondary, mb: 0.5 }}>
              Batch Information
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text.primary }}>
              {batch?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
              Domain: {batch?.domainName}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${COLORS.border}` }}>
              <Box>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  Current Trainer
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {getCurrentTrainerName()}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                  Batch Strength
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                  {batch?.strength} Students
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.accent, mb: 2 }}>
              Select New Trainer
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={32} sx={{ color: COLORS.accent }} />
              </Box>
            ) : (
              <FormControl fullWidth size="small">
                <InputLabel>Select Trainer</InputLabel>
                <Select
                  value={selectedTrainerId}
                  onChange={(e) => setSelectedTrainerId(e.target.value)}
                  label="Select Trainer"
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.75rem',
                    '& .MuiSelect-select': {
                      fontSize: '0.75rem'
                    }
                  }}
                >
                  {trainers.length === 0 ? (
                    <SelectMenuItem disabled value="">
                      <Typography sx={{ fontSize: '0.75rem' }}>
                        No other trainers available
                      </Typography>
                    </SelectMenuItem>
                  ) : (
                    trainers.map((trainer) => (
                      <SelectMenuItem key={trainer.id} value={trainer.id}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon sx={{ fontSize: 16, color: COLORS.accent }} />
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {trainer.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {trainer.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </SelectMenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}

            {selectedTrainerId && !loading && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2, 
                  borderRadius: 1.5, 
                  fontSize: '0.7rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1rem'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                  This batch will be transferred from <strong>{getCurrentTrainerName()}</strong> to <strong>{getSelectedTrainerName()}</strong>
                </Typography>
              </Alert>
            )}

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2,
                  borderRadius: 1.5, 
                  fontSize: '0.75rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1.25rem'
                  }
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>

          <Alert 
            severity="warning" 
            sx={{ 
              borderRadius: 1.5, 
              fontSize: '0.75rem',
              '& .MuiAlert-icon': {
                fontSize: '1.25rem'
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Important Note
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
              Switching the trainer will update all future sessions and attendance records for this batch to the new trainer.
              This action cannot be undone.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button 
          onClick={onClose}
          disabled={submitting}
          sx={{
            fontSize: '0.75rem',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !selectedTrainerId || loading}
          startIcon={submitting ? <CircularProgress size={16} /> : <SwapHorizIcon />}
          sx={{
            bgcolor: COLORS.accent,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              bgcolor: COLORS.primary
            }
          }}
        >
          {submitting ? 'Switching...' : 'Switch Trainer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component with permission checks
const ActionMenu = ({ batch, onView, onEdit, onDelete, onGenerateQR, onTogglePause, onUploadDocuments, onSwitchBatch, canView, canUpdate, canDelete, canCreate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isPaused = batch?.is_paused === 1;

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
          <MenuItem 
            onClick={() => {
              onView(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                View Details
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {canUpdate && (
          <MenuItem 
            onClick={() => {
              onEdit(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Edit
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Upload Documents - Requires CREATE permission */}
        {canCreate && (
          <MenuItem 
            onClick={() => {
              onUploadDocuments(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Upload Documents
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Switch Batch - Requires CREATE permission */}
        {canCreate && (
          <MenuItem 
            onClick={() => {
              onSwitchBatch(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <SwapHorizIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Switch Batch
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Generate QR - Requires CREATE permission */}
        {canCreate && (
          <MenuItem 
            onClick={() => {
              onGenerateQR(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
              <QrCodeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                Generate QR
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Pause Batch - Only show if batch is NOT paused AND user has DELETE permission */}
        {!isPaused && canDelete && (
          <MenuItem 
            onClick={() => {
              onTogglePause(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <PauseIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography 
                variant="body2" 
                fontWeight={500} 
                sx={{ 
                  color: '#EF4444', 
                  fontSize: '0.75rem' 
                }}
              >
                Pause Batch
              </Typography>
            </ListItemText>
          </MenuItem>
        )}

        {/* Resume Batch - Only show if batch IS paused AND user has CREATE permission */}
        {isPaused && canCreate && (
          <MenuItem 
            onClick={() => {
              onTogglePause(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
              <PlayArrowIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography 
                variant="body2" 
                fontWeight={500} 
                sx={{ 
                  color: '#10B981', 
                  fontSize: '0.75rem' 
                }}
              >
                Resume Batch
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
        
        {(canView || canUpdate || canCreate) && canDelete && <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />}
        
        {canDelete && (
          <MenuItem 
            onClick={() => {
              onDelete(batch);
              handleClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                Delete
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

// Batch Status Chip Component
const BatchStatusChip = ({ isPaused }) => {
  if (isPaused) {
    return (
      <Chip
        label="Paused"
        size="small"
        icon={<PauseIcon sx={{ fontSize: 14 }} />}
        sx={{
          bgcolor: '#FEF3C7',
          color: '#D97706',
          fontSize: '0.65rem',
          fontWeight: 600,
          height: 24,
          '& .MuiChip-label': { px: 1.5 },
          '& .MuiChip-icon': { color: '#D97706', marginLeft: '6px', fontSize: 14 }
        }}
      />
    );
  }
  return (
    <Chip
      label="Active"
      size="small"
      icon={<PlayArrowIcon sx={{ fontSize: 14 }} />}
      sx={{
        bgcolor: '#D1FAE5',
        color: '#10B981',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        '& .MuiChip-label': { px: 1.5 },
        '& .MuiChip-icon': { color: '#10B981', marginLeft: '6px', fontSize: 14 }
      }}
    />
  );
};

const BatchManagement = () => {
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

  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPauseResumeDialog, setOpenPauseResumeDialog] = useState(false);
  const [openUploadDocumentsDialog, setOpenUploadDocumentsDialog] = useState(false);
  const [openDocumentViewerDialog, setOpenDocumentViewerDialog] = useState(false);
  const [openSwitchBatchDialog, setOpenSwitchBatchDialog] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // QR Dialog states
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedQRData, setSelectedQRData] = useState(null);

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
    return hasPermission(userPermissions, MODULES.BATCH_MANAGEMENT, PAGES.BATCH_MANAGEMENT, action);
  };

  // Permission checks
  const canView = checkPermission(ACTIONS.VIEW);
  const canCreate = checkPermission(ACTIONS.CREATE);
  const canUpdate = checkPermission(ACTIONS.UPDATE);
  const canDelete = checkPermission(ACTIONS.DELETE);

  // Load batches from API with pagination and search
  const loadBatchesFromAPI = useCallback(async () => {
    if (!canView && !isSuperAdmin) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data && response.data.data) {
        const transformedBatches = response.data.data.map(batch => ({
          id: batch.id,
          name: batch.name || batch.domain?.name || 'Unnamed Batch',
          domainId: batch.domain_id,
          domainName: batch.domain?.name || 'Unknown Domain',
          startDate: batch.start_date,
          endDate: batch.end_date,
          startTime: batch.start_time,
          endTime: batch.end_time,
          strength: batch.strength,
          trainer: batch.trainer_name,
          trainer_id: batch.trainer_id,
          latitude: batch.latitude,
          longitude: batch.longitude,
          radius: batch.radius,
          createdAt: batch.created_at,
          updatedAt: batch.updated_at,
          qr: batch.qr,
          is_paused: batch.is_paused || 0,
          documents: batch.documents || []
        }));
        
        setBatches(transformedBatches);
        setTotalCount(response.data.total || 0);
        setLastPage(response.data.last_page || 1);
      } else {
        setBatches([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
      showNotification(error.response?.data?.message || 'Failed to load batches', 'error');
      setBatches([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm, canView, isSuperAdmin]);

  // Load batches when dependencies change
  useEffect(() => {
    if (permissionsLoaded && (canView || isSuperAdmin)) {
      loadBatchesFromAPI();
    }
  }, [loadBatchesFromAPI, permissionsLoaded, canView, isSuperAdmin]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle add batch
  const handleAddBatch = (newBatch) => {
    loadBatchesFromAPI();
    showNotification('Batch added successfully!', 'success');
  };

  // Handle edit batch
  const handleEditBatch = (updatedBatch) => {
    loadBatchesFromAPI();
    showNotification('Batch updated successfully!', 'success');
  };

  // Handle delete batch
  const handleDeleteBatch = async (batchId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/batches/${batchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      loadBatchesFromAPI();
      showNotification('Batch deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting batch:', error);
      showNotification('Failed to delete batch', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle pause/resume
  const handleTogglePause = (batchId, newPauseStatus) => {
    setBatches(prevBatches => 
      prevBatches.map(batch => 
        batch.id === batchId 
          ? { ...batch, is_paused: newPauseStatus ? 1 : 0 }
          : batch
      )
    );
    loadBatchesFromAPI();
    showNotification(`Batch ${newPauseStatus ? 'paused' : 'resumed'} successfully!`, 'success');
  };

  // Handle switch batch
  const handleSwitchBatch = (batchId, newTrainerId) => {
    loadBatchesFromAPI();
    showNotification('Batch switched successfully!', 'success');
  };

  // Handle upload documents
  const handleUploadDocuments = (batch) => {
    setSelectedBatch(batch);
    setOpenUploadDocumentsDialog(true);
  };

  // Handle view documents
  const handleViewDocuments = (batch) => {
    setSelectedBatch(batch);
    setOpenDocumentViewerDialog(true);
  };

  // Handle switch batch
  const handleSwitchBatchClick = (batch) => {
    setSelectedBatch(batch);
    setOpenSwitchBatchDialog(true);
  };

  // Handle upload complete
  const handleUploadComplete = (batchId) => {
    showNotification('Document uploaded successfully!', 'success');
    loadBatchesFromAPI();
  };

  // Handle Generate QR
  const handleGenerateQR = async (batch) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/qr-generate`, 
        { batch_id: batch.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status) {
        setBatches(prevBatches => 
          prevBatches.map(b => 
            b.id === batch.id 
              ? { ...b, qr: response.data.data }
              : b
          )
        );
        
        showNotification(
          response.data.message || 'QR generated successfully!',
          'success'
        );
      } else {
        showNotification(response.data?.message || 'Failed to generate QR', 'error');
      }
    } catch (error) {
      console.error('Error generating QR:', error);
      showNotification(
        error.response?.data?.message || 'Failed to generate QR code',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle view QR
  const handleViewQR = (qrData, batch) => {
    setSelectedBatch(batch);
    setSelectedQRData(qrData);
    setOpenQRDialog(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadBatchesFromAPI();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle select all on current page
  const handleSelectAll = (event) => {
    if (!canDelete) return;
    
    if (event.target.checked) {
      setSelected(batches.map(batch => batch.id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection
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

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!canDelete || selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const deletePromises = selected.map(id => 
        axios.delete(`${BASE_URL}/batches/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(deletePromises);
      
      setSelected([]);
      
      if (batches.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        loadBatchesFromAPI();
      }
      
      showNotification(`${selected.length} batches deleted successfully`, 'success');
    } catch (error) {
      console.error('Error bulk deleting batches:', error);
      showNotification('Failed to delete some batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCurrentPage(newPage + 1);
    setSelected([]);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setCurrentPage(1);
    setSelected([]);
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Get avatar color based on batch name
  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get batch initials
  const getBatchInitials = (name) => {
    if (!name) return 'B';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format time (remove seconds if present)
  const formatTime = (time) => {
    if (!time) return '-';
    if (time.includes(':')) {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      {/* Page Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            color: COLORS.text.primary,
            mb: 0.5
          }}
        >
          Batch Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize batch schedules
        </Typography>
      </Box>

      {/* Action Bar */}
      <Paper sx={{ 
        p: 1.5, 
        mb: 2.5, 
        borderRadius: 2,
        bgcolor: COLORS.background.white,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        border: `1px solid ${COLORS.border}`
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
            <TextField
              placeholder="Search by batch name, domain, trainer..."
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

          {/* Action Buttons */}
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
            
            {/* Refresh Button */}
            {/* <Button
              variant="outlined"
              startIcon={<RefreshIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ 
                height: 36,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderColor: COLORS.border,
                color: COLORS.text.secondary,
                '&:hover': {
                  borderColor: COLORS.accent,
                  color: COLORS.accent,
                  bgcolor: `${COLORS.accent}10`
                }
              }}
            >
              Refresh
            </Button> */}

            {/* Add Batch Button - Only show if user has create permission */}
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
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: COLORS.primaryDark,
                  }
                }}
              >
                Add Batch
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Batches Table */}
      <Paper sx={{ 
        width: '100%', 
        borderRadius: 2, 
        overflow: 'auto',
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
                {canDelete && (
                  <TableCell padding="checkbox" sx={{ width: 40 }}>
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < batches.length}
                      checked={batches.length > 0 && selected.length === batches.length}
                      onChange={handleSelectAll}
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
                  Batch Details
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Duration & Time
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Strength & Trainer
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
                  Location
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Documents
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light,
                  width: 100
                }}>
                  QR Code
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
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading batches...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canDelete ? 9 : 8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <ScheduleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No batches found' : 'No batches available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first batch to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => {
                  const isSelected = selected.includes(batch.id);
                  const avatarColor = getAvatarColor(batch.name);
                  const hasLocation = batch.latitude && batch.longitude;
                  const hasQR = batch.qr && batch.qr.qr_image_url;
                  const isPaused = batch.is_paused === 1;
                  const documentCount = batch.documents?.length || 0;

                  return (
                    <TableRow
                      key={batch.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: isPaused ? `${COLORS.text.tertiary}10` : COLORS.background.white,
                        opacity: isPaused ? 0.85 : 1,
                        '&:hover': {
                          bgcolor: isPaused ? `${COLORS.text.tertiary}20` : COLORS.background.hover
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
                            onChange={() => handleSelect(batch.id)}
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
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              opacity: isPaused ? 0.7 : 1
                            }}
                          >
                            {getBatchInitials(batch.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {batch.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              <DomainIcon sx={{ fontSize: 10, mr: 0.5, verticalAlign: 'middle' }} />
                              {batch.domainName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                            📅 {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <ScheduleIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                              {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <GroupIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                              {batch.strength} Students
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.primary }}>
                              {batch.trainer}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <BatchStatusChip isPaused={isPaused} />
                      </TableCell>
                      <TableCell>
                        {hasLocation ? (
                          <Stack spacing={0.5}>
                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.secondary }}>
                              Geo-fenced: Yes
                            </Typography>
                            {batch.radius && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                Radius: {batch.radius}m
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            No location set
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<AttachFileIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleViewDocuments(batch)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            color: COLORS.accent,
                            '&:hover': {
                              bgcolor: `${COLORS.accent}10`,
                              color: COLORS.primary
                            }
                          }}
                        >
                          View Documents {documentCount > 0 && `(${documentCount})`}
                        </Button>
                      </TableCell>
                      <TableCell sx={{ width: 100 }}>
                        {hasQR ? (
                          <Box 
                            onClick={() => handleViewQR(batch.qr, batch)}
                            sx={{ 
                              cursor: 'pointer',
                              display: 'inline-block',
                              '&:hover': {
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                                transition: 'all 0.2s ease'
                              }
                            }}
                          >
                            <img 
                              src={batch.qr.qr_image_url} 
                              alt="QR Code"
                              style={{
                                width: 60,
                                height: 60,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 8,
                                padding: 4,
                                backgroundColor: COLORS.background.white,
                                opacity: isPaused ? 0.7 : 1
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                            Not generated
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          batch={batch}
                          onView={(b) => { setSelectedBatch(b); setOpenViewModal(true); }}
                          onEdit={(b) => { setSelectedBatch(b); setOpenEditModal(true); }}
                          onDelete={(b) => { setSelectedBatch(b); setOpenDeleteDialog(true); }}
                          onGenerateQR={handleGenerateQR}
                          onTogglePause={(b) => { setSelectedBatch(b); setOpenPauseResumeDialog(true); }}
                          onUploadDocuments={(b) => { handleUploadDocuments(b); }}
                          onSwitchBatch={(b) => { handleSwitchBatchClick(b); }}
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

        {/* Pagination */}
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
        <AddBatch 
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAdd={handleAddBatch}
        />
      )}

      {selectedBatch && (
        <>
          {canUpdate && (
            <EditBatch 
              open={openEditModal}
              onClose={() => {
                setOpenEditModal(false);
                setSelectedBatch(null);
              }}
              batch={selectedBatch}
              onUpdate={handleEditBatch}
            />
          )}

          <ViewBatch 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedBatch(null);
            }}
            batch={selectedBatch}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          {canDelete && (
            <DeleteBatch 
              open={openDeleteDialog}
              onClose={() => {
                setOpenDeleteDialog(false);
                setSelectedBatch(null);
              }}
              batch={selectedBatch}
              onDelete={handleDeleteBatch}
            />
          )}

          {/* Pause/Resume Dialog - Pass both permissions */}
          <PauseResumeDialog 
            open={openPauseResumeDialog}
            onClose={() => {
              setOpenPauseResumeDialog(false);
              setSelectedBatch(null);
            }}
            batch={selectedBatch}
            onTogglePause={handleTogglePause}
            canDelete={canDelete}
            canCreate={canCreate}
          />

          {/* Upload Documents - Requires CREATE permission */}
          {canCreate && (
            <UploadDocumentsDialog 
              open={openUploadDocumentsDialog}
              onClose={() => {
                setOpenUploadDocumentsDialog(false);
                setSelectedBatch(null);
              }}
              batch={selectedBatch}
              onUploadComplete={handleUploadComplete}
            />
          )}

          <DocumentViewerDialog 
            open={openDocumentViewerDialog}
            onClose={() => {
              setOpenDocumentViewerDialog(false);
              setSelectedBatch(null);
            }}
            batch={selectedBatch}
          />

          {/* Switch Batch - Requires CREATE permission */}
          {canCreate && (
            <SwitchBatchDialog 
              open={openSwitchBatchDialog}
              onClose={() => {
                setOpenSwitchBatchDialog(false);
                setSelectedBatch(null);
              }}
              batch={selectedBatch}
              onSwitchComplete={handleSwitchBatch}
            />
          )}
        </>
      )}

      {/* QR Code View Dialog */}
      <QRViewDialog 
        open={openQRDialog}
        onClose={() => {
          setOpenQRDialog(false);
          setSelectedQRData(null);
          setSelectedBatch(null);
        }}
        qrData={selectedQRData}
        batchName={selectedBatch?.name}
      />

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
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

export default BatchManagement;