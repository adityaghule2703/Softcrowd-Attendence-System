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
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
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

const ViewStudent = ({ open, onClose, student, onEdit }) => {
  if (!student) return null;

  const getStudentInitials = (name) => {
    if (!name) return 'S';
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
        <Typography variant="caption" sx={{ color: COLORS.text.secondary, display: 'block', fontSize: '10px', fontWeight: 500, mb: 0.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: COLORS.text.primary, wordBreak: 'break-word' }}>
          {value || '-'}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ background: COLORS.primary, py: 1, px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon sx={{ color: COLORS.text.light, fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.text.light, fontSize: '0.9rem' }}>
              Student Details
            </Typography>
          </Stack>
          <Chip label={`ID: ${student.id}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: COLORS.text.light, fontSize: '10px', height: '20px' }} />
        </Stack>
      </Box>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Student Profile */}
          <Paper sx={{ p: 2, borderRadius: 1.5, border: `1px solid ${COLORS.border}` }}>
            <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ width: 70, height: 70, bgcolor: COLORS.accent, fontSize: '1.5rem', fontWeight: 600 }}>
                {getStudentInitials(student.name)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color={COLORS.text.primary} sx={{ fontSize: '1.1rem' }}>
                  {student.name}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" sx={{ color: COLORS.accent, mb: 1.5, fontWeight: 600, fontSize: '0.8rem' }}>
              Student Information
            </Typography>
            
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(<PhoneIcon sx={{ fontSize: 16 }} />, 'Mobile Number', student.mobile)}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {renderField(<BusinessIcon sx={{ fontSize: 16 }} />, 'College Name', student.collegeName)}
              </Grid>
              <Grid size={{ xs: 12 }}>
                {renderField(<SchoolIcon sx={{ fontSize: 16 }} />, 'Department Name', student.departmentName)}
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>

      <Box sx={{ px: 2, py: 1, borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.background.light, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={onClose} startIcon={<CloseIcon />} size="small" sx={{ color: COLORS.text.secondary, fontSize: '0.8rem' }}>
          Close
        </Button>
        <Button variant="contained" onClick={() => { onClose(); if (onEdit) onEdit(student); }} size="small" startIcon={<EditIcon />} sx={{ backgroundColor: COLORS.accent, fontSize: '0.8rem', '&:hover': { backgroundColor: COLORS.primary } }}>
          Edit Student
        </Button>
      </Box>
    </Dialog>
  );
};

export default ViewStudent;