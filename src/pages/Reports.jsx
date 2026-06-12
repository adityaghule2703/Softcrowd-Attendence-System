// import React, { useState, useEffect } from 'react';
// import {
//   Calendar,
//   Download,
//   ChevronDown,
//   RotateCcw,
//   AlertCircle,
//   CheckCircle,
//   X,
//   FileText,
//   Filter,
// } from 'lucide-react';
// import dayjs from 'dayjs';
// import axios from 'axios';
// import BASE_URL from '../config/Config';
// import { ACTIONS, hasPermission, MODULES, PAGES } from '../utils/modulePermissions';

// // ─── Tokens ──────────────────────────────────────────────────────────────────

// const t = {
//   bg: '#FAFAFA',
//   surface: '#FFFFFF',
//   border: '#E8E8E8',
//   borderStrong: '#D0D0D0',
//   text: '#0D0D0D',
//   textMid: '#555555',
//   textMuted: '#999999',
//   accent: '#0D0D0D',
//   accentHover: '#2A2A2A',
//   radius: '10px',
//   radiusSm: '7px',
//   fontMono: '"JetBrains Mono", "Fira Mono", monospace',
//   fontSans: '"Geist", "DM Sans", system-ui, sans-serif',
// };

// // ─── Base styles (injected once) ─────────────────────────────────────────────

// const globalCSS = `
//   @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

//   .rpt-root * { box-sizing: border-box; }

//   .rpt-root {
//     font-family: 'DM Sans', system-ui, sans-serif;
//     font-size: 14px;
//     color: ${t.text};
//   }

//   .rpt-label {
//     font-size: 11px;
//     font-weight: 600;
//     letter-spacing: 0.08em;
//     text-transform: uppercase;
//     color: ${t.textMuted};
//     margin-bottom: 14px;
//     display: block;
//   }

//   /* ── Radio pills ── */
//   .rpt-radios { display: flex; gap: 6px; flex-wrap: wrap; }
//   .rpt-radio-label {
//     position: relative;
//     cursor: pointer;
//   }
//   .rpt-radio-label input { position: absolute; opacity: 0; width: 0; height: 0; }
//   .rpt-pill {
//     display: inline-flex;
//     align-items: center;
//     height: 34px;
//     padding: 0 14px;
//     border-radius: 34px;
//     border: 1px solid ${t.border};
//     font-size: 13px;
//     font-weight: 500;
//     color: ${t.textMid};
//     background: ${t.surface};
//     cursor: pointer;
//     transition: all 0.15s;
//     user-select: none;
//   }
//   .rpt-radio-label input:checked + .rpt-pill {
//     background: ${t.accent};
//     border-color: ${t.accent};
//     color: #FFFFFF;
//   }
//   .rpt-radio-label:hover input:not(:checked) + .rpt-pill {
//     border-color: ${t.borderStrong};
//     color: ${t.text};
//   }

//   /* ── Form fields ── */
//   .rpt-field { display: flex; flex-direction: column; gap: 6px; }
//   .rpt-field-label {
//     font-size: 12px;
//     font-weight: 500;
//     color: ${t.textMid};
//     letter-spacing: 0.01em;
//   }
//   .rpt-input, .rpt-select {
//     height: 40px;
//     padding: 0 12px;
//     font-size: 13.5px;
//     font-family: inherit;
//     color: ${t.text};
//     background: ${t.surface};
//     border: 1px solid ${t.border};
//     border-radius: ${t.radiusSm};
//     outline: none;
//     transition: border-color 0.15s, box-shadow 0.15s;
//     width: 100%;
//   }
//   .rpt-input:hover, .rpt-select:hover { border-color: ${t.borderStrong}; }
//   .rpt-input:focus, .rpt-select:focus {
//     border-color: ${t.accent};
//     box-shadow: 0 0 0 3px rgba(13,13,13,0.07);
//   }
//   .rpt-select-wrap { position: relative; }
//   .rpt-select { appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer; }
//   .rpt-select-icon {
//     position: absolute;
//     right: 11px;
//     top: 50%;
//     transform: translateY(-50%);
//     pointer-events: none;
//     color: ${t.textMuted};
//   }

//   /* ── Grid ── */
//   .rpt-grid { display: grid; gap: 14px; }
//   .rpt-grid-2 { grid-template-columns: repeat(2, 1fr); }
//   .rpt-grid-3 { grid-template-columns: repeat(3, 1fr); }
//   .rpt-grid-4 { grid-template-columns: repeat(4, 1fr); }
//   @media (max-width: 640px) {
//     .rpt-grid-2, .rpt-grid-3, .rpt-grid-4 { grid-template-columns: 1fr; }
//   }

//   /* ── Divider ── */
//   .rpt-divider { border: none; border-top: 1px solid ${t.border}; margin: 28px 0; }

//   /* ── Buttons ── */
//   .rpt-btn-primary {
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     height: 40px;
//     padding: 0 18px;
//     font-size: 13.5px;
//     font-weight: 500;
//     font-family: inherit;
//     color: #FFFFFF;
//     background: ${t.accent};
//     border: none;
//     border-radius: ${t.radiusSm};
//     cursor: pointer;
//     transition: background 0.15s, opacity 0.15s;
//   }
//   .rpt-btn-primary:hover:not(:disabled) { background: ${t.accentHover}; }
//   .rpt-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

//   .rpt-btn-ghost {
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     height: 40px;
//     padding: 0 14px;
//     font-size: 13px;
//     font-weight: 500;
//     font-family: inherit;
//     color: ${t.textMid};
//     background: transparent;
//     border: 1px solid ${t.border};
//     border-radius: ${t.radiusSm};
//     cursor: pointer;
//     transition: all 0.15s;
//   }
//   .rpt-btn-ghost:hover {
//     border-color: ${t.borderStrong};
//     color: ${t.text};
//     background: #F5F5F5;
//   }

//   /* ── Spinner ── */
//   @keyframes rpt-spin { to { transform: rotate(360deg); } }
//   .rpt-spinner {
//     width: 14px; height: 14px;
//     border: 1.5px solid rgba(255,255,255,0.35);
//     border-top-color: #FFF;
//     border-radius: 50%;
//     animation: rpt-spin 0.8s linear infinite;
//     flex-shrink: 0;
//   }
//   .rpt-spinner-dark {
//     width: 28px; height: 28px;
//     border: 2px solid ${t.border};
//     border-top-color: ${t.accent};
//     border-radius: 50%;
//     animation: rpt-spin 0.8s linear infinite;
//   }

//   /* ── Toast ── */
//   .rpt-toast {
//     position: fixed;
//     bottom: 24px;
//     right: 24px;
//     z-index: 9999;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     background: ${t.surface};
//     border: 1px solid ${t.border};
//     border-radius: ${t.radius};
//     padding: 12px 16px;
//     box-shadow: 0 2px 20px rgba(0,0,0,0.08);
//     font-size: 13px;
//     font-weight: 500;
//     color: ${t.text};
//     max-width: 320px;
//     font-family: inherit;
//   }
//   .rpt-toast-close {
//     background: none;
//     border: none;
//     cursor: pointer;
//     color: ${t.textMuted};
//     padding: 0;
//     display: flex;
//     margin-left: auto;
//     flex-shrink: 0;
//   }

//   /* ── Section header row ── */
//   .rpt-section-row {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     margin-bottom: 18px;
//   }
//   .rpt-section-icon {
//     width: 28px;
//     height: 28px;
//     border-radius: 7px;
//     background: #F0F0F0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-shrink: 0;
//   }
//   .rpt-section-title {
//     font-size: 13px;
//     font-weight: 600;
//     color: ${t.text};
//     letter-spacing: -0.01em;
//   }
//   .rpt-section-sub {
//     font-size: 12px;
//     color: ${t.textMuted};
//     margin-left: auto;
//   }

//   /* ── Filter badge ── */
//   .rpt-badge {
//     display: inline-flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 11px;
//     font-weight: 500;
//     color: ${t.textMid};
//     background: #F2F2F2;
//     border: 1px solid ${t.border};
//     border-radius: 20px;
//     padding: 2px 9px;
//   }

//   /* ── Actions row ── */
//   .rpt-actions {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding-top: 24px;
//     border-top: 1px solid ${t.border};
//     gap: 10px;
//     flex-wrap: wrap;
//   }
// `;

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const Toast = ({ open, type, message, onClose }) => {
//   if (!open) return null;
//   const ok = type === 'success';
//   return (
//     <div className="rpt-toast">
//       {ok
//         ? <CheckCircle size={15} color="#16A34A" style={{ flexShrink: 0 }} />
//         : <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0 }} />}
//       <span style={{ flex: 1 }}>{message}</span>
//       <button className="rpt-toast-close" onClick={onClose}><X size={13} /></button>
//     </div>
//   );
// };

// const Field = ({ label, children }) => (
//   <div className="rpt-field">
//     <label className="rpt-field-label">{label}</label>
//     {children}
//   </div>
// );

// const SelectWrap = ({ value, onChange, children }) => (
//   <div className="rpt-select-wrap">
//     <select className="rpt-select" value={value} onChange={onChange}>{children}</select>
//     <span className="rpt-select-icon"><ChevronDown size={14} /></span>
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────

// const Reports = () => {
//   const [exportType, setExportType] = useState('day');
//   const [exportDate, setExportDate] = useState(dayjs().format('YYYY-MM-DD'));
//   const [exportStartDate, setExportStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
//   const [exportEndDate, setExportEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
//   const [exportMonth, setExportMonth] = useState(dayjs().month() + 1);
//   const [exportYear, setExportYear] = useState(dayjs().year());
//   const [exportBatchId, setExportBatchId] = useState('');
//   const [exportTrainerName, setExportTrainerName] = useState('');
//   const [exportCollegeId, setExportCollegeId] = useState('');
//   const [exportCompanyName, setExportCompanyName] = useState('');
//   const [exportDomainName, setExportDomainName] = useState('');
//   const [exportStudentName, setExportStudentName] = useState('');
//   const [availableBatches, setAvailableBatches] = useState([]);
//   const [trainers, setTrainers] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [domains, setDomains] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [exporting, setExporting] = useState(false);
//   const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
//   const [loadingTrainers, setLoadingTrainers] = useState(false);
//   const [loadingColleges, setLoadingColleges] = useState(false);
//   const [loadingDomains, setLoadingDomains] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   const [userPermissions, setUserPermissions] = useState([]);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);

//   // Hardcoded company list as per requirement
//  const companyOptions = [
//   "Exilance Software",
//   "Softcrowd Technologies",
//   "Codiant Solutions"
// ];

//   useEffect(() => {
//     fetchUserPermissions();
//     loadBatches();
//     loadTrainers();
//     loadColleges();
//     loadDomains();
//     loadStudents();
//   }, []);

//   const fetchUserPermissions = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${BASE_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.data.success) {
//         setIsSuperAdmin(res.data.data.is_super_admin || false);
//         setUserPermissions(res.data.data.permissions || []);
//         setUserRole(res.data.data.role || '');
//       }
//     } catch (err) {
//       console.error('Error fetching permissions:', err);
//     } finally {
//       setPermissionsLoaded(true);
//     }
//   };

//   const loadBatches = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${BASE_URL}/batches`, { headers: { Authorization: `Bearer ${token}` } });
//       if (res.data?.data) setAvailableBatches(res.data.data);
//     } catch (err) { console.error('Error loading batches:', err); }
//   };

//   const loadTrainers = async () => {
//   setLoadingTrainers(true);
//   try {
//     const token = localStorage.getItem('token');
//     const res = await axios.get(`${BASE_URL}/users`, {
//       headers: { Authorization: `Bearer ${token}` }
//       // Removed pagination params
//     });
    
//     console.log('API Response:', res.data);
    
//     if (res.data?.success && res.data?.data) {
//       const allUsers = res.data.data;
      
//       console.log('All users fetched:', allUsers);
      
//       const trainersList = allUsers.filter(user => {
//         if (user.role && typeof user.role === 'object') {
//           return user.role.slug?.toLowerCase() === 'trainer' || 
//                  user.role.name?.toLowerCase() === 'trainer';
//         }
//         if (typeof user.role === 'string') {
//           return user.role.toLowerCase() === 'trainer';
//         }
//         return false;
//       });
      
//       console.log('Filtered trainers:', trainersList);
//       setTrainers(trainersList);
      
//       if (trainersList.length === 0 && allUsers.length > 0) {
//         console.log('Available roles in users:', 
//           [...new Set(allUsers.map(u => {
//             if (u.role && typeof u.role === 'object') {
//               return `${u.role.name} (${u.role.slug})`;
//             }
//             return u.role;
//           }))]
//         );
//       }
//     } else {
//       console.log('No users data in response');
//     }
//   } catch (err) {
//     console.error('Error loading trainers:', err);
//     showToast('error', 'Failed to load trainers list');
//   } finally {
//     setLoadingTrainers(false);
//   }
// };

//   const loadColleges = async () => {
//     setLoadingColleges(true);
//     try {
//       const token = localStorage.getItem('token');
//       let allColleges = [];
//       let currentPage = 1;
//       let hasMore = true;
      
//       while (hasMore) {
//         const res = await axios.get(`https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/colleges`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page: currentPage }
//         });
        
//         console.log('Colleges API Response:', res.data);
        
//         if (res.data?.data) {
//           allColleges = [...allColleges, ...res.data.data];
          
//           if (res.data.last_page !== undefined) {
//             hasMore = currentPage < res.data.last_page;
//             currentPage++;
//           } else {
//             hasMore = false;
//           }
//         } else {
//           hasMore = false;
//         }
//       }
      
//       console.log('All colleges fetched:', allColleges);
//       setColleges(allColleges);
//     } catch (err) {
//       console.error('Error loading colleges:', err);
//       showToast('error', 'Failed to load colleges list');
//     } finally {
//       setLoadingColleges(false);
//     }
//   };

//   const loadDomains = async () => {
//     setLoadingDomains(true);
//     try {
//       const token = localStorage.getItem('token');
//       let allDomains = [];
//       let currentPage = 1;
//       let hasMore = true;
      
//       while (hasMore) {
//         const res = await axios.get(`https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/domains`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page: currentPage }
//         });
        
//         console.log('Domains API Response:', res.data);
        
//         if (res.data?.data) {
//           allDomains = [...allDomains, ...res.data.data];
          
//           if (res.data.last_page !== undefined) {
//             hasMore = currentPage < res.data.last_page;
//             currentPage++;
//           } else {
//             hasMore = false;
//           }
//         } else {
//           hasMore = false;
//         }
//       }
      
//       console.log('All domains fetched:', allDomains);
//       setDomains(allDomains);
//     } catch (err) {
//       console.error('Error loading domains:', err);
//       showToast('error', 'Failed to load domains list');
//     } finally {
//       setLoadingDomains(false);
//     }
//   };

//   const loadStudents = async () => {
//     setLoadingStudents(true);
//     try {
//       const token = localStorage.getItem('token');
//       let allStudents = [];
//       let currentPage = 1;
//       let hasMore = true;
      
//       while (hasMore) {
//         const res = await axios.get(`https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/students`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page: currentPage }
//         });
        
//         console.log('Students API Response:', res.data);
        
//         if (res.data?.data) {
//           allStudents = [...allStudents, ...res.data.data];
          
//           if (res.data.last_page !== undefined) {
//             hasMore = currentPage < res.data.last_page;
//             currentPage++;
//           } else {
//             hasMore = false;
//           }
//         } else {
//           hasMore = false;
//         }
//       }
      
//       console.log('All students fetched:', allStudents);
//       setStudents(allStudents);
//     } catch (err) {
//       console.error('Error loading students:', err);
//       showToast('error', 'Failed to load students list');
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   const canView = isSuperAdmin || hasPermission(userPermissions, MODULES.REPORTS, PAGES.REPORTS, ACTIONS.VIEW);
  
//   const showToast = (type, message) => setToast({ open: true, type, message });

//   // Check if user is from college role
//   const isCollegeRole = userRole?.toLowerCase() === 'college';

//   const doExport = async () => {
//     if (!canView) { showToast('error', "You don't have permission to export reports."); return; }
//     setExporting(true);
//     try {
//       const token = localStorage.getItem('token');
//       const params = { type: exportType };
      
//       // Date parameters
//       if (exportType === 'day') params.date = exportDate;
//       else if (exportType === 'week') { params.start_date = exportStartDate; params.end_date = exportEndDate; }
//       else if (exportType === 'month') { params.month = exportMonth; params.year = exportYear; }
      
//       // Filter parameters - based on role
//       if (exportBatchId && !isCollegeRole) params.batch_id = exportBatchId;
//       if (exportTrainerName && !isCollegeRole) params.trainer_name = exportTrainerName;
//       if (exportCollegeId) params.college_id = exportCollegeId;
//       if (exportCompanyName) params.company_name = exportCompanyName;
//       if (exportDomainName && !isCollegeRole) params.domain_name = exportDomainName;
//       if (exportStudentName) params.student_name = exportStudentName;

//       console.log('Export params:', params);

//       const response = await axios.get(`${BASE_URL}/reports/attendance`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//         responseType: 'blob',
//       });

//       const contentType = response.headers['content-type'] || '';
//       const ext = contentType.includes('csv') ? '.csv' : '.xlsx';
//       const mime = contentType.includes('csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

//       const blob = new Blob([response.data], { type: mime });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;

//       let filename = `attendance_report_${exportType}`;
//       if (exportType === 'day') filename += `_${exportDate}`;
//       else if (exportType === 'week') filename += `_${exportStartDate}_to_${exportEndDate}`;
//       else if (exportType === 'month') filename += `_${exportYear}_${String(exportMonth).padStart(2, '0')}`;
//       if (exportBatchId && !isCollegeRole) filename += `_batch_${exportBatchId}`;
//       if (exportTrainerName && !isCollegeRole) filename += `_trainer_${exportTrainerName}`;
//       if (exportCollegeId) filename += `_college_${exportCollegeId}`;
//       if (exportCompanyName) filename += `_company_${exportCompanyName.replace(/\s/g, '_')}`;
//       if (exportDomainName && !isCollegeRole) filename += `_domain_${exportDomainName.replace(/\s/g, '_')}`;
//       if (exportStudentName) filename += `_student_${exportStudentName.replace(/\s/g, '_')}`;
//       filename += ext;

//       link.setAttribute('download', filename);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       showToast('success', 'Report downloaded successfully.');
//     } catch (err) {
//       console.error('Export error:', err);
//       showToast('error', 'Failed to export. Please try again.');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const resetFilters = () => {
//     setExportBatchId('');
//     setExportTrainerName('');
//     setExportCollegeId('');
//     setExportCompanyName('');
//     setExportDomainName('');
//     setExportStudentName('');
//     setExportType('day');
//     setExportDate(dayjs().format('YYYY-MM-DD'));
//     setExportStartDate(dayjs().startOf('week').format('YYYY-MM-DD'));
//     setExportEndDate(dayjs().endOf('week').format('YYYY-MM-DD'));
//     setExportMonth(dayjs().month() + 1);
//     setExportYear(dayjs().year());
//   };

//   const months = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'];

//   const activeFilters = [
//     !isCollegeRole && exportBatchId && 'Batch filtered',
//     !isCollegeRole && exportTrainerName && 'Trainer filtered',
//     exportCollegeId && 'College filtered',
//     exportCompanyName && 'Company filtered',
//     !isCollegeRole && exportDomainName && 'Domain filtered',
//     exportStudentName && 'Student filtered',
//   ].filter(Boolean);

//   if (!permissionsLoaded) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div style={{ textAlign: 'center' }}>
//           <div className="rpt-spinner-dark" style={{ margin: '0 auto 12px' }} />
//           <p style={{ fontSize: '13px', color: t.textMuted, fontFamily: 'inherit' }}>Loading…</p>
//         </div>
//       </div>
//     );
//   }

//   // Determine grid columns based on role
//   const getGridColumns = () => {
//     if (isCollegeRole) {
//       return "rpt-grid rpt-grid-3";
//     }
//     return "rpt-grid rpt-grid-4";
//   };

//   return (
//     <div className="rpt-root">
//       <style>{globalCSS}</style>

//       {/* ── Page header ── */}
//       <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
//         <div>
//           <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.03em', color: t.text }}>
//             Reports
//           </h1>
//           <p style={{ fontSize: 13.5, color: t.textMuted, margin: '3px 0 0' }}>
//             Attendance report generation
//           </p>
//         </div>
//       </div>

//       {/* ── Card ── */}
//       <div style={{
//         background: t.surface,
//         border: `1px solid ${t.border}`,
//         borderRadius: 14,
//         overflow: 'hidden',
//       }}>

//         {/* Card header stripe */}
//         <div style={{
//           padding: '20px 28px',
//           borderBottom: `1px solid ${t.border}`,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 10,
//         }}>
//           <div style={{
//             width: 32, height: 32,
//             background: '#F0F0F0',
//             borderRadius: 8,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}>
//             <FileText size={15} color={t.textMid} />
//           </div>
//           <div>
//             <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0, color: t.text }}>Attendance report</p>
//             <p style={{ fontSize: 12, color: t.textMuted, margin: '1px 0 0' }}>
//               Configure and download attendance data as a spreadsheet
//             </p>
//           </div>
//           {activeFilters.length > 0 && (
//             <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
//               {activeFilters.map(f => (
//                 <span key={f} className="rpt-badge"><Filter size={10} /> {f}</span>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Card body */}
//         <div style={{ padding: '28px 28px 0' }}>

//           {/* ── Date range ── */}
//           <div style={{ marginBottom: 28 }}>
//             <span className="rpt-label">Date range</span>
//             <div className="rpt-radios">
//               {[['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']].map(([val, lbl]) => (
//                 <label key={val} className="rpt-radio-label">
//                   <input type="radio" name="exportType" value={val}
//                     checked={exportType === val}
//                     onChange={() => setExportType(val)} />
//                   <span className="rpt-pill">{lbl}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* ── Date inputs ── */}
//           <div style={{ marginBottom: 28 }}>
//             <div className={`rpt-grid ${exportType === 'week' ? 'rpt-grid-2' : ''}`}
//               style={{ maxWidth: exportType === 'month' ? 480 : exportType === 'week' ? 520 : 260 }}>

//               {exportType === 'day' && (
//                 <Field label="Date">
//                   <input className="rpt-input" type="date"
//                     value={exportDate} onChange={e => setExportDate(e.target.value)} />
//                 </Field>
//               )}

//               {exportType === 'week' && (
//                 <>
//                   <Field label="Start date">
//                     <input className="rpt-input" type="date"
//                       value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} />
//                   </Field>
//                   <Field label="End date">
//                     <input className="rpt-input" type="date"
//                       value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} />
//                   </Field>
//                 </>
//               )}

//               {exportType === 'month' && (
//                 <div className="rpt-grid rpt-grid-2">
//                   <Field label="Month">
//                     <SelectWrap value={exportMonth} onChange={e => setExportMonth(Number(e.target.value))}>
//                       {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
//                     </SelectWrap>
//                   </Field>
//                   <Field label="Year">
//                     <input className="rpt-input" type="number"
//                       value={exportYear} min={2020} max={2030}
//                       onChange={e => setExportYear(Number(e.target.value))} />
//                   </Field>
//                 </div>
//               )}
//             </div>
//           </div>

//           <hr className="rpt-divider" style={{ margin: '0 0 28px' }} />

//           {/* ── Filters ── */}
//           <div style={{ marginBottom: 28 }}>
//             <span className="rpt-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//               Filters
//               <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#C0C0C0' }}>— optional</span>
//             </span>

//             <div className={getGridColumns()} style={{ maxWidth: isCollegeRole ? 780 : 1020 }}>
//               {/* Batch Filter - Hidden for College Role */}
//               {!isCollegeRole && (
//                 <Field label="Batch">
//                   <SelectWrap value={exportBatchId} onChange={e => setExportBatchId(e.target.value)}>
//                     <option value="">All batches</option>
//                     {availableBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//                   </SelectWrap>
//                 </Field>
//               )}

//               {/* Trainer Filter - Hidden for College Role */}
//               {!isCollegeRole && (
//                 <Field label="Trainer">
//                   <SelectWrap value={exportTrainerName} onChange={e => setExportTrainerName(e.target.value)}>
//                     <option value="">All trainers</option>
//                     {loadingTrainers ? (
//                       <option value="" disabled>Loading trainers...</option>
//                     ) : (
//                       trainers.map(trainer => (
//                         <option key={trainer._id} value={trainer.name}>
//                           {trainer.name}
//                         </option>
//                       ))
//                     )}
//                   </SelectWrap>
//                 </Field>
//               )}

//               {/* College Filter - Visible for all roles */}
//               <Field label="College">
//                 <SelectWrap value={exportCollegeId} onChange={e => setExportCollegeId(e.target.value)}>
//                   <option value="">All colleges</option>
//                   {loadingColleges ? (
//                     <option value="" disabled>Loading colleges...</option>
//                   ) : (
//                     colleges.map(college => (
//                       <option key={college.id} value={college.id}>
//                         {college.name}
//                       </option>
//                     ))
//                   )}
//                 </SelectWrap>
//               </Field>

//               {/* Company Filter - Visible for all roles */}
//               <Field label="Company">
//                 <SelectWrap value={exportCompanyName} onChange={e => setExportCompanyName(e.target.value)}>
//                   <option value="">All companies</option>
//                   {companyOptions.map(company => (
//                     <option key={company} value={company}>
//                       {company}
//                     </option>
//                   ))}
//                 </SelectWrap>
//               </Field>

//               {/* Domain Filter - Hidden for College Role */}
//               {/* {!isCollegeRole && (
//                 <Field label="Domain">
//                   <SelectWrap value={exportDomainName} onChange={e => setExportDomainName(e.target.value)}>
//                     <option value="">All domains</option>
//                     {loadingDomains ? (
//                       <option value="" disabled>Loading domains...</option>
//                     ) : (
//                       domains.map(domain => (
//                         <option key={domain.id} value={domain.name}>
//                           {domain.name}
//                         </option>
//                       ))
//                     )}
//                   </SelectWrap>
//                 </Field>
//               )} */}

//               {/* Student Filter - Visible for all roles */}
//               <Field label="Student">
//                 <SelectWrap value={exportStudentName} onChange={e => setExportStudentName(e.target.value)}>
//                   <option value="">All students</option>
//                   {loadingStudents ? (
//                     <option value="" disabled>Loading students...</option>
//                   ) : (
//                     students.map(student => (
//                       <option key={student.id} value={student.name}>
//                         {student.name}
//                       </option>
//                     ))
//                   )}
//                 </SelectWrap>
//               </Field>
//             </div>
//           </div>
//         </div>

//         {/* ── Actions ── */}
//         <div style={{ padding: '0 28px 28px' }}>
//           <div className="rpt-actions">
//             <button className="rpt-btn-ghost" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//               <RotateCcw size={13} /> Reset
//             </button>
//             <button className="rpt-btn-primary" onClick={doExport} disabled={exporting}>
//               {exporting
//                 ? <><div className="rpt-spinner" /> Generating…</>
//                 : <><Download size={13} /> Generate &amp; download</>}
//             </button>
//           </div>
//         </div>
//       </div>

//       <Toast
//         open={toast.open}
//         type={toast.type}
//         message={toast.message}
//         onClose={() => setToast(t => ({ ...t, open: false }))}
//       />
//     </div>
//   );
// };

// export default Reports;




import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  ChevronDown,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  X,
  FileText,
  Filter,
} from 'lucide-react';
import dayjs from 'dayjs';
import axios from 'axios';
import BASE_URL from '../config/Config';
import { ACTIONS, hasPermission, MODULES, PAGES } from '../utils/modulePermissions';

// ─── Tokens ──────────────────────────────────────────────────────────────────

const t = {
  bg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E8E8E8',
  borderStrong: '#D0D0D0',
  text: '#0D0D0D',
  textMid: '#555555',
  textMuted: '#999999',
  accent: '#0D0D0D',
  accentHover: '#2A2A2A',
  radius: '10px',
  radiusSm: '7px',
  fontMono: '"JetBrains Mono", "Fira Mono", monospace',
  fontSans: '"Geist", "DM Sans", system-ui, sans-serif',
};

// ─── Base styles (injected once) ─────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  .rpt-root * { box-sizing: border-box; }

  .rpt-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px;
    color: ${t.text};
  }

  .rpt-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${t.textMuted};
    margin-bottom: 14px;
    display: block;
  }

  /* ── Radio pills ── */
  .rpt-radios { display: flex; gap: 6px; flex-wrap: wrap; }
  .rpt-radio-label {
    position: relative;
    cursor: pointer;
  }
  .rpt-radio-label input { position: absolute; opacity: 0; width: 0; height: 0; }
  .rpt-pill {
    display: inline-flex;
    align-items: center;
    height: 34px;
    padding: 0 14px;
    border-radius: 34px;
    border: 1px solid ${t.border};
    font-size: 13px;
    font-weight: 500;
    color: ${t.textMid};
    background: ${t.surface};
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }
  .rpt-radio-label input:checked + .rpt-pill {
    background: ${t.accent};
    border-color: ${t.accent};
    color: #FFFFFF;
  }
  .rpt-radio-label:hover input:not(:checked) + .rpt-pill {
    border-color: ${t.borderStrong};
    color: ${t.text};
  }

  /* ── Form fields ── */
  .rpt-field { display: flex; flex-direction: column; gap: 6px; }
  .rpt-field-label {
    font-size: 12px;
    font-weight: 500;
    color: ${t.textMid};
    letter-spacing: 0.01em;
  }
  .rpt-input, .rpt-select {
    height: 40px;
    padding: 0 12px;
    font-size: 13.5px;
    font-family: inherit;
    color: ${t.text};
    background: ${t.surface};
    border: 1px solid ${t.border};
    border-radius: ${t.radiusSm};
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }
  .rpt-input:hover, .rpt-select:hover { border-color: ${t.borderStrong}; }
  .rpt-input:focus, .rpt-select:focus {
    border-color: ${t.accent};
    box-shadow: 0 0 0 3px rgba(13,13,13,0.07);
  }
  .rpt-select-wrap { position: relative; }
  .rpt-select { appearance: none; -webkit-appearance: none; padding-right: 36px; cursor: pointer; }
  .rpt-select-icon {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: ${t.textMuted};
  }

  /* ── Grid ── */
  .rpt-grid { display: grid; gap: 14px; }
  .rpt-grid-2 { grid-template-columns: repeat(2, 1fr); }
  .rpt-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .rpt-grid-4 { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 640px) {
    .rpt-grid-2, .rpt-grid-3, .rpt-grid-4 { grid-template-columns: 1fr; }
  }

  /* ── Divider ── */
  .rpt-divider { border: none; border-top: 1px solid ${t.border}; margin: 28px 0; }

  /* ── Buttons ── */
  .rpt-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 40px;
    padding: 0 18px;
    font-size: 13.5px;
    font-weight: 500;
    font-family: inherit;
    color: #FFFFFF;
    background: ${t.accent};
    border: none;
    border-radius: ${t.radiusSm};
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
  }
  .rpt-btn-primary:hover:not(:disabled) { background: ${t.accentHover}; }
  .rpt-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .rpt-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 40px;
    padding: 0 14px;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    color: ${t.textMid};
    background: transparent;
    border: 1px solid ${t.border};
    border-radius: ${t.radiusSm};
    cursor: pointer;
    transition: all 0.15s;
  }
  .rpt-btn-ghost:hover {
    border-color: ${t.borderStrong};
    color: ${t.text};
    background: #F5F5F5;
  }

  /* ── Spinner ── */
  @keyframes rpt-spin { to { transform: rotate(360deg); } }
  .rpt-spinner {
    width: 14px; height: 14px;
    border: 1.5px solid rgba(255,255,255,0.35);
    border-top-color: #FFF;
    border-radius: 50%;
    animation: rpt-spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  .rpt-spinner-dark {
    width: 28px; height: 28px;
    border: 2px solid ${t.border};
    border-top-color: ${t.accent};
    border-radius: 50%;
    animation: rpt-spin 0.8s linear infinite;
  }

  /* ── Toast ── */
  .rpt-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${t.surface};
    border: 1px solid ${t.border};
    border-radius: ${t.radius};
    padding: 12px 16px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    font-size: 13px;
    font-weight: 500;
    color: ${t.text};
    max-width: 320px;
    font-family: inherit;
  }
  .rpt-toast-close {
    background: none;
    border: none;
    cursor: pointer;
    color: ${t.textMuted};
    padding: 0;
    display: flex;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── Section header row ── */
  .rpt-section-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
  }
  .rpt-section-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: #F0F0F0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rpt-section-title {
    font-size: 13px;
    font-weight: 600;
    color: ${t.text};
    letter-spacing: -0.01em;
  }
  .rpt-section-sub {
    font-size: 12px;
    color: ${t.textMuted};
    margin-left: auto;
  }

  /* ── Filter badge ── */
  .rpt-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 500;
    color: ${t.textMid};
    background: #F2F2F2;
    border: 1px solid ${t.border};
    border-radius: 20px;
    padding: 2px 9px;
  }

  /* ── Actions row ── */
  .rpt-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid ${t.border};
    gap: 10px;
    flex-wrap: wrap;
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Toast = ({ open, type, message, onClose }) => {
  if (!open) return null;
  const ok = type === 'success';
  return (
    <div className="rpt-toast">
      {ok
        ? <CheckCircle size={15} color="#16A34A" style={{ flexShrink: 0 }} />
        : <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{message}</span>
      <button className="rpt-toast-close" onClick={onClose}><X size={13} /></button>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="rpt-field">
    <label className="rpt-field-label">{label}</label>
    {children}
  </div>
);

const SelectWrap = ({ value, onChange, children }) => (
  <div className="rpt-select-wrap">
    <select className="rpt-select" value={value} onChange={onChange}>{children}</select>
    <span className="rpt-select-icon"><ChevronDown size={14} /></span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const Reports = () => {
  const [exportType, setExportType] = useState('day');
  const [exportDate, setExportDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [exportStartDate, setExportStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
  const [exportEndDate, setExportEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
  const [exportMonth, setExportMonth] = useState(dayjs().month() + 1);
  const [exportYear, setExportYear] = useState(dayjs().year());
  const [exportBatchId, setExportBatchId] = useState('');
  const [exportTrainerName, setExportTrainerName] = useState('');
  const [exportCollegeId, setExportCollegeId] = useState('');
  const [exportCompanyName, setExportCompanyName] = useState('');
  const [exportDomainName, setExportDomainName] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [domains, setDomains] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loadingDomains, setLoadingDomains] = useState(false);

  const [userPermissions, setUserPermissions] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Hardcoded company list as per requirement
 const companyOptions = [
  "Exilance Software",
  "Softcrowd Technologies",
  "Codiant Solutions"
];

  useEffect(() => {
    fetchUserPermissions();
    loadBatches();
    loadTrainers();
    loadColleges();
    loadDomains();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setIsSuperAdmin(res.data.data.is_super_admin || false);
        setUserPermissions(res.data.data.permissions || []);
        setUserRole(res.data.data.role || '');
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    } finally {
      setPermissionsLoaded(true);
    }
  };

  const loadBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/batches`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.data) setAvailableBatches(res.data.data);
    } catch (err) { console.error('Error loading batches:', err); }
  };

  const loadTrainers = async () => {
  setLoadingTrainers(true);
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
      // Removed pagination params
    });
    
    console.log('API Response:', res.data);
    
    if (res.data?.success && res.data?.data) {
      const allUsers = res.data.data;
      
      console.log('All users fetched:', allUsers);
      
      const trainersList = allUsers.filter(user => {
        if (user.role && typeof user.role === 'object') {
          return user.role.slug?.toLowerCase() === 'trainer' || 
                 user.role.name?.toLowerCase() === 'trainer';
        }
        if (typeof user.role === 'string') {
          return user.role.toLowerCase() === 'trainer';
        }
        return false;
      });
      
      console.log('Filtered trainers:', trainersList);
      setTrainers(trainersList);
      
      if (trainersList.length === 0 && allUsers.length > 0) {
        console.log('Available roles in users:', 
          [...new Set(allUsers.map(u => {
            if (u.role && typeof u.role === 'object') {
              return `${u.role.name} (${u.role.slug})`;
            }
            return u.role;
          }))]
        );
      }
    } else {
      console.log('No users data in response');
    }
  } catch (err) {
    console.error('Error loading trainers:', err);
    showToast('error', 'Failed to load trainers list');
  } finally {
    setLoadingTrainers(false);
  }
};

  const loadColleges = async () => {
    setLoadingColleges(true);
    try {
      const token = localStorage.getItem('token');
      let allColleges = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const res = await axios.get(`https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/colleges`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage }
        });
        
        console.log('Colleges API Response:', res.data);
        
        if (res.data?.data) {
          allColleges = [...allColleges, ...res.data.data];
          
          if (res.data.last_page !== undefined) {
            hasMore = currentPage < res.data.last_page;
            currentPage++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }
      
      console.log('All colleges fetched:', allColleges);
      setColleges(allColleges);
    } catch (err) {
      console.error('Error loading colleges:', err);
      showToast('error', 'Failed to load colleges list');
    } finally {
      setLoadingColleges(false);
    }
  };

  const loadDomains = async () => {
    setLoadingDomains(true);
    try {
      const token = localStorage.getItem('token');
      let allDomains = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const res = await axios.get(`https://exilancesoftware.in/softcrowd-itr-attendance-management/public/api/domains`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage }
        });
        
        console.log('Domains API Response:', res.data);
        
        if (res.data?.data) {
          allDomains = [...allDomains, ...res.data.data];
          
          if (res.data.last_page !== undefined) {
            hasMore = currentPage < res.data.last_page;
            currentPage++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }
      
      console.log('All domains fetched:', allDomains);
      setDomains(allDomains);
    } catch (err) {
      console.error('Error loading domains:', err);
      showToast('error', 'Failed to load domains list');
    } finally {
      setLoadingDomains(false);
    }
  };

  const canView = isSuperAdmin || hasPermission(userPermissions, MODULES.REPORTS, PAGES.REPORTS, ACTIONS.VIEW);
  
  const showToast = (type, message) => setToast({ open: true, type, message });

  // Check if user is from college role
  const isCollegeRole = userRole?.toLowerCase() === 'college';

  const doExport = async () => {
    if (!canView) { showToast('error', "You don't have permission to export reports."); return; }
    setExporting(true);
    try {
      const token = localStorage.getItem('token');
      const params = { type: exportType };
      
      // Date parameters
      if (exportType === 'day') params.date = exportDate;
      else if (exportType === 'week') { params.start_date = exportStartDate; params.end_date = exportEndDate; }
      else if (exportType === 'month') { params.month = exportMonth; params.year = exportYear; }
      
      // Filter parameters - based on role
      if (exportBatchId && !isCollegeRole) params.batch_id = exportBatchId;
      if (exportTrainerName && !isCollegeRole) params.trainer_name = exportTrainerName;
      if (exportCollegeId) params.college_id = exportCollegeId;
      if (exportCompanyName) params.company_name = exportCompanyName;
      if (exportDomainName && !isCollegeRole) params.domain_name = exportDomainName;

      console.log('Export params:', params);

      const response = await axios.get(`${BASE_URL}/reports/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'] || '';
      const ext = contentType.includes('csv') ? '.csv' : '.xlsx';
      const mime = contentType.includes('csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      const blob = new Blob([response.data], { type: mime });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let filename = `attendance_report_${exportType}`;
      if (exportType === 'day') filename += `_${exportDate}`;
      else if (exportType === 'week') filename += `_${exportStartDate}_to_${exportEndDate}`;
      else if (exportType === 'month') filename += `_${exportYear}_${String(exportMonth).padStart(2, '0')}`;
      if (exportBatchId && !isCollegeRole) filename += `_batch_${exportBatchId}`;
      if (exportTrainerName && !isCollegeRole) filename += `_trainer_${exportTrainerName}`;
      if (exportCollegeId) filename += `_college_${exportCollegeId}`;
      if (exportCompanyName) filename += `_company_${exportCompanyName.replace(/\s/g, '_')}`;
      if (exportDomainName && !isCollegeRole) filename += `_domain_${exportDomainName.replace(/\s/g, '_')}`;
      filename += ext;

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('success', 'Report downloaded successfully.');
    } catch (err) {
      console.error('Export error:', err);
      showToast('error', 'Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setExportBatchId('');
    setExportTrainerName('');
    setExportCollegeId('');
    setExportCompanyName('');
    setExportDomainName('');
    setExportType('day');
    setExportDate(dayjs().format('YYYY-MM-DD'));
    setExportStartDate(dayjs().startOf('week').format('YYYY-MM-DD'));
    setExportEndDate(dayjs().endOf('week').format('YYYY-MM-DD'));
    setExportMonth(dayjs().month() + 1);
    setExportYear(dayjs().year());
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const activeFilters = [
    !isCollegeRole && exportBatchId && 'Batch filtered',
    !isCollegeRole && exportTrainerName && 'Trainer filtered',
    exportCollegeId && 'College filtered',
    exportCompanyName && 'Company filtered',
    !isCollegeRole && exportDomainName && 'Domain filtered',
  ].filter(Boolean);

  if (!permissionsLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="rpt-spinner-dark" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '13px', color: t.textMuted, fontFamily: 'inherit' }}>Loading…</p>
        </div>
      </div>
    );
  }

  // Determine grid columns based on role
  const getGridColumns = () => {
    if (isCollegeRole) {
      return "rpt-grid rpt-grid-3";
    }
    return "rpt-grid rpt-grid-4";
  };

  return (
    <div className="rpt-root">
      <style>{globalCSS}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.03em', color: t.text }}>
            Reports
          </h1>
          <p style={{ fontSize: 13.5, color: t.textMuted, margin: '3px 0 0' }}>
            Attendance report generation
          </p>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        overflow: 'hidden',
      }}>

        {/* Card header stripe */}
        <div style={{
          padding: '20px 28px',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 32, height: 32,
            background: '#F0F0F0',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={15} color={t.textMid} />
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, margin: 0, color: t.text }}>Attendance report</p>
            <p style={{ fontSize: 12, color: t.textMuted, margin: '1px 0 0' }}>
              Configure and download attendance data as a spreadsheet
            </p>
          </div>
          {activeFilters.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {activeFilters.map(f => (
                <span key={f} className="rpt-badge"><Filter size={10} /> {f}</span>
              ))}
            </div>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '28px 28px 0' }}>

          {/* ── Date range ── */}
          <div style={{ marginBottom: 28 }}>
            <span className="rpt-label">Date range</span>
            <div className="rpt-radios">
              {[['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']].map(([val, lbl]) => (
                <label key={val} className="rpt-radio-label">
                  <input type="radio" name="exportType" value={val}
                    checked={exportType === val}
                    onChange={() => setExportType(val)} />
                  <span className="rpt-pill">{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Date inputs ── */}
          <div style={{ marginBottom: 28 }}>
            <div className={`rpt-grid ${exportType === 'week' ? 'rpt-grid-2' : ''}`}
              style={{ maxWidth: exportType === 'month' ? 480 : exportType === 'week' ? 520 : 260 }}>

              {exportType === 'day' && (
                <Field label="Date">
                  <input className="rpt-input" type="date"
                    value={exportDate} onChange={e => setExportDate(e.target.value)} />
                </Field>
              )}

              {exportType === 'week' && (
                <>
                  <Field label="Start date">
                    <input className="rpt-input" type="date"
                      value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} />
                  </Field>
                  <Field label="End date">
                    <input className="rpt-input" type="date"
                      value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} />
                  </Field>
                </>
              )}

              {exportType === 'month' && (
                <div className="rpt-grid rpt-grid-2">
                  <Field label="Month">
                    <SelectWrap value={exportMonth} onChange={e => setExportMonth(Number(e.target.value))}>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </SelectWrap>
                  </Field>
                  <Field label="Year">
                    <input className="rpt-input" type="number"
                      value={exportYear} min={2020} max={2030}
                      onChange={e => setExportYear(Number(e.target.value))} />
                  </Field>
                </div>
              )}
            </div>
          </div>

          <hr className="rpt-divider" style={{ margin: '0 0 28px' }} />

          {/* ── Filters ── */}
          <div style={{ marginBottom: 28 }}>
            <span className="rpt-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Filters
              <span style={{ fontSize: 11, fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#C0C0C0' }}>— optional</span>
            </span>

            <div className={getGridColumns()} style={{ maxWidth: isCollegeRole ? 780 : 1020 }}>
              {/* Batch Filter - Hidden for College Role */}
              {!isCollegeRole && (
                <Field label="Batch">
                  <SelectWrap value={exportBatchId} onChange={e => setExportBatchId(e.target.value)}>
                    <option value="">All batches</option>
                    {availableBatches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </SelectWrap>
                </Field>
              )}

              {/* Trainer Filter - Hidden for College Role */}
              {!isCollegeRole && (
                <Field label="Trainer">
                  <SelectWrap value={exportTrainerName} onChange={e => setExportTrainerName(e.target.value)}>
                    <option value="">All trainers</option>
                    {loadingTrainers ? (
                      <option value="" disabled>Loading trainers...</option>
                    ) : (
                      trainers.map(trainer => (
                        <option key={trainer._id} value={trainer.name}>
                          {trainer.name}
                        </option>
                      ))
                    )}
                  </SelectWrap>
                </Field>
              )}

              {/* College Filter - Visible for all roles */}
              <Field label="College">
                <SelectWrap value={exportCollegeId} onChange={e => setExportCollegeId(e.target.value)}>
                  <option value="">All colleges</option>
                  {loadingColleges ? (
                    <option value="" disabled>Loading colleges...</option>
                  ) : (
                    colleges.map(college => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))
                  )}
                </SelectWrap>
              </Field>

              {/* Company Filter - Visible for all roles */}
              <Field label="Company">
                <SelectWrap value={exportCompanyName} onChange={e => setExportCompanyName(e.target.value)}>
                  <option value="">All companies</option>
                  {companyOptions.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </SelectWrap>
              </Field>

              {/* Domain Filter - Hidden for College Role */}
              {!isCollegeRole && (
                <Field label="Domain">
                  <SelectWrap value={exportDomainName} onChange={e => setExportDomainName(e.target.value)}>
                    <option value="">All domains</option>
                    {loadingDomains ? (
                      <option value="" disabled>Loading domains...</option>
                    ) : (
                      domains.map(domain => (
                        <option key={domain.id} value={domain.name}>
                          {domain.name}
                        </option>
                      ))
                    )}
                  </SelectWrap>
                </Field>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ padding: '0 28px 28px' }}>
          <div className="rpt-actions">
            <button className="rpt-btn-ghost" onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <RotateCcw size={13} /> Reset
            </button>
            <button className="rpt-btn-primary" onClick={doExport} disabled={exporting}>
              {exporting
                ? <><div className="rpt-spinner" /> Generating…</>
                : <><Download size={13} /> Generate &amp; download</>}
            </button>
          </div>
        </div>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </div>
  );
};

export default Reports;