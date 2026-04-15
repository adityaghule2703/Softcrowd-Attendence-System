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
  Language as LanguageIcon,
  Public as PublicIcon
} from '@mui/icons-material';

// Import modal components
import AddDomain from './AddDomain';
import EditDomain from './EditDomain';
import ViewDomain from './ViewDomain';
import DeleteDomain from './DeleteDomain';

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

// Action Menu Component
const ActionMenu = ({ domain, onView, onEdit, onDelete }) => {
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
            onView(domain);
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
            onEdit(domain);
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
            onDelete(domain);
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

const DomainManagement = () => {
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
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
  const [selectedDomain, setSelectedDomain] = useState(null);

  // Load domains from localStorage on component mount
  useEffect(() => {
    loadDomainsFromStorage();
  }, []);

  const loadDomainsFromStorage = () => {
    setLoading(true);
    try {
      const storedDomains = localStorage.getItem('domains');
      if (storedDomains) {
        const parsedDomains = JSON.parse(storedDomains);
        setDomains(parsedDomains);
        setFilteredDomains(parsedDomains);
      } else {
        setDomains([]);
        setFilteredDomains([]);
        localStorage.setItem('domains', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading domains:', error);
      showNotification('Failed to load domains', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveDomainsToStorage = (updatedDomains) => {
    localStorage.setItem('domains', JSON.stringify(updatedDomains));
  };

  // Handle search
  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDomains(domains);
      return;
    }
    
    const value = searchTerm.toLowerCase();
    const filtered = domains.filter(domain =>
      domain.domainName?.toLowerCase().includes(value)
    );
    
    setFilteredDomains(filtered);
  };

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Apply search when searchTerm or domains change
  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, domains]);

  // Handle select all
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredDomains.map(domain => domain.id));
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
    loadDomainsFromStorage();
    showNotification('Data refreshed successfully', 'success');
  };

  // Handle add domain
  const handleAddDomain = (newDomain) => {
    const domainWithId = {
      ...newDomain,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedDomains = [...domains, domainWithId];
    setDomains(updatedDomains);
    saveDomainsToStorage(updatedDomains);
    showNotification('Domain added successfully!', 'success');
  };

  // Handle edit domain
  const handleEditDomain = (updatedDomain) => {
    const updatedDomains = domains.map(domain =>
      domain.id === updatedDomain.id 
        ? { ...updatedDomain, updatedAt: new Date().toISOString() }
        : domain
    );
    setDomains(updatedDomains);
    saveDomainsToStorage(updatedDomains);
    showNotification('Domain updated successfully!', 'success');
  };

  // Handle delete domain
  const handleDeleteDomain = (domainId) => {
    const updatedDomains = domains.filter(domain => domain.id !== domainId);
    setDomains(updatedDomains);
    setSelected(selected.filter(id => id !== domainId));
    saveDomainsToStorage(updatedDomains);
    showNotification('Domain deleted successfully!', 'success');
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedDomains = domains.filter(d => !selected.includes(d.id));
    setDomains(updatedDomains);
    setSelected([]);
    saveDomainsToStorage(updatedDomains);
    showNotification(`${selected.length} domains deleted successfully`, 'success');
  };

  // Show notification
  const showNotification = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Get avatar color based on domain name
  const getAvatarColor = (name) => {
    const colors = [COLORS.accent, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  // Get domain initials
  const getDomainInitials = (name) => {
    if (!name) return 'D';
    return name.substring(0, 2).toUpperCase();
  };

  // Paginated domains
  const paginatedDomains = filteredDomains.slice(
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
          Domain Management
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
          Manage and organize domain names
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
              placeholder="Search by domain name..."
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
              Add Domain
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Domains Table */}
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
                    indeterminate={selected.length > 0 && selected.length < filteredDomains.length}
                    checked={filteredDomains.length > 0 && selected.length === filteredDomains.length}
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
                  Domain Name
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
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: COLORS.accent }} />
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                      Loading domains...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedDomains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <LanguageIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                        {searchTerm ? 'No domains found' : 'No domains available'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Add your first domain to get started'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDomains.map((domain) => {
                  const isSelected = selected.includes(domain.id);
                  const avatarColor = getAvatarColor(domain.domainName);

                  return (
                    <TableRow
                      key={domain.id}
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
                          onChange={() => handleSelect(domain.id)}
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
                            {getDomainInitials(domain.domainName)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.primary }}>
                              {domain.domainName}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>
                        <ActionMenu 
                          domain={domain}
                          onView={(d) => { setSelectedDomain(d); setOpenViewModal(true); }}
                          onEdit={(d) => { setSelectedDomain(d); setOpenEditModal(true); }}
                          onDelete={(d) => { setSelectedDomain(d); setOpenDeleteDialog(true); }}
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
          count={filteredDomains.length}
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
      <AddDomain 
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddDomain}
      />

      {selectedDomain && (
        <>
          <EditDomain 
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedDomain(null);
            }}
            domain={selectedDomain}
            onUpdate={handleEditDomain}
          />

          <ViewDomain 
            open={openViewModal}
            onClose={() => {
              setOpenViewModal(false);
              setSelectedDomain(null);
            }}
            domain={selectedDomain}
            onEdit={() => {
              setOpenViewModal(false);
              setOpenEditModal(true);
            }}
          />

          <DeleteDomain 
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setSelectedDomain(null);
            }}
            domain={selectedDomain}
            onDelete={handleDeleteDomain}
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

export default DomainManagement;