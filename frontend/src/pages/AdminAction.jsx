import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminAction() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [pdfs, setPdfs] = useState([]);

  const handleLogin = () => {
    if (password === 'pdforganizer') {
      setIsAuthed(true);
      api.get('/subjects/').then(res => setSubjects(res.data));
    } else {
      alert("Unauthorized Access Attempt");
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setSelectedModule(null);
    setPdfs([]);
    const res = await api.get(`/subjects/${subject.id}/modules/`);
    setModules(res.data);
  };

  const handleModuleSelect = async (module) => {
    setSelectedModule(module);
    const res = await api.get(`/modules/${module.id}/pdfs/`);
    setPdfs(res.data);
  };

  const deletePdf = async (pdfId) => {
    if (window.confirm("Confirm permanent deletion?")) {
      try {
        await api.delete(`/pdfs/${pdfId}/`, { headers: { 'Admin-Auth': 'pdforganizer' } });
        setPdfs(pdfs.filter(p => p.id !== pdfId));
        alert("Removal Success.");
      } catch (err) {
        alert("Operation Failed: " + err.message);
      }
    }
  };

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-2 border-slate-50 max-w-sm w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <ShieldCheck className="h-20 w-20 text-blue-600 mx-auto" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Root Access</h1>
          <input 
            type="password" 
            placeholder="Identity Secret"
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all font-medium text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest text-sm"> Authenticate </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b pb-8 border-slate-100">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
          <ShieldCheck className="h-10 w-10 text-blue-600" /> Surgical Purge
        </h1>
        <Link to="/" className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Exit Panel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-50 shadow-sm space-y-6">
          <h2 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">01 Select Subject</h2>
          <div className="space-y-3">
            {subjects.map(sub => (
              <button key={sub.id} onClick={() => handleSubjectSelect(sub)} className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-wide border-2 ${selectedSubject?.id === sub.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 border-slate-900' : 'hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-100'}`}> {sub.name} </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-50 shadow-sm space-y-6">
          <h2 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">02 Select Module</h2>
          {selectedSubject ? (
            <div className="space-y-3">
              {modules.map(mod => (
                <button key={mod.id} onClick={() => handleModuleSelect(mod)} className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-wide border-2 ${selectedModule?.id === mod.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10 border-blue-600' : 'hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-100'}`}> {mod.name} </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-300 text-sm italic font-medium">Pick a subject...</p>
          )}
        </div>

        <div className="lg:col-span-1 bg-white rounded-[2rem] p-8 border-2 border-slate-50 shadow-sm space-y-6">
          <h2 className="font-black text-slate-400 uppercase tracking-widest text-[10px]">03 Manage Records</h2>
          {selectedModule ? (
            <div className="space-y-5">
              {pdfs.length > 0 ? pdfs.map(pdf => (
                <div key={pdf.id} className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-50 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-4 overflow-hidden pr-4">
                    <FileText className="text-blue-500 shrink-0 h-6 w-6" />
                    <span className="truncate text-sm font-black text-slate-800">{pdf.title}</span>
                  </div>
                  <div className="flex gap-2 shrink-0 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={pdf.file_url} target="_blank" className="p-3 bg-white text-blue-600 rounded-xl border border-slate-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all"><Eye size={18} /></a>
                    <button onClick={() => deletePdf(pdf.id)} className="p-3 bg-white text-red-500 rounded-xl border border-slate-100 shadow-sm hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-center py-12 italic font-medium">No PDFs found.</p>
              )}
            </div>
          ) : (
            <p className="text-slate-300 text-sm italic font-medium">Pick a module...</p>
          )}
        </div>
      </div>
    </div>
  );
}
