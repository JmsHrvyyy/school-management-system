import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, Pencil, Trash2, X, Shield, Mail, RefreshCw } from 'lucide-react'; // Idinagdag ang RefreshCw
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser, branding } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false); // Hiwalay na state para sa button loading
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [emailError, setEmailError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'registrar'
  });

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost/sms-api/get_users.php');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // REAL-TIME EMAIL VALIDATION FIX
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // VALIDATION: Wag mag-check kung Edit Mode (para iwas false error sa sariling email)
      if (formData.email && !isEditMode && showModal) { 
        try {
          const res = await axios.get(`http://localhost/sms-api/check_email.php?email=${formData.email}`);
          if (res.data.exists) {
            setEmailError('This email is already registered to another account.');
          } else {
            setEmailError('');
          }
        } catch (err) { console.error(err); }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.email, isEditMode, showModal]);

  const handleAddUser = async (e) => {
    if (e) e.preventDefault();
    if (emailError || saveLoading) return; // Gamitin ang saveLoading

    setSaveLoading(true); 
    try {
      const payload = isEditMode ? { ...formData, id: selectedUserId } : formData;
      const response = await axios.post(`http://localhost/sms-api/${isEditMode ? 'update_user.php' : 'add_user.php'}`, payload);

      if (response.data && response.data.success) {
        setShowModal(false);
        setFormData({ username: '', password: '', full_name: '', email: '', role: 'registrar' });
        setEmailError('');
        await fetchUsers(); 
        
        setTimeout(() => {
          alert("Success: " + response.data.message);
        }, 100);
      } else {
        alert("Failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Critical Error:", error);
      alert("May problema sa pag-save. Check PHP connection.");
    } finally {
      setSaveLoading(false);
    }
  };

  const confirmDelete = (id, name) => setDeleteModal({ show: true, id, name });

  const executeDelete = async () => {
    try {
      const response = await axios.post('http://localhost/sms-api/delete_user.php', { id: deleteModal.id });
      if (response.data.success) {
        setDeleteModal({ show: false, id: null, name: '' });
        fetchUsers();
      }
    } catch (error) { alert("Error deleting user"); }
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUserId(user.id);
    setEmailError(''); // Clear errors before editing
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      username: user.username || '',
      role: user.role || 'registrar',
      password: '' 
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Manage system access and accounts.</p>
        </div>
        <button 
          onClick={() => { 
            setIsEditMode(false); 
            setFormData({username:'', password:'', full_name:'', email: '', role:'registrar'});
            setEmailError('');
            setShowModal(true); 
          }}
          className="shine-effect group text-white px-6 py-3 rounded-2xl flex items-center space-x-2 shadow-xl shadow-blue-200 transition-all duration-300 active:scale-95 border border-white/20"
          style={{ backgroundColor: branding.theme_color || '#2563eb' }}
        >
          <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Add New User</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-slate-400 italic">Loading users...</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id || Math.random()} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                             style={{ backgroundColor: branding.theme_color || '#2563eb' }}>
                          {user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 text-sm">{user.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{user.email || 'No email set'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                          user.role === 'registrar' ? 'bg-blue-100 text-blue-600' : 
                          'bg-emerald-100 text-emerald-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={16} /></button>
                        <button 
                          disabled={user.id === currentUser?.id}
                          onClick={() => confirmDelete(user.id, user.full_name)}
                          className={`p-2 rounded-xl transition-all ${user.id === currentUser?.id ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                {isEditMode ? 'Update Member' : 'Create Member'}
              </h3>
              <button onClick={() => {setShowModal(false); setEmailError('');}} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                  value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1"><Mail size={10} /> Email Address</label>
                <input type="email" required className={`w-full p-3.5 border rounded-2xl outline-none transition-all text-sm ${emailError ? 'border-red-400 bg-red-50' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                  placeholder="juan@school.edu" value={formData.email} onChange={(e) => {setEmailError(''); setFormData({...formData, email: e.target.value});}} />
                {emailError && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">⚠️ {emailError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</label>
                  <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                  <input type="password" required={!isEditMode} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                    placeholder={isEditMode ? "••••••" : "Required"} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">System Role</label>
                <select value={formData.role} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-sm"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="registrar">Registrar</option>
                  <option value="cashier">Cashier</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={saveLoading || emailError}
                className="shine-effect w-full py-4 rounded-2xl text-white font-black shadow-2xl transition-all active:scale-[0.98] border border-white/10 flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: branding.theme_color || '#2563eb',
                  opacity: (saveLoading || emailError) ? 0.7 : 1,
                  cursor: (saveLoading || emailError) ? 'not-allowed' : 'pointer'
                }}
              >
                {saveLoading ? <><RefreshCw className="animate-spin" size={20} /><span>Processing...</span></> : <span>{isEditMode ? 'Save Changes' : 'Confirm & Create Account'}</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in zoom-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={40} /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Confirm Delete</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">Are you sure you want to remove <span className="font-bold text-slate-800">{deleteModal.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ show: false, id: null, name: '' })} className="flex-1 py-3.5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;