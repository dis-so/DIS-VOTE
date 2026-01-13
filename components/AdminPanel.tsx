
import React, { useState, useEffect } from 'react';
import { db, ref, set, push, update, remove, onValue } from '../firebase';
import { Candidate, VotingStatus } from '../types';
import GlassContainer from './GlassContainer';
import { X, Trash2, Settings, UserPlus, Calendar, Lock, Hash, Upload, User } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  currentStatus: VotingStatus;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&skinColor=614335&topType=shortHair&hairColor=2c1b18";

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, candidates, currentStatus }) => {
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [manualTotal, setManualTotal] = useState<number>(0);

  // Sync manual total from firebase for editing
  useEffect(() => {
    if (isAuthenticated) {
      const settingsRef = ref(db, 'settings');
      const unsubscribe = onValue(settingsRef, (snapshot: any) => {
        const data = snapshot.val();
        if (data && data.manualTotal !== undefined) {
          setManualTotal(data.manualTotal);
        }
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '22lp') {
      setIsAuthenticated(true);
    } else {
      alert('Passcode khaldan!');
    }
  };

  const handleStatusChange = (status: VotingStatus) => {
    update(ref(db, 'settings'), { status });
  };

  const handleManualTotalChange = (e: React.FormEvent) => {
    e.preventDefault();
    update(ref(db, 'settings'), { manualTotal: Number(manualTotal) });
    alert('Tirada guud waa la cusboonaysiiyay!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit for RTDB strings to keep performance
        alert("Sawirku aad ayuu u weyn yahay (Max: 500KB). Fadlan isticmaal sawir yar.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const candidatesRef = ref(db, 'candidates');
    const newCandidateRef = push(candidatesRef);
    
    set(newCandidateRef, {
      id: newCandidateRef.key,
      name: newName,
      bio: newBio,
      image: newImageBase64 || DEFAULT_AVATAR,
      votes: 0
    });
    
    setNewName('');
    setNewBio('');
    setNewImageBase64(null);
  };

  const handleDeleteCandidate = (id: string) => {
    if (confirm('Ma huba we huba inaad tirtirto musharaxan?')) {
      remove(ref(db, `candidates/${id}`));
    }
  };

  const handleResetVoters = () => {
    if (confirm('DIGNIIN: Ma huba we huba inaad tirtirto dhamaan dadka codeeyay? Tani dib uma noqonayso.')) {
      remove(ref(db, 'voters'));
      remove(ref(db, 'activities'));
      const updates: any = {};
      candidates.forEach(c => {
        updates[`candidates/${c.id}/votes`] = 0;
      });
      update(ref(db), updates);
      update(ref(db, 'settings'), { manualTotal: 0 });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <GlassContainer className="w-full max-sm p-10 text-center border-[#00f2ff]/30">
          <div className="w-16 h-16 rounded-2xl bg-[#00f2ff]/10 flex items-center justify-center mx-auto mb-6 text-[#00f2ff]">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black mb-2">Secret Access</h2>
          <p className="text-gray-500 text-sm mb-8">Fadlan geli pin-ka maamulka</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="••••" 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-black focus:border-[#00f2ff] outline-none transition-all"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition-colors">Ka Bax</button>
              <button type="submit" className="flex-1 py-4 rounded-xl bg-[#00f2ff] text-[#0f172a] font-bold shadow-[0_0_20px_rgba(0,242,255,0.4)]">Gali</button>
            </div>
          </form>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 mb-2">
              <Settings className="text-[#00f2ff]" />
              PulseVote <span className="text-[#00f2ff]">Admin</span>
            </h1>
            <p className="text-gray-500 font-medium">Maamul musharaxiinta iyo xaaladda codeynta.</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all hover:rotate-90">
            <X size={32} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <GlassContainer className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-[#ff00e5]" size={20} />
                Xaaladda Codeynta
              </h3>
              <div className="flex flex-col gap-3">
                {(['upcoming', 'ongoing', 'ended'] as VotingStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`py-4 px-6 rounded-xl font-bold border transition-all text-left flex items-center justify-between group ${
                      currentStatus === status 
                      ? 'bg-[#00f2ff]/20 border-[#00f2ff] text-[#00f2ff]' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="capitalize">{status === 'ongoing' ? 'Socota (WEEY SOCOTAA)' : status === 'upcoming' ? 'Ma bilaaban (Upcoming)' : 'Dhamaatay (Ended)'}</span>
                    <div className={`w-3 h-3 rounded-full transition-all ${currentStatus === status ? 'bg-[#00f2ff] animate-pulse scale-125' : 'bg-gray-700'}`} />
                  </button>
                ))}
              </div>
            </GlassContainer>

            <GlassContainer className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Hash className="text-[#00f2ff]" size={20} />
                Tirada Guud ee la codeeyay
              </h3>
              <form onSubmit={handleManualTotalChange} className="space-y-4">
                <p className="text-xs text-gray-500 mb-2">Halkan waxaad ka bedeli kartaa tirada guud ee lagu soo bandhigayo bogga hore (Base Votes).</p>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="43" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#00f2ff] outline-none text-xl font-black"
                    value={manualTotal}
                    onChange={(e) => setManualTotal(Number(e.target.value))}
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                  Cusboonaysii Tirada
                </button>
              </form>
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={handleResetVoters}
                  className="w-full py-3 flex items-center justify-center gap-2 text-red-500 text-xs font-bold border border-red-500/10 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                  Nadiifi Codeynta & Dib u bilow
                </button>
              </div>
            </GlassContainer>
          </div>

          <GlassContainer className="space-y-6 h-fit">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="text-[#00f2ff]" size={20} />
              Musharax Cusub
            </h3>
            <form onSubmit={handleAddCandidate} className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 relative">
                    {newImageBase64 ? (
                      <img src={newImageBase64} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <User size={32} />
                        <span className="text-[10px] font-bold mt-1 uppercase">Avatar</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload size={20} className="text-white" />
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                  {newImageBase64 && (
                    <button 
                      type="button" 
                      onClick={() => setNewImageBase64(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-black">Sawirka Musharaxa (Base64)</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Magaca</label>
                <input 
                  type="text" 
                  placeholder="Magaca oo buuxa" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#00f2ff] outline-none transition-colors"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Warbixin</label>
                <textarea 
                  placeholder="Taariikh kooban ama himilada..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-[#00f2ff] outline-none min-h-[100px] resize-none transition-colors"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#00f2ff] to-[#00d8e6] text-[#0f172a] font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                KUDAR MUSHARAXA
              </button>
            </form>
          </GlassContainer>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            Musharaxiinta Hadda 
            <span className="text-sm font-bold py-1 px-3 rounded-full bg-white/5 border border-white/10 text-gray-500">{candidates.length}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-5 glass rounded-2xl border-white/10 hover:border-[#00f2ff]/30 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img src={c.image || DEFAULT_AVATAR} alt={c.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#00f2ff]/20" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff00e5] rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">
                      {c.votes}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{c.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{c.bio}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCandidate(c.id)}
                  className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
