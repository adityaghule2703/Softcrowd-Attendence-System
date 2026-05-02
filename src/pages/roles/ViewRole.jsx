import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { CheckCircle, XCircle } from 'lucide-react';

const COLORS = {
  primary: '#063C3F',
  primaryLight: '#E8F0F1',
  primaryDark: '#05292B',
  text: {
    primary: '#151C26',
    secondary: '#4B5568',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FFFC',
    hover: '#F0FDF9',
    tableHeader: '#063C3F'
  },
  border: '#E3E8EF',
  chips: {
    active: '#9FE2BF',
    inactive: '#F1F5F9'
  }
};

const ALL_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT', 'PRINT', 'APPROVE', 'REJECT'];

const ALL_PAGES = [
  { module: 'DASHBOARD', page: 'Dashboard', category: 'Dashboard' },
  { module: 'USERS', page: 'Users', category: 'Administration' },
  { module: 'ROLES', page: 'Roles', category: 'Administration' },
  // ... add all your pages here (same as AddRole)
];

const groupedPages = ALL_PAGES.reduce((acc, page) => {
  if (!acc[page.category]) acc[page.category] = [];
  acc[page.category].push(page);
  return acc;
}, {});

const ViewRole = ({ open, onClose, role, onEdit }) => {
  // Create permission map
  const permissionMap = {};
  if (role?.permissions) {
    role.permissions.forEach(perm => {
      const key = `${perm.module}_${perm.action}`;
      permissionMap[key] = true;
    });
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
          maxHeight: '90vh'
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
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: COLORS.text.primary }}>
            View Role Details
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: COLORS.text.tertiary }}>
            View role information and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {role?._id && (
            <Chip
              label={`ID: ${role._id.slice(-6)}`}
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
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  ROLE NAME
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                  {role?.RoleName || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                  STATUS
                </Typography>
                <Chip
                  label={role?.IsActive ? 'Active' : 'Inactive'}
                  size="small"
                  icon={role?.IsActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  sx={{
                    bgcolor: role?.IsActive ? COLORS.chips.active : COLORS.chips.inactive,
                    color: role?.IsActive ? COLORS.primaryDark : COLORS.text.secondary,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    height: 24
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, mb: 0.5 }}>
                DESCRIPTION
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                {role?.Description || 'No description provided'}
              </Typography>
            </Box>
          </Box>

          {/* Permissions */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
              Module Permissions
            </Typography>
            
            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: COLORS.background.tableHeader }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light, minWidth: 200 }}>
                        Pages / Modules
                      </TableCell>
                      {ALL_ACTIONS.map((action) => (
                        <TableCell key={action} align="center" sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.text.light, minWidth: 70 }}>
                          {action}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(groupedPages).map(([category, pages]) => (
                      <React.Fragment key={category}>
                        <TableRow sx={{ bgcolor: `${COLORS.primary}10` }}>
                          <TableCell colSpan={ALL_ACTIONS.length + 1} sx={{ fontWeight: 600, fontSize: '0.7rem', color: COLORS.primary, py: 1 }}>
                            {category}
                          </TableCell>
                        </TableRow>
                        {pages.map((page) => (
                          <TableRow key={page.module} hover>
                            <TableCell sx={{ fontSize: '0.75rem', py: 1.5 }}>
                              <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{page.page}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary }}>{page.module}</Typography>
                              </Box>
                            </TableCell>
                            {ALL_ACTIONS.map((action) => (
                              <TableCell key={action} align="center">
                                <Checkbox
                                  checked={!!permissionMap[`${page.module}_${action}`]}
                                  disabled
                                  size="small"
                                  sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 2.5, 
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`, 
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1
      }}>
        <Button onClick={onClose}>Close</Button>
        {onEdit && (
          <Button
            variant="contained"
            onClick={onEdit}
            startIcon={<EditIcon />}
            sx={{
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: COLORS.primaryDark }
            }}
          >
            Edit Role
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ViewRole;