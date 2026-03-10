import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicRoute from './components/routing/PublicRoute'; // I-import ito
import AdminLayout from './layouts/AdminLayout'; // Import ang layout
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import BrandingSettings from './pages/admin/BrandingSettings';

// 2. Import ang Pages
import Login from './pages/auth/Login';

// Placeholder Components (Para hindi mag-error habang wala pang separate files)
const AdminDashboard = () => (
  <div className="p-10">
    <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
    <p className="mt-2 text-slate-600">Welcome to the Command Center.</p>
  </div>
);

const Unauthorized = () => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold text-red-600">404 - Unauthorized Access</h1>
    <p>Wala kang permiso na makita ang page na ito.</p>
    <a href="/" className="text-blue-500 underline">Balik sa Login</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
  {/* 1. PUBLIC ROUTES */}
  <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  
  {/* 2. ADMIN ROUTES (Gawa mo) */}
  <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="branding" element={<BrandingSettings />} />
  </Route>

  {/* 3. CASHIER ROUTES (Kay Harvey) */}
  <Route path="/cashier" element={
      <ProtectedRoute allowedRoles={['cashier']}>
        {/* Pwede silang gumamit ng sariling Layout o yung layout mo rin */}
        <AdminLayout /> 
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<div>Cashier Dashboard (Harvey)</div>} />
    <Route path="payments" element={<div>Payments Module (Harvey)</div>} />
  </Route>

  {/* 4. LMS / TEACHER ROUTES (Kay Joshua) */}
  <Route path="/teacher" element={
      <ProtectedRoute allowedRoles={['teacher']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<div>Teacher Dashboard (Joshua)</div>} />
    <Route path="lessons" element={<div>Lessons Module (Joshua)</div>} />
  </Route>

  {/* 5. FALLBACK */}
  <Route path="*" element={<div>404 - Not Found</div>} />
</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;