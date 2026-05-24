// src/utils/modulePermissions.js
// 
// ⚠️ Module Permissions Master - DO NOT modify without syncing with backend
// This file defines all modules, pages, and their allowed actions
// Used for permission checking throughout the application

export const MODULES = {
  // Dashboard
  DASHBOARD: 'DASHBOARD',
  
  // Administration
  USERS: 'USERS',
  ROLES: 'ROLES',
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  
  // Masters
  DEPARTMENT_MANAGEMENT: 'DEPARTMENT_MANAGEMENT',
  DOMAIN_MANAGEMENT: 'DOMAIN_MANAGEMENT',
  HOLIDAY_MANAGEMENT: 'HOLIDAY_MANAGEMENT',
  COLLEGE_MANAGEMENT: 'COLLEGE_MANAGEMENT',
  STUDENT_MANAGEMENT: 'STUDENT_MANAGEMENT',
  BATCH_MANAGEMENT: 'BATCH_MANAGEMENT',
  TRAINERS: 'TRAINERS',
  
  // Operations
  ATTENDANCE: 'ATTENDANCE',
  
  // Reports
  REPORTS: 'REPORTS'
};

export const PAGES = {
  // Dashboard
  DASHBOARD: 'Dashboard',
  
  // Administration
  USER_MANAGEMENT: 'User Management',
  USERS: 'Users',
  ROLES: 'Roles',
  
  // Masters
  DEPARTMENT_MANAGEMENT: 'Department Management',
  DOMAIN_MANAGEMENT: 'Domain Management',
  HOLIDAY_MANAGEMENT: 'Holiday Management',
  COLLEGE_MANAGEMENT: 'College Management',
  STUDENT_MANAGEMENT: 'Student Management',
  BATCH_MANAGEMENT: 'Batch Management',
  TRAINERS: 'Trainers',
  
  // Operations
  ATTENDANCE: 'Attendance',
  
  // Reports
  REPORTS: 'Reports'
};

export const ACTIONS = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

// Complete Module Configuration with Pages and Actions
export const MODULE_PERMISSIONS_CONFIG = [
  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.DASHBOARD,
    page: PAGES.DASHBOARD,
    category: 'Dashboard',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ADMINISTRATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.USER_MANAGEMENT,
    page: PAGES.USER_MANAGEMENT,
    category: 'Administration',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.USERS,
    page: PAGES.USERS,
    category: 'Administration',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.ROLES,
    page: PAGES.ROLES,
    category: 'Administration',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MASTERS
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.DEPARTMENT_MANAGEMENT,
    page: PAGES.DEPARTMENT_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.DOMAIN_MANAGEMENT,
    page: PAGES.DOMAIN_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.HOLIDAY_MANAGEMENT,
    page: PAGES.HOLIDAY_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.COLLEGE_MANAGEMENT,
    page: PAGES.COLLEGE_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.STUDENT_MANAGEMENT,
    page: PAGES.STUDENT_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.BATCH_MANAGEMENT,
    page: PAGES.BATCH_MANAGEMENT,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },
  {
    moduleKey: MODULES.TRAINERS,
    page: PAGES.TRAINERS,
    category: 'Masters',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.ATTENDANCE,
    page: PAGES.ATTENDANCE,
    category: 'Operations',
    actions: [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE, ACTIONS.DELETE]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // REPORTS
  // ─────────────────────────────────────────────────────────────────────────
  {
    moduleKey: MODULES.REPORTS,
    page: PAGES.REPORTS,
    category: 'Reports',
    actions: [ACTIONS.VIEW]  // Reports only need VIEW permission
  }
];

// Helper function to check if user has permission for a specific module and action
export const hasPermission = (userPermissions, moduleKey, page, action) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  
  // Check if user has the specific permission
  return userPermissions.some(perm => 
    perm.module_key === moduleKey && 
    perm.action === action
  );
};

// Helper function to check if user has view permission for a page
export const canViewPage = (userPermissions, moduleKey, page) => {
  return hasPermission(userPermissions, moduleKey, page, ACTIONS.VIEW);
};

// Helper function to get all allowed actions for a module/page
export const getAllowedActions = (userPermissions, moduleKey, page) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return [];
  
  return userPermissions
    .filter(perm => perm.module_key === moduleKey)
    .map(perm => perm.action);
};

// Helper function to get modules grouped by category
export const getModulesByCategory = () => {
  const grouped = {};
  MODULE_PERMISSIONS_CONFIG.forEach(module => {
    if (!grouped[module.category]) {
      grouped[module.category] = [];
    }
    grouped[module.category].push({
      moduleKey: module.moduleKey,
      page: module.page,
      actions: module.actions
    });
  });
  return grouped;
};

// Helper function to filter modules based on user permissions
export const getAccessibleModules = (userPermissions, isSuperAdmin = false) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return [];
  
  if (isSuperAdmin) {
    return MODULE_PERMISSIONS_CONFIG;
  }
  
  const accessibleModules = [];
  MODULE_PERMISSIONS_CONFIG.forEach(module => {
    const hasView = userPermissions.some(perm => 
      perm.module_key === module.moduleKey && 
      perm.action === ACTIONS.VIEW
    );
    if (hasView) {
      accessibleModules.push(module);
    }
  });
  return accessibleModules;
};

// Custom hook for permission checking (to be used in components)
export const usePermissionChecker = (userPermissions, isSuperAdmin = false) => {
  const checkPermission = (moduleKey, action) => {
    if (isSuperAdmin) return true;
    return hasPermission(userPermissions, moduleKey, null, action);
  };

  const canView = (moduleKey) => checkPermission(moduleKey, ACTIONS.VIEW);
  const canCreate = (moduleKey) => checkPermission(moduleKey, ACTIONS.CREATE);
  const canUpdate = (moduleKey) => checkPermission(moduleKey, ACTIONS.UPDATE);
  const canDelete = (moduleKey) => checkPermission(moduleKey, ACTIONS.DELETE);

  return { canView, canCreate, canUpdate, canDelete, checkPermission };
};

export default {
  MODULES,
  PAGES,
  ACTIONS,
  MODULE_PERMISSIONS_CONFIG,
  hasPermission,
  canViewPage,
  getAllowedActions,
  getModulesByCategory,
  getAccessibleModules,
  usePermissionChecker
};