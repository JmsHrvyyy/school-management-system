import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout, branding } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar Menu Configuration
  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'LMS (Classroom)', icon: '📚', path: '/lms' },
    { name: 'Accounting', icon: '💳', path: '/accounting' },
    { name: 'Enrollment', icon: '📝', path: '/enrollment' },
    { name: 'Grades', icon: '📊', path: '/grades' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col shadow-xl`}>
        {/* School Logo & Name Section */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800 mb-4">
          <div className="min-w-[40px] h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            {branding?.logoInitial || 'S'}
          </div>
          {isSidebarOpen && (
            <span className="font-black text-white text-sm tracking-tight truncate">
              {branding?.schoolName || 'SMS UNIVERSITY'}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all group"
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile / Logout Section (Bottom of Sidebar) */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-xl">👤</span>
            {isSidebarOpen && (
              <div className="text-left overflow-hidden">
                <p className="text-xs font-black text-white truncate">{user?.full_name || 'Student'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Logout</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
              >
                ☰
              </button>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                Student Portal
              </h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                <span className="text-xs font-bold text-blue-600">S.Y. 2025-2026 | 1st Sem</span>
              </div>
           </div>
        </header>

        {/* Dashboard View (The actual "Inside" of the portal) */}
        <main className="p-8 overflow-y-