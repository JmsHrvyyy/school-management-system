import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import natin ang axios para sa branding fetch

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Branding State
  const [branding, setBranding] = useState({
    school_name: 'SMS Portal',
    theme_color: '#2563eb',
    school_logo: null
  });

  // 2. Function para kuhanin ang Branding sa Database
  const fetchBranding = async () => {
  try {
    const res = await axios.get('http://localhost/sms-api/branding.php');
    if (res.data) {
      setBranding(res.data);
      
      // ITO ANG NAG-A-APPLY NG KULAY SA BUONG SYSTEM:
      document.documentElement.style.setProperty('--primary-color', res.data.theme_color);
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    // I-check ang user sa LocalStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // I-fetch ang branding settings pagka-load ng app
    fetchBranding();
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    // 4. Isama ang branding at fetchBranding sa value para magamit ng lahat
    <AuthContext.Provider value={{ user, setUser, logout, loading, branding, fetchBranding }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);