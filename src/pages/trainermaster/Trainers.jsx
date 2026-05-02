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
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config/Config';

// Import modal components
import AddTrainer from './AddTrainer';
import EditTrainer from './EditTrainer';
import ViewTrainer from './ViewTrainer';
import DeleteTrainer from './DeleteTrainer';

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

// Assign Batch Dialog Component
const AssignBatchDialog = ({ open, onClose, trainer, batches, onAssign }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignedBatches, setAssignedBatches] = useState(trainer?.batches || []);

  useEffect(() => {
    if (trainer) {
      setAssignedBatches(trainer.batches || []);
    }
  }, [trainer]);

  const handleAssign = async () => {
    if (!selectedBatch) {
      setError('Please select a batch');
      return;
    }

    if (assignedBatches.some(b => b.id === selectedBatch.id)) {
      setError('This batch is already assigned to the trainer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/assign-trainer-batch`, {
        trainer_id: trainer.id,
        batch_id: selectedBatch.id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        const updatedBatches = [...assignedBatches, selectedBatch];
        setAssignedBatches(updatedBatches);
        onAssign(trainer.id, updatedBatches);
        setSelectedBatch(null);
      }
    } catch (err) {
      console.error('Error assigning batch:', err);
      setError(err.response?.data?.message || 'Failed to assign batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBatch = async (batchId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/assign-trainer-batch/${batchId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        data: { trainer_id: trainer.id }
      });

      const updatedBatches = assignedBatches.filter(b => b.id !== batchId);
      setAssignedBatches(updatedBatches);
      onAssign(trainer.id, updatedBatches);
    } catch (err) {
      console.error('Error removing batch:', err);
      setError(err.response?.data?.message || 'Failed to remove batch. Please try again.');
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
          Manage Batches for {trainer?.name}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {assignedBatches.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
                Assigned Batches
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                <List dense disablePadding>
                  {assignedBatches.map((batch, index) => (
                    <ListItem
                      key={batch.id}
                      divider={index < assignedBatches.length - 1}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          Batch #{batch.id} - {batch.trainer_name || batch.domain?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          📅 {batch.start_date} to {batch.end_date} | ⏰ {batch.start_time} - {batch.end_time}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveBatch(batch.id)}
                        sx={{ color: '#EF4444' }}
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

          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.secondary, mb: 1.5 }}>
              Add New Batch
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Autocomplete
                  fullWidth
                  options={availableBatches}
                  value={selectedBatch}
                  onChange={(event, newValue) => {
                    setSelectedBatch(newValue);
                    setError('');
                  }}
                  getOptionLabel={(option) => `Batch #${option.id} - ${option.trainer_name || option.domain?.name}`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Search and select batch"
                      error={!!error}
                      helperText={error}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          '&:hover fieldset': { borderColor: COLORS.accent },
                          '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: 1 }
                        }
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
                          Batch #{option.id} - {option.trainer_name || option.domain?.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                          📅 {option.start_date} to {option.end_date} | ⏰ {option.start_time} - {option.end_time}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleAssign}
                disabled={loading || !selectedBatch}
                startIcon={loading ? <CircularProgress size={16} /> : <AssignmentIcon />}
                sx={{
                  height: 40,
                  minWidth: 100,
                  borderRadius: 1.5,
                  bgcolor: COLORS.accent,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: COLORS.primary }
                }}
              >
                {loading ? 'Adding...' : 'Add Batch'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, borderTop: `1px solid ${COLORS.border}`, pt: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Action Menu Component
const ActionMenu = ({ trainer, onView, onEdit, onDelete, onAssignBatch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <MenuItem 
          onClick={() => {
            onView(trainer);
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
        
        <MenuItem 
          onClick={() => {
            onEdit(trainer);
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

        <MenuItem 
          onClick={() => {
            onAssignBatch(trainer);
            handleClose();
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon sx={{ color: COLORS.accent, minWidth: 36 }}>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
              Manage Batches
            </Typography>
          </ListItemText>
        </MenuItem>
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(trainer);
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
      </Menu>
    </>
  );
};

// Batch Chip Component
const BatchChip = ({ batches }) => {
  const count = batches?.length || 0;
  
  if (count === 0) {
    return (
      <Chip
        label="No Batches"
        size="small"
        icon={<XCircle size={14} />}
        sx={{
          bgcolor: '#FEE2E2',
          color: '#EF4444',
          fontSize: '0.65rem',
          fontWeight: 600,
          height: 24,
          '& .MuiChip-label': { px: 1.5 },
          '& .MuiChip-icon': { color: '#EF4444', marginLeft: '6px' }
        }}
      />
    );
  }
  
  return (
    <Chip
      label={`${count} Batch${count > 1 ? 'es' : ''}`}
      size="small"
      icon={<CheckCircle size={14} />}
      sx={{
        bgcolor: '#D1FAE5',
        color: '#10B981',
        fontSize: '0.65rem',
        fontWeight: 600,
        height: 24,
        '& .MuiChip-label': { px: 1.5 },
        '& .MuiChip-icon': { color: '#10B981', marginLeft: '6px' }
      }}
    />
  );
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
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

  // Server-side pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignBatchDialog, setOpenAssignBatchDialog] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Load batches from API
  const loadBatchesFromAPI = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/batches`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data && response.data.data) {
        setBatches(response.data.data);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  }, []);

  // Load trainers from API with pagination and search
  const loadTrainersFromAPI = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {
        page: currentPage,
        per_page: rowsPerPage,
        search: searchTerm
      };
      
      const response = await axios.get(`${BASE_URL}/trainers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });

      if (response.data && response.data.data) {
        // Transform API response to match component structure
        const transformedTrainers = response.data.data.map(trainer => ({
          id: trainer.id,
          name: trainer.name,
          mobile: trainer.mobile,
          email: trainer.email,
          address: trainer.address,
          batches: trainer.batches || [],
          createdAt: trainer.created_at,
          updatedAt: trainer.updated_at
        }));
        
        setTrainers(transformedTrainers);
        setTotalCount(response.data.total || 0);
        setLastPage(response.data.last_page || 1);
      } else {
        setTrainers([]);
        setTotalCount(0);
        setLastPage(1);
      }
    } catch (error) {
      console.error('Error loading trainers:', error);
      showNotification(error.response?.data?.message || 'Failed to load trainers', 'error');
      setTrainers([]);
      setTotalCount(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, searchTerm]);

  // Load data when dependencies change
  useEffect(() => {
    loadTrainersFromAPI();
    loadBatchesFromAPI();
  }, [loadTrainersFromAPI, loadBatchesFromAPI]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle add trainer
  const handleAddTrainer = (newTrainer) => {
    loadTrainersFromAPI();
    showNotification('Trainer added successfully!', 'success');
  };

  // Handle edit trainer
  const handleEditTrainer = (updatedTrainer) => {
    loadTrainersFromAPI();
    showNotification('Trainer updated successfully!', 'success');
  };

  // Handle delete trainer
  const handleDeleteTrainer = async (trainerId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/trainers/${trainerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      loadTrainersFromAPI();
      showNotification('Trainer deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting trainer:', error);
      showNotification('Failed to delete trainer', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle assign batch to trainer
  const handleAssignBatch = (trainerId, assignedBatches) => {
    loadTrainersFromAPI();
    loadBatchesFromAPI();
    showNotification('Batches updated successfully!', 'success');
  };

  // Handle refresh
  const handleRefresh = () => {
    loadTrainersFromAPI();
    loadBatchesFromAPI();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle select all on current page
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(trainers.map(trainer => trainer.id));
    } else {
      setSelected([]);
    }
  };

  // Handle single selection
  const handleSelect = (id) => {
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
    if (selected.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const deletePromises = selected.map(id => 
        axios.delete(`${BASE_URL}/trainers/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(deletePromises);
      
      setSelected([]);
      
      if (trainers.length === selected.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setPage(prev => prev - 1);
      } else {
        loadTrainersFromAPI();
      }
      
      showNotification(`${selected.length} trainers deleted successfully`, 'success');
    } catch (error) {
      console.error('Error bulk deleting trainers:', error);
      showNotification('Failed to delete some trainers', 'error');
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

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get trainer initials
  const getTrainerInitials = (name) => {
    if (!name) return 'T';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
          Trainer Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize trainer information
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
              placeholder="Search by name, contact, or address..."
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
            {searchTerm && (
              <Chip 
                label={`Search: ${searchTerm}`}
                size="small"
                onDelete={() => {
                  setSearchInput('');
                  setSearchTerm('');
                  setCurrentPage(1);
                  setPage(0);
                }}
                sx={{ height: 28, fontSize: '0.7rem' }}
              />
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {selected.length > 0 && (
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
            
            <Button
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
            </Button>

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
              Add Trainer
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Trainers Table */}
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
                <TableCell padding="checkbox" sx={{ width: 40 }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < trainers.length}
                    checked={trainers.length > 0 && selected.length === trainers.length}
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
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Name
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
                  color: COLORS.text.light
                }}>
                  Contact
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                  color: COLORS.text.light
                }}>
                  Address
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading trainers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : trainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No trainers found' : 'No trainers available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first trainer to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                trainers.map((trainer) => {
                  const isSelected = selected.includes(trainer.id);
                  const avatarColor = getAvatarColor(trainer.name);
                  const batchCount = trainer.batches?.length || 0;

                  return (
                    <TableRow
                      key={trainer.id}
                      hover
                      selected={isSelected}
                      sx={{ 
                        bgcolor: COLORS.background.white,
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
                      <TableCell padding="checkbox" sx={{ width: 40 }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelect(trainer.id)}
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
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: avatarColor,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            {getTrainerInitials(trainer.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {trainer.name}
                            </Typography>
                            {trainer.email && (
                              <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                                {trainer.email}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <BatchChip batches={trainer.batches} />
                        {batchCount > 0 && (
                          <Typography sx={{ fontSize: '0.6rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                            {trainer.batches.map(b => `Batch #${b.id}`).join(', ')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PhoneIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {trainer.mobile}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                            {trainer.address}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          trainer={trainer}
                          onView={(t) => { setSelectedTrainer(t); setOpenViewModal(true); }}
                          onEdit={(t) => { setSelectedTrainer(t); setOpenEditModal(true); }}
                          onDelete={(t) => { setSelectedTrainer(t); setOpenDeleteDialog(true); }}
                          onAssignBatch={(t) => { setSelectedTrainer(t); setOpenAssignBatchDialog(true); }}
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

      {/* Modal Components */}
      <AddTrainer 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddTrainer}
      />

      {selectedTrainer && (
        <>
          <EditTrainer 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedTrainer(null);
            }}
            trainer={selectedTrainer}
            onUpdate={handleEditTrainer}
          />

          <ViewTrainer 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedTrainer(null);
            }}
            trainer={selectedTrainer}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteTrainer 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedTrainer(null);
            }}
            trainer={selectedTrainer}
            onDelete={handleDeleteTrainer}
          />

          <AssignBatchDialog 
            open={openAssignBatchDialog}
            onClose={() => {
              setOpenAssignBatchDialog(false);
              setSelectedTrainer(null);
            }}
            trainer={selectedTrainer}
            batches={batches}
            onAssign={handleAssignBatch}
          />
        </>
      )}

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

export default Trainers;