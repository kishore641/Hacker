import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../api';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get('/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Error fetching library:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAdminAuth = () => {
    const pw = prompt("Enter Admin Password:");
    if (pw === "pdforganizer") {
      setIsAdmin(true);
      alert("Admin Mode: Active");
    }
  };

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">Initializing Library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white p-8 md:p-20 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20">
            <GraduationCap className="h-5 w-5 text-blue-300" />
            <span className="text-sm font-semibold tracking-wide uppercase">2026 Student Portal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Curated Study <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">Repository.</span>
          </h1>
          <p className="text-xl text-slate-300/90 leading-relaxed max-w-lg font-medium">
            Seamlessly access and organize your university curriculum PDFs in one premium repository. 
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Link 
              to="/upload" 
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center justify-center space-x-3 group"
            >
              <span>Upload PDF</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">University Subjects</h2>
            <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
          </div>
          
          <div className="relative group w-full md:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search library..."
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-50/50 transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSubjects.map((subject, index) => (
            <Link 
              key={subject.id} 
              to={`/subject/${subject.id}`}
              className="group relative bg-white p-10 rounded-[2.5rem] border-2 border-slate-50 hover:border-blue-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
            >
              <div className="relative space-y-6">
                <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                    {subject.name}
                  </h3>
                  <p className="text-slate-500 mt-3 text-base font-medium leading-relaxed">
                    Study modules and official resources for {subject.name.split(' (')[0]}.
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-blue-600 font-bold uppercase tracking-wider text-xs pt-2">
                  <span>Explore Curriculum</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Secret Admin Gateway */}
      <footer className="pt-32 border-t border-slate-100 flex flex-col items-center justify-center space-y-6">
        <button 
          onClick={handleAdminAuth}
          className="p-5 rounded-full text-slate-100 hover:text-blue-400 transition-colors bg-white shadow-xl shadow-slate-200/50 border border-slate-50"
          title="Administrative Portal"
        >
          <ShieldAlert className="h-7 w-7" />
        </button>
        
        {isAdmin && (
          <Link 
            to="/admin-control"
            className="flex items-center space-x-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-2xl border border-slate-800 tracking-wide uppercase text-sm"
          >
            <ShieldAlert className="h-5 w-5 text-blue-400" />
            <span>Open Admin Dashboard</span>
          </Link>
        )}
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">© 2026 Student PDF Repository</p>
      </footer>
    </div>
  );
}
