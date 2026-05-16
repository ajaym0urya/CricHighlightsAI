import React, { useState } from 'react';
import axios from 'axios';
import { Trophy, Zap, Clock, User, CheckCircle, Search, Loader2, PlayCircle, ExternalLink, FileText, Upload, Laugh, Megaphone, Star, Share2, RefreshCcw, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = window.location.origin === 'http://localhost:5173' ? 'http://localhost:8000' : '';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setAnalysis(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000
      });
      setAnalysis(response.data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Analysis failed. Please check your API key or network.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
    setLoading(false);
  };

  const getCategoryIcon = (cat) => {
    switch (cat.toUpperCase()) {
      case 'WICKET': return <Target className="w-5 h-5 text-red-400" />;
      case 'SIX': return <TrendingUp className="w-5 h-5 text-accent" />;
      case 'RESULT': return <ShieldCheck className="w-5 h-5 text-green-400" />;
      default: return <Zap className="w-5 h-5 text-white/50" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-12">
      <header className="max-w-5xl mx-auto mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4 cursor-pointer" onClick={reset}>
          <div className="p-3 bg-accent/20 rounded-xl">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">
            CricHighlights <span className="text-accent">AI</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="flex-1 md:w-64 cursor-pointer">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              <FileText className="w-5 h-5 text-white/30" />
              <span className="text-sm text-white/60 truncate">
                {file ? file.name : 'Select Commentary File'}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" />
            </div>
          </label>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-accent hover:bg-accent/80 text-black font-black py-4 px-10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-accent/10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GENERATE'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!analysis && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Upload className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Upload and relive the match</h2>
              <p className="text-white/40">Our AI will summarize the key highlights from your commentary file.</p>
            </motion.div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
              <p className="text-white/40 uppercase tracking-widest text-sm font-bold">Scanning Commentary...</p>
            </div>
          )}

          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="bg-white/5 border border-white/10 p-10 rounded-3xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-4 uppercase italic leading-tight">{analysis.title}</h2>
                  <p className="text-xl text-white/60 mb-8 leading-relaxed max-w-3xl">"{analysis.summary}"</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/5 px-6 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold uppercase tracking-widest">{analysis.match_vibe}</span>
                    </div>
                    <div className="bg-white/5 px-6 py-2 rounded-full flex items-center gap-2 border border-white/10">
                      <User className="w-4 h-4 text-accent" />
                      <span className="text-sm font-bold uppercase tracking-widest">POTM: {analysis.player_of_match}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-4">
                  Key Match Highlights <div className="h-px flex-1 bg-white/5"></div>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {analysis.highlights.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start gap-6 hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="bg-black/40 p-3 rounded-xl">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black bg-accent/20 text-accent px-2 py-0.5 rounded uppercase tracking-widest">
                            {item.category}
                          </span>
                          {item.time && (
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.time}
                            </span>
                          )}
                        </div>
                        <p className="text-lg font-medium text-white/80">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="text-center py-20 text-white/10 text-[10px] uppercase tracking-[0.5em] font-black">
        CricHighlights AI • Powered by Gemini 1.5 Flash
      </footer>
    </div>
  );
}

export default App;
