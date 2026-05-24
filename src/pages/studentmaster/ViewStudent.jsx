import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  Block as BlockIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

// Color constants
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
  border: '#E2E8F0'
};

const ViewStudent = ({ open, onClose, student, onEdit }) => {
  // Debug log to see what's being received
  useEffect(() => {
    if (open && student) {
      console.log('========== STUDENT DATA RECEIVED ==========');
      console.log('Full student object:', student);
      console.log('College name:', student.collegeName);
      console.log('Department name:', student.departmentName);
      console.log('==========================================');
    }
  }, [open, student]);

  if (!student) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format date for batch display
  const formatBatchDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get student initials
  const getStudentInitials = (name) => {
    if (!name) return 'S';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get status badge for block status
  const getBlockStatus = () => {
    if (student.is_blocked === 1 || student.is_blocked === true) {
      return { label: 'Blocked', color: '#EF4444', bg: '#FEE2E2' };
    }
    return { label: 'Active', color: '#10B981', bg: '#D1FAE5' };
  };

  const status = getBlockStatus();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
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
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: COLORS.text.primary
          }}
        >
          Student Details
        </Typography>
        <Chip
          label={`ID: ${student?.id || 'N/A'}`}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.65rem',
            fontWeight: 500,
            bgcolor: COLORS.background.light,
            color: COLORS.text.secondary
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2.5, maxHeight: '70vh', overflowY: 'auto' }}>
        <Stack spacing={2.5}>
          {/* Student Name with Avatar */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <Avatar 
                sx={{ 
                  width: 56, 
                  height: 56, 
                  bgcolor: COLORS.accent,
                  fontSize: '1.3rem',
                  fontWeight: 600
                }}
              >
                {getStudentInitials(student.name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: COLORS.text.primary
                }}>
                  {student?.name || 'N/A'}
                </Typography>
                <Chip 
                  label={status.label} 
                  size="small" 
                  sx={{ 
                    mt: 0.5,
                    height: 22,
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    bgcolor: status.bg, 
                    color: status.color 
                  }} 
                />
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Student Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                STUDENT INFORMATION
              </Typography>
            </Stack>
            
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <PhoneIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    MOBILE NUMBER
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {student?.mobile || 'N/A'}
                  </Typography>
                </Box>
              </Stack>

              {student.company_name && (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                  <WorkIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                      COMPANY NAME
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {student.company_name}
                    </Typography>
                  </Box>
                </Stack>
              )}

              {student.block_reason && (
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                  <BlockIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                      BLOCK REASON
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                      {student.block_reason}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* College & Department Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <SchoolIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                ACADEMIC INFORMATION
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ ml: 3.5 }}>
                <BusinessIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary, mt: 0.2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    COLLEGE
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                    {student.collegeName || 'N/A'}
                  </Typography>
                 
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    DEPARTMENT
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {student.departmentName || 'N/A'}
                  </Typography>
                 
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Enrolled Batches */}
          {student.batches && student.batches.length > 0 && (
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <GroupIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  ENROLLED BATCHES ({student.batches.length})
                </Typography>
              </Stack>

              {student.batches.map((batch) => (
                <Accordion 
                  key={batch.id}
                  sx={{ 
                    ml: 3.5, 
                    mb: 1, 
                    boxShadow: 'none', 
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: '0 0 8px 0'
                    }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.text.primary }}>
                      {batch.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DateRangeIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatBatchDate(batch.start_date)} - {formatBatchDate(batch.end_date)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          {formatTime(batch.start_time)} - {formatTime(batch.end_time)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          Trainer: {batch.trainer_name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <GroupIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                        <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                          Strength: {batch.strength} students
                        </Typography>
                      </Stack>
                      {batch.pivot && batch.pivot.start_date && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarIcon sx={{ fontSize: '0.8rem', color: COLORS.text.tertiary }} />
                          <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary }}>
                            Enrolled on: {formatBatchDate(batch.pivot.start_date)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Metadata Information */}
          {(student.createdAt || student.updatedAt) && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {student.createdAt && (
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        CREATED AT
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      fontSize: '0.7rem', 
                      color: COLORS.text.secondary,
                      ml: 3.5
                    }}>
                      {formatDate(student.createdAt)}
                    </Typography>
                  </Box>
                )}

                {student.updatedAt && (
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        LAST UPDATED
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      fontSize: '0.7rem', 
                      color: COLORS.text.secondary,
                      ml: 3.5
                    }}>
                      {formatDate(student.updatedAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.background.white,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1
      }}>
        <Button
          onClick={onClose}
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
              borderColor: COLORS.primary,
              bgcolor: `${COLORS.primary}10`
            }
          }}
        >
          Close
        </Button>

       
      </DialogActions>
    </Dialog>
  );
};

export default ViewStudent;