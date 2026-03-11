import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout, branding } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* TOP NAVIGATION BAR */}
      <nav className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        
        {/* TOP LEFT: Logo and School Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-xl">
                {branding?.schoolName?.charAt(0) || 'S'}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-800 leading-tight tracking-tight">
              {branding?.schoolName || 'SCHOOL MANAGEMENT SYSTEM'}
            </h2>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
              Student Portal
            </span>
          </div>
        </div>

        {/* TOP RIGHT: User Profile & Logout */}
        <div className="flex items-center gap-4 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">
              {user?.full_name || 'Student Name'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {user?.student_id || '2024-0001'}
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 transition-all duration-300"
            title="Logout"
          >
            {/* User Icon Design */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-slate-600 group-hover:text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            
            {/* Logout Overlay Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] text-white">✕</span>
            </div>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back, <span className="text-blue-600">{user?.full_name?.split(' ')[0] || 'Student'}</span>!
          </h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your campus life today.</p>
        </header>

        {/* Dashboard Grid Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard icon="📚" title="My Classes" subtitle="LMS Modules" color="bg-blue-500" />
          <DashboardCard icon="💳" title="Accounting" subtitle="Payments & Balances" color="bg-emerald-500" />
          <DashboardCard icon="📝" title="Enrollment" subtitle="Subject Encoding" color="bg-amber-500" />
          <DashboardCard icon="📋" title="Grades" subtitle="Performance Record" color="bg-purple-500" />
        </div>
      </main>
    </div>
  );
};

// Reusable Small Component for clean code
const DashboardCard = ({ icon, title, subtitle, color }) => (
  <button className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
    <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
  </button>
);

export default StudentDashboard;