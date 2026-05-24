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
  Avatar,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Domain as DomainIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  AccessTime as AccessTimeIcon,
  DateRange as DateRangeIcon,
  School as SchoolIcon,
  MyLocation as MyLocationIcon
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

const ViewBatch = ({ open, onClose, batch, onEdit }) => {
  // Debug log to see what's being received
  useEffect(() => {
    if (open && batch) {
      console.log('========== BATCH DATA RECEIVED ==========');
      console.log('Full batch object:', batch);
      console.log('Batch name:', batch.name);
      console.log('Start date:', batch.startDate);
      console.log('End date:', batch.endDate);
      console.log('Start time:', batch.startTime);
      console.log('End time:', batch.endTime);
      console.log('Trainer:', batch.trainer);
      console.log('Strength:', batch.strength);
      console.log('Domain name:', batch.domainName);
      console.log('==========================================');
    }
  }, [open, batch]);

  if (!batch) return null;

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

  // Get batch initials
  const getBatchInitials = (name) => {
    if (!name) return 'B';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get pause status
  const getPauseStatus = () => {
    if (batch.is_paused === 1 || batch.is_paused === true) {
      return { label: 'Paused', color: '#F59E0B', bg: '#FEF3C7' };
    }
    return { label: 'Active', color: '#10B981', bg: '#D1FAE5' };
  };

  const status = getPauseStatus();

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') return '📄';
    if (fileType === 'docx' || fileType === 'doc') return '📝';
    if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') return '🖼️';
    return '📎';
  };

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
          Batch Details
        </Typography>
        <Chip
          label={`ID: ${batch?.id || 'N/A'}`}
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
          {/* Batch Name with Avatar */}
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
                {getBatchInitials(batch.name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: COLORS.text.primary
                }}>
                  {batch?.name || 'N/A'}
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

          {/* Domain Information */}
          {batch.domainName && (
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <DomainIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  DOMAIN INFORMATION
                </Typography>
              </Stack>
              
              <Stack spacing={1.5} sx={{ ml: 3.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SchoolIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                      DOMAIN NAME
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                      {batch.domainName || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          )}

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Batch Schedule */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <ScheduleIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                BATCH SCHEDULE
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <DateRangeIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    DATE RANGE
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 3.5 }}>
                <AccessTimeIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    TIME
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                    {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Location Information */}
          {(batch.latitude || batch.longitude || batch.radius) && (
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <LocationIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                  LOCATION INFORMATION
                </Typography>
              </Stack>

              <Stack spacing={1.5} sx={{ ml: 3.5 }}>
                {(batch.latitude || batch.longitude) && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MyLocationIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        COORDINATES
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        Lat: {batch.latitude || 'N/A'}, Lng: {batch.longitude || 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {batch.radius && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MyLocationIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                        RADIUS
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.primary }}>
                        {batch.radius} meters
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Trainer Information */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <PersonIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                TRAINER INFORMATION
              </Typography>
            </Stack>

            <Stack spacing={1.5} sx={{ ml: 3.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PersonIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    NAME
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {batch.trainer || 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: COLORS.border }} />

          {/* Batch Statistics */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <GroupIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                BATCH STATISTICS
              </Typography>
            </Stack>

            <Stack spacing={1.5} sx={{ ml: 3.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <GroupIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: COLORS.text.tertiary, letterSpacing: '0.5px' }}>
                    STRENGTH
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: COLORS.text.primary }}>
                    {batch.strength || 'N/A'} Students
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* Documents Section */}
          {batch.documents && batch.documents.length > 0 && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <AttachFileIcon sx={{ fontSize: '1.25rem', color: COLORS.accent }} />
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: COLORS.text.secondary, letterSpacing: '0.5px' }}>
                    DOCUMENTS ({batch.documents.length})
                  </Typography>
                </Stack>

                <List sx={{ ml: 3.5 }}>
                  {batch.documents.map((doc) => (
                    <ListItem key={doc.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>
                          {getFileIcon(doc.file_type)}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Link 
                            href={doc.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ 
                              fontSize: '0.75rem', 
                              color: COLORS.accent,
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {doc.file_name}
                          </Link>
                        }
                        secondary={`Type: ${doc.file_type.toUpperCase()}`}
                        secondaryTypographyProps={{ fontSize: '0.65rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}

          {/* Metadata Information */}
          {(batch.createdAt || batch.updatedAt) && (
            <>
              <Divider sx={{ borderColor: COLORS.border }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {batch.createdAt && (
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
                      {formatDate(batch.createdAt)}
                    </Typography>
                  </Box>
                )}

                {batch.updatedAt && (
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
                      {formatDate(batch.updatedAt)}
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

export default ViewBatch;