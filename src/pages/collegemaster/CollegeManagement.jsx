import React, { useState, useEffect } from 'react';
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
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Import modal components
import AddCollege from './AddCollege';
import EditCollege from './EditCollege';
import ViewCollege from './ViewCollege';
import DeleteCollege from './DeleteCollege';

// Color constants - Using sidebar background color (#0F172A)
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

// Action Menu Component
const ActionMenu = ({ college, onView, onEdit, onDelete }) => {
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
            onView(college);
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
            onEdit(college);
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
        
        <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
        
        <MenuItem 
          onClick={() => {
            onDelete(college);
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

const CollegeManagement = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Load colleges from localStorage on component mount
  useEffect(() => {
    loadCollegesFromStorage();
  }, []);

  const loadCollegesFromStorage = () => {
    setLoading(true);
    try {
      const storedColleges = localStorage.getItem('colleges');
      if (storedColleges) {
        const parsedColleges = JSON.parse(storedColleges);
        setColleges(parsedColleges);
        setFilteredColleges(parsedColleges);
      } else {
        // Start with empty array - no demo data
        setColleges([]);
        setFilteredColleges([]);
        localStorage.setItem('colleges', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading colleges:', error);
      showNotification('Failed to load colleges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveCollegesToStorage = (updatedColleges) => {
    localStorage.setItem('colleges', JSON.stringify(updatedColleges));
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredColleges(colleges);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = colleges.filter(college =>
      college.name?.toLowerCase().includes(value) ||
      college.address?.toLowerCase().includes(value) ||
      college.city?.toLowerCase().includes(value) ||
      college.contact?.toLowerCase().includes(value) ||
      college.email?.toLowerCase().includes(value)
    );
    
    setFilteredColleges(filtered);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Apply search when searchTerm or colleges change
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, colleges]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredColleges.map(college => college.id));
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelected([]);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadCollegesFromStorage();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle add college
  const handleAddCollege = (newCollege) => {
    const collegeWithId = {
      ...newCollege,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedColleges = [...colleges, collegeWithId];
    setColleges(updatedColleges);
    saveCollegesToStorage(updatedColleges);
    showNotification('College added successfully!', 'success');
  };

  // Handle edit college
  const handleEditCollege = (updatedCollege) => {
    const updatedColleges = colleges.map(college =>
      college.id === updatedCollege.id 
        ? { ...updatedCollege, updatedAt: new Date().toISOString() }
        : college
    );
    setColleges(updatedColleges);
    saveCollegesToStorage(updatedColleges);
    showNotification('College updated successfully!', 'success');
  };

  // Handle delete college
  const handleDeleteCollege = (collegeId) => {
    const updatedColleges = colleges.filter(college => college.id !== collegeId);
    setColleges(updatedColleges);
    setSelected(selected.filter(id => id !== collegeId));
    saveCollegesToStorage(updatedColleges);
    showNotification('College deleted successfully!', 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedColleges = colleges.filter(c => !selected.includes(c.id));
    setColleges(updatedColleges);
    setSelected([]);
    saveCollegesToStorage(updatedColleges);
    showNotification(`${selected.length} colleges deleted successfully`, 'success');
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
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get college initials
  const getCollegeInitials = (name) => {
    if (!name) return 'C';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Paginated colleges
  const paginatedColleges = filteredColleges.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          College Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize college information and details
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
              placeholder="Search by college name, address, or contact..."
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
            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleBulkDelete}
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
              Add College
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Colleges Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredColleges.length}
                    checked={filteredColleges.length > 0 && selected.length === filteredColleges.length}
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
                  College Name
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
                  color: COLORS.text.light
                }}>
                  Contact
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
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading colleges...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedColleges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No colleges found' : 'No colleges available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first college to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedColleges.map((college) => {
                  const isSelected = selected.includes(college.id);
                  const avatarColor = getAvatarColor(college.name);

                  return (
                    <TableRow
                      key={college.id}
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
                          onChange={() => handleSelect(college.id)}
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
                            {getCollegeInitials(college.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {college.name}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                              {college.city}, {college.state} - {college.pincode}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                          {college.address}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>
                          {college.city}, {college.state} {college.pincode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PhoneIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                            <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                              {college.contact}
                            </Typography>
                          </Stack>
                          {college.email && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <EmailIcon sx={{ fontSize: 12, color: COLORS.text.tertiary }} />
                              <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
                                {college.email}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          college={college}
                          onView={(c) => { setSelectedCollege(c); setOpenViewModal(true); }}
                          onEdit={(c) => { setSelectedCollege(c); setOpenEditModal(true); }}
                          onDelete={(c) => { setSelectedCollege(c); setOpenDeleteDialog(true); }}
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
          count={filteredColleges.length}
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
      <AddCollege 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddCollege}
      />

      {selectedCollege && (
        <>
          <EditCollege 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedCollege(null);
            }}
            college={selectedCollege}
            onUpdate={handleEditCollege}
          />

          <ViewCollege 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedCollege(null);
            }}
            college={selectedCollege}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteCollege 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedCollege(null);
            }}
            college={selectedCollege}
            onDelete={handleDeleteCollege}
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

export default CollegeManagement;