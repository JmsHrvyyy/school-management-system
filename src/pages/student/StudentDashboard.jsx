import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, BookOpen, CreditCard, Lock, Unlock, 
  LogOut, GraduationCap, Calendar, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        // 1. Tawagin ang file na ginawa ng leader mo
        const response = await axios.get('http://localhost/sms-api/get_students.php');
        
        // 2. Hanapin ang data mo base sa email na gamit mo sa login
        const myData = response.data.find(s => s.email === user.email);

        if (myData) {
          setStudentData(myData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchStudentInfo();
  }, [user.email]);

  // LMS Logic: I-lock kung ang enrollment_status ay 'Pending' o kung walang record
  const isLocked = !studentData || studentData.enrollment_status === 'Pending';

  const handleLMSAccess = () => {
    if (isLocked) {
      alert("🛑 ACCESS DENIED: Naka-lock ang iyong LMS. Siguraduhing 'Verified' na ang iyong enrollment at bayad na ang iyong initial fees.");
    } else {
      navigate('/lms');
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center font-black animate-pulse text-[#001f3f]">
        LOADING CSPB PORTAL...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:row font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-[#001f3f] text-white p-8 flex flex-col border-r-4 border-yellow-500 min-h-screen">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-4 flex items-center justify-center text-[#001f3f] font-black text-2xl border-4 border-yellow-500 shadow-2xl">
            CSPB
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Colegio de San Pascual Baylon</h2>
        </div>

        <nav className="flex-1 space-y-3">
          <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm bg-yellow-500 text-[#001f3f]">
            <User size={20} /> Dashboard
          </button>
          
          <button 
            onClick={handleLMSAccess}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all
              ${isLocked ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed opacity-50' : 'hover:bg-white/10 text-slate-300'}`}
          >
            <div className="flex items-center gap-4"><BookOpen size={20} /> LMS Classroom</div>
            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>

          <button onClick={() => navigate('/accounting')} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm text-slate-300 hover:bg-white/10">
            <CreditCard size={20} /> Accounting
          </button>
        </nav>

        <button onClick={logout} className="mt-auto p-4 bg-red-600/20 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-600/30 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
          <LogOut size={16} /> Logout System
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Info */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-yellow-500 text-[#001f3f] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                {studentData?.enrollment_type || 'New Student'}
              </span>
              <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {studentData?.grade_level || 'Grade Level TBA'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
              Mabuhay, <span className="text-[#003366]">{studentData?.first_name || 'Student'}</span>!
            </h1>
            <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-[0.2em]">
              Student ID: {studentData?.student_id || 'Generating...'}
            </p>
          </div>

          {/* Status Alert */}
          {isLocked && (
            <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] mb-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="bg-red-500 text-white p-6 rounded-3xl shadow-lg shadow-red-200">
                <Lock size={40} />
              </div>
              <div>
                <h3 className="text-red-600 font-black uppercase text-xs tracking-widest mb-1">Account Restriction</h3>
                <h2 className="text-2xl font-black text-slate-800">Naka-lock ang iyong E-Learning Account</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  Bilang isang <b>{studentData?.enrollment_type}</b>, kailangang ma-verify muna ang iyong enrollment status. 
                  Mangyaring makipag-ugnayan sa Registrar o Cashier.
                </p>
              </div>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Classification" value={studentData?.enrollment_type} icon={<GraduationCap />} />
            <StatCard label="Year Level" value={studentData?.grade_level} icon={<Calendar />} />
            <StatCard label="Portal Status" value={studentData?.enrollment_status === 'Verified' ? 'Active' : 'Pending'} icon={<CheckCircle2 />} />
          </div>

          {/* Academic Info Table */}
          <div className="mt-10 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 uppercase text-xs tracking-[0.2em] border-b pb-4">Personal Record Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <InfoItem label="Previous School" value={studentData?.prev_school} />
              <InfoItem label="School Year" value={studentData?.school_year} />
              <InfoItem label="Payment Plan" value={studentData?.payment_plan} />
              <InfoItem label="LRN" value={studentData?.lrn} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center hover:scale-105 transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-[#001f3f]">{value || '---'}</p>
    </div>
    <div className="text-blue-500 opacity-20">{icon}</div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value || 'N/A'}</p>
  </div>
);

export default StudentDashboard;