import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  // 1. Idinagdag ang 'branding' dito para makuha ang dynamic settings
  const { setUser, branding } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost/sms-api/login.php', {
        username: username,
        password: password
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user); 
        navigate(`/${response.data.user.role}/dashboard`);
      } else {
        setError(response.data.message); 
      }
    } catch (err) {
      setError("Connection failed. Please check if your server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Dynamic Logo & School Name Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center mb-4">
            {branding.school_logo ? (
              <img 
                src={branding.school_logo} 
                alt="School Logo" 
                className="w-20 h-20 object-contain drop-shadow-xl" 
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl transition-colors duration-500"
                style={{ backgroundColor: branding.theme_color || '#2563eb' }}
              >
                <ShieldCheck size={40} />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {branding.school_name || 'School Management System'}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 opacity-60">
            Authorized Access Only
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8">
          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Username</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl animate-in fade-in zoom-in duration-300">
                <p className="text-xs text-red-600 font-bold flex items-center justify-center">
                   {error}
                </p>
              </div>
            )}

            {/* Submit Button with Dynamic Color */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: branding.theme_color || '#2563eb',
                boxShadow: `0 10px 20px -5px ${branding.theme_color}40`
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In to Portal</span>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Footer */}
        <p className="text-center mt-8 text-slate-400 text-[10px] font-medium tracking-tight">
          &copy; {new Date().getFullYear()} {branding.school_name || 'School Management System'}. <br/>
          All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
