// src/components/student/ProfileModal.jsx
import React from 'react';
import { X, Camera, Save, Lock, User } from 'lucide-react';

const ProfileModal = ({ 
  isOpen, 
  onClose, 
  branding, 
  studentData, 
  editForm, 
  setEditForm, 
  previewUrl, 
  handleFileChange, 
  handleUpdateProfile, 
  API_BASE_URL 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div style={{ backgroundColor: branding.theme_color }} className="px-10 py-6 text-white flex justify-between items-center shrink-0">
          <h3 className="font-black text-xs uppercase tracking-widest">Update Profile Information</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl"><X size={20}/></button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleUpdateProfile} className="p-10 overflow-y-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
               {/* Profile Image Logic dito... */}
               <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-lg relative">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : 
                 studentData?.profile_image ? <img src={`${API_BASE_URL}/uploads/profiles/${studentData.profile_image}`} className="w-full h-full object-cover" /> : 
                 <User size={40} className="text-slate-300 mt-8 mx-auto"/>}
              </div>
              <label className="bg-yellow-500 text-[#001f3f] px-4 py-2 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-widest">
                Change Photo <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="flex-1 space-y-4">
               {/* Inputs dito (Email, Contact, Address)... */}
               <input 
                 className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold"
                 value={editForm.email} 
                 onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                 placeholder="Email Address"
               />
               {/* ...iba pang inputs */}
            </div>
          </div>
          <button type="submit" style={{ backgroundColor: branding.theme_color }} className="w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">
            Save Updates
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;