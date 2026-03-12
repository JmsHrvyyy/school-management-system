import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {

  User, BookOpen, CreditCard, Lock, Unlock,

  LogOut, CheckCircle2, Megaphone, Wallet,

  Info, Download, Menu, X, Camera, Save, Edit3, ArrowRight

} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, branding } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({ email: '', contact_no: '', address: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_BASE_URL = "http://localhost/sms-api"; 

  const fetchData = async () => {
    try {
      const studentRes = await axios.get(`${API_BASE_URL}/get_students.php`);
      const myData = studentRes.data.find(s => s.email === user.email);
      if (myData) {
        setStudentData(myData);
        setEditForm({ 
          email: myData.email || '', 
          contact_no: myData.contact_no || '', 
          address: myData.address || '' 
        });
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchData();
  }, [user.email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('student_id', studentData.student_id);
    formData.append('email', editForm.email);
    formData.append('contact_no', editForm.contact_no);
    formData.append('address', editForm.address);
    if (selectedFile) formData.append('profile_image', selectedFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/update_profile.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        alert("Profile updated!");
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err) {
      alert("Update failed.");
    }
  };

  const isLocked = !studentData || studentData.enrollment_status === 'Pending';

  if (loading) return (
    <div className="h-96 flex items-center justify-center font-black animate-pulse text-slate-400 uppercase tracking-widest">
      Loading Student Data...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 w-full space-y-8 animate-in fade-in duration-500">
      
      {/* 1. WELCOME HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
              {studentData?.grade_level || 'N/A'}
            </span>
            <span className="bg-yellow-500 text-[#001f3f] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md">
              {studentData?.enrollment_type || 'Continuing'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
            Mabuhay, <span style={{ color: branding.theme_color }}>{studentData?.first_name}!</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Student ID: {studentData?.student_id}</p>
        </div>
        
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all shadow-sm"
        >
          <Edit3 size={14} /> Edit Profile
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. FINANCIAL OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div style={{ backgroundColor: branding.theme_color }} className="p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <Wallet size={40} className="mb-6 text-yellow-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Remaining Balance</p>
                <h2 className="text-4xl font-black mt-1">₱ {studentData?.balance || '0.00'}</h2>
                <button 
                  onClick={() => navigate('/student/accounting')}
                  className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
                >
                  View Breakdown <ArrowRight size={14}/>
                </button>
             </div>

             <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-emerald-50 rounded-2xl">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">Good Standing</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Latest Payment</p>
                <h2 className="text-2xl font-black text-slate-900 mt-1">₱ {studentData?.last_payment || '0.00'}</h2>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase italic">Processed: {studentData?.payment_date || 'N/A'}</p>
             </div>
          </div>

          {/* 3. ANNOUNCEMENTS */}
          <div style={{ backgroundColor: branding.theme_color }} className="text-white p-5 rounded-3xl flex items-center gap-5 shadow-xl overflow-hidden relative">
            <Megaphone size={24} className="shrink-0 animate-bounce text-yellow-500" />
            <marquee className="font-black text-xs uppercase tracking-widest italic">Important: School Year {studentData?.school_year} enrollment is ongoing.</marquee>
          </div>

          {/* 4. ENROLLMENT DETAILS */}
          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
            <h3 className="font-black text-slate-800 mb-8 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-500"/> Enrollment Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
               <InfoItem label="Grade Level" value={studentData?.grade_level} />
               <InfoItem label="Classification" value={studentData?.enrollment_type} />
               <InfoItem label="School Year" value={studentData?.school_year} />
               <InfoItem label="Portal Access" value={studentData?.enrollment_status} />
               <InfoItem label="Payment Plan" value={studentData?.payment_plan} />
               <InfoItem label="LRN Number" value={studentData?.lrn} />
            </div>
          </section>
        </div>

        {/* 5. SIDE CARDS */}
        <div className="space-y-8">
           <div className={`p-8 rounded-[2.5rem] border-4 ${isLocked ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
             <div className="flex items-center gap-4">
                <div style={{ backgroundColor: isLocked ? '#ef4444' : branding.theme_color }} className="text-white p-4 rounded-2xl shadow-lg">
                   {isLocked ? <Lock size={24}/> : <Unlock size={24}/>}
                </div>
                <div>
                   <p className={`font-black text-xl leading-none ${isLocked ? 'text-red-700' : 'text-emerald-700'}`}>{isLocked ? 'LOCKED' : 'ACTIVE'}</p>
                   <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">LMS Access Status</p>
                </div>
             </div>
           </div>
           
           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="font-black text-[9px] uppercase tracking-widest mb-6 text-slate-500 italic underline decoration-yellow-500">Quick Access</h3>
              <div className="space-y-3">
                 <DownloadBtn label="Class Schedule" />
                 <DownloadBtn label="Student Handbook" />
                 <DownloadBtn label="Billing Statement" />
              </div>
           </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL (Nanatili dito dahil specific ito sa Dashboard/Profile Page) */}
      {isEditModalOpen && (
        <ProfileModal 
          branding={branding}
          studentData={studentData}
          editForm={editForm}
          setEditForm={setEditForm}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          handleUpdateProfile={handleUpdateProfile}
          setIsEditModalOpen={setIsEditModalOpen}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </div>
  );
};

// MINI COMPONENTS PARA MALINIS ANG CODE
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-[13px] font-black text-slate-900">{value || '---'}</p>
  </div>
);

const DownloadBtn = ({ label }) => (
  <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest group">
    {label} <Download size={14} className="text-yellow-500 group-hover:scale-125 transition-transform" />
  </button>
);

const ProfileModal = ({ branding, studentData, editForm, setEditForm, previewUrl, handleFileChange, handleUpdateProfile, setIsEditModalOpen, API_BASE_URL }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-300">
      <div style={{ backgroundColor: branding.theme_color }} className="px-10 py-6 text-white flex justify-between items-center">
        <h3 className="font-black text-xs uppercase tracking-widest">Update Profile</h3>
        <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl"><Save size={20}/></button>
      </div>

      <form onSubmit={handleUpdateProfile} className="p-10 overflow-y-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
              {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : 
               studentData?.profile_image ? <img src={`${API_BASE_URL}/uploads/profiles/${studentData.profile_image}`} className="w-full h-full object-cover" /> : 
               <User size={40} className="text-slate-300 mt-8 mx-auto"/>}
            </div>
            <label className="bg-yellow-500 text-[#001f3f] px-4 py-2 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest shadow-md">
              Change Photo
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <LockedInput label="Student ID" value={studentData?.student_id} />
              <LockedInput label="LRN" value={studentData?.lrn} />
            </div>
            <EditInput label="Email Address" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
            <EditInput label="Contact Number" value={editForm.contact_no} onChange={(e) => setEditForm({...editForm, contact_no: e.target.value})} />
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Home Address</label>
              <textarea value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold h-20 outline-none" />
            </div>
          </div>
        </div>
        <button type="submit" style={{ backgroundColor: branding.theme_color }} className="w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
          Save All Updates
        </button>
      </form>
    </div>
  </div>
);

const LockedInput = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-black text-slate-500 flex justify-between items-center">{value} <Lock size={12}/></div>
  </div>
);

const EditInput = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">{label}</label>
    <input type="text" value={value} onChange={onChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500" />
  </div>
);

export default StudentDashboard;