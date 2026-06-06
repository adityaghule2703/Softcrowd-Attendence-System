import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";

import Attendance from "./pages/Attendance";


import Reports from "./pages/Reports";
import Login from "./auth/Login";
import StudentManagement from "./pages/studentmaster/StudentManagement";
import DepartmentManagement from "./pages/departmentmaster/DepartmentManagement";
import BatchManagement from "./pages/batchmaster/BatchManagement";
import CollegeManagement from "./pages/CollegeMaster/CollegeManagement";
import DomainManagement from "./pages/domainmaster/DomainManagement";
import Trainers from "./pages/trainermaster/Trainers";
import HolidayManagement from "./pages/holidaymaster/HolidayManagement";
import Roles from "./pages/roles/Roles";
import Users from "./pages/usermaster/Users";


// Protected Route Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!token || isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    // <BrowserRouter>

     <BrowserRouter basename="/itr-frontend">
      <Routes>
        {/* Public Routes - No authentication needed */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="dept-management" element={<DepartmentManagement />} />
           <Route path="domain-management" element={<DomainManagement />} />
           <Route path="holiday-management" element={<HolidayManagement />} />
          <Route path="batch-management" element={<BatchManagement />} />
          <Route path="student-management" element={<StudentManagement />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="college-management" element={<CollegeManagement />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;