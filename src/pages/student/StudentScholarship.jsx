import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';

const Scholarship = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Apply for Scholarship</h1>
          <p className="text-slate-500 text-sm">Submit your documents for review by the Registrar and Cashier.</p>
        </div>
        
        <form className="p-8 space-y-6">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Scholarship Type</label>
            <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-slate-700">
              <option>Academic Scholar (100% Discount)</option>
              <option>Government/LGU Subsidy</option>
              <option>Working Student</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-50/50">
            <Upload className="mx-auto text-slate-400 mb-4" size={40} />
            <p className="text-sm font-bold text-slate-600">Upload Requirements (PDF/JPG)</p>
            <p className="text-[10px] text-slate-400 uppercase mt-1">GWA Report, Certificate of Indigency, etc.</p>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-sm">
            <Send size={18} /> Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Scholarship;