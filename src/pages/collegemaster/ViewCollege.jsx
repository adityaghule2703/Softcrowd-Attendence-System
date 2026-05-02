import React, { useState } from 'react';
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
  styled
} from '@mui/material';
import {
  Edit as EditIcon,
  Business,
  LocationOn,
  Email,
  Phone,
  Close as CloseIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon
} from '@mui/icons-material';

// Color constants
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

const ViewCollege = ({ open, onClose, college, onEdit }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!college) return null;

  const getCollegeInitials = (name) => {
    if (!name) return 'C';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to get contact number from either field name
  const getContactNumber = () => {
    return college.contact || college.contact_number || '-';
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={1.5}>
            {/* College Profile */}
            <Paper sx={{ p: 2, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: COLORS.accent,
                    fontSize: '2rem',
                    fontWeight: 600
                  }}
                >
                  {getCollegeInitials(college.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color={COLORS.text.primary} sx={{ fontSize: '1.1rem' }}>
                    {college.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="body2" color={COLORS.text.secondary} sx={{ fontSize: '12px' }}>
                      {college.city}, {college.state}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: COLORS.accent, mb: 1.5, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                  {renderField(<LocationOn sx={{ fontSize: 16 }} />, 'Address', college.address)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'City', college.city)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'State', college.state)}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Business sx={{ fontSize: 16 }} />, 'Pincode', college.pincode)}
                </Grid>
              </Grid>
            </Paper>

            {/* Contact Information */}
            <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
              <Typography variant="subtitle2" sx={{ color: COLORS.accent, mb: 1, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Phone sx={{ fontSize: 16 }} />, 'Contact Number', getContactNumber())}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderField(<Email sx={{ fontSize: 16 }} />, 'Email', college.email || 'Not provided')}
                </Grid>
              </Grid>
            </Paper>

            {/* Metadata Information */}
            {college.createdAt && (
              <Paper sx={{ p: 1.5, backgroundColor: COLORS.background.white, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.accent, mb: 1, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                  Additional Information
                </Typography>
                
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary, fontSize: '10px', fontWeight: 500, display: 'block', mb: 0.2 }}>
                      CREATED AT
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', color: COLORS.text.primary }}>
                      {new Date(college.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" sx={{ color: COLORS.text.secondary, fontSize: '10px', fontWeight: 500, display: 'block', mb: 0.2 }}>
                      LAST UPDATED
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px', color: COLORS.text.primary }}>
                      {new Date(college.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Stack>
        );

      default:
        return null;
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
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          border: `1px solid ${COLORS.border}`,
          maxHeight: '90vh'
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
            <Business sx={{ color: COLORS.text.light, fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: COLORS.text.light,
              fontSize: '0.9rem',
              letterSpacing: '0.5px'
            }}>
              College Details
            </Typography>
          </Stack>
          <Chip
            label={`ID: ${college.id}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              color: COLORS.text.light,
              fontWeight: 500,
              fontSize: '10px',
              height: '22px',
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        </Stack>
      </Box>

      <DialogContent sx={{ 
        p: 2.5, 
        overflow: 'auto', 
        maxHeight: 'calc(90vh - 120px)',
        bgcolor: COLORS.background.light,
        '&:last-child': {
          pb: 2.5
        }
      }}>
        {renderStepContent(activeStep)}
      </DialogContent>

      {/* Footer Actions */}
      <Box sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.background.white
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
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

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(college);
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
              Edit College
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewCollege;