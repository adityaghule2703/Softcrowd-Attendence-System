import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#0F172A',
  accent: '#00AEED',
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    light: '#FFFFFF'
  },
  background: {
    white: '#FFFFFF',
    light: '#F8FAFC'
  },
  border: '#E2E8F0'
};

const ViewDepartment = ({ open, onClose, department, onEdit }) => {
  if (!department) return null;

  const getDepartmentInitials = (name) => {
    if (!name) return 'D';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderField = (icon, label, value) => (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Box sx={{ color: COLORS.accent, mt: 0.3, minWidth: 20 }}>
        {icon}
      </Box>
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: COLORS.text.secondary, 
            display: 'block', 
            fontSize: '10px', 
            fontWeight: 500, 
            mb: 0.2,
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            fontSize: '13px', 
            color: COLORS.text.primary, 
            wordBreak: 'break-word' 
          }}
        >
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
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
      {/* Header */}
      <Box sx={{ 
        background: COLORS.primary, 
        py: 1.5, 
        px: 2.5
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <SchoolIcon sx={{ color: COLORS.text.light, fontSize: 18 }} />
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                color: COLORS.text.light, 
                fontSize: '0.9rem',
                letterSpacing: '0.5px'
              }}
            >
              Department Details
            </Typography>
          </Stack>
          <Chip 
            label={`ID: ${department.id}`} 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)', 
              color: COLORS.text.light, 
              fontSize: '10px', 
              height: '22px',
              '& .MuiChip-label': {
                px: 1.5
              }
            }} 
          />
        </Stack>
      </Box>

      <DialogContent sx={{ p: 2.5, bgcolor: COLORS.background.light }}>
        <Stack spacing={2}>
          {/* Department Profile */}
          <Paper sx={{ 
            p: 2.5, 
            borderRadius: 2, 
            border: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.background.white
          }}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: COLORS.accent, 
                  fontSize: '1.8rem', 
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {getDepartmentInitials(department.departmentName)}
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  color={COLORS.text.primary} 
                  sx={{ fontSize: '1.2rem', mb: 0.5 }}
                >
                  {department.departmentName}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BusinessIcon sx={{ fontSize: 14, color: COLORS.text.tertiary }} />
                  <Typography variant="body2" color={COLORS.text.secondary} sx={{ fontSize: '12px' }}>
                    {department.collegeName}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: COLORS.accent, 
                mb: 2, 
                fontWeight: 600, 
                fontSize: '0.8rem',
                letterSpacing: '0.5px'
              }}
            >
              Coordinator Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(<PersonIcon sx={{ fontSize: 16 }} />, 'Coordinator Name', department.coordinatorName)}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(<PhoneIcon sx={{ fontSize: 16 }} />, 'Contact Number', department.coordinatorContact)}
              </Grid>
              <Grid size={{ xs: 12 }}>
                {renderField(<EmailIcon sx={{ fontSize: 16 }} />, 'Email Address', department.coordinatorEmail || 'Not provided')}
              </Grid>
            </Grid>

            {/* Metadata Information */}
            {(department.createdAt || department.updatedAt) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: COLORS.accent, 
                    mb: 2, 
                    fontWeight: 600, 
                    fontSize: '0.8rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  {department.createdAt && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: COLORS.text.secondary, fontSize: '10px', fontWeight: 500, display: 'block', mb: 0.2 }}>
                        CREATED AT
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', color: COLORS.text.primary }}>
                        {new Date(department.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Grid>
                  )}
                  {department.updatedAt && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" sx={{ color: COLORS.text.secondary, fontSize: '10px', fontWeight: 500, display: 'block', mb: 0.2 }}>
                        LAST UPDATED
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', color: COLORS.text.primary }}>
                        {new Date(department.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Paper>
        </Stack>
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{ 
        px: 2.5, 
        py: 1.5, 
        borderTop: `1px solid ${COLORS.border}`, 
        backgroundColor: COLORS.background.white,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Button 
          onClick={onClose} 
          startIcon={<CloseIcon sx={{ fontSize: '1rem' }} />} 
          size="small" 
          sx={{ 
            color: COLORS.text.secondary, 
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: `${COLORS.accent}10`
            }
          }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={() => { 
            onClose(); 
            if (onEdit) onEdit(department); 
          }} 
          size="small" 
          startIcon={<EditIcon sx={{ fontSize: '1rem' }} />} 
          sx={{ 
            backgroundColor: COLORS.accent, 
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            '&:hover': { 
              backgroundColor: COLORS.primary 
            }
          }}
        >
          Edit Department
        </Button>
      </Box>
    </Dialog>
  );
};

export default ViewDepartment;