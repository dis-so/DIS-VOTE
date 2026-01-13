
import React, { useState, useEffect, useCallback } from 'react';
import { db, ref, onValue, set, push, update } from './firebase';
import { Candidate, Activity, VotingStatus } from './types';
import Hero from './components/Hero';
import CandidateCard from './components/CandidateCard';
import VoteModal from './components/VoteModal';
import Leaderboard from './components/Leaderboard';
import ActivityTicker from './components/ActivityTicker';
import VoteFeed from './components/VoteFeed';
import AdminPanel from './components/AdminPanel';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>('upcoming');
  const [manualTotal, setManualTotal] = useState<number>(43);
  const [votedNumbers, setVotedNumbers] = useState<Set<string>>(new Set());
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret Admin Access via Hash (#adminlp or #/adminlp)
  useEffect(() => {
    const checkHash = () => {
      // Robust check for 'adminlp' in the hash to handle both #adminlp and #/adminlp
      if (window.location.hash.toLowerCase().includes('adminlp')) {
        setIsAdminOpen(true);
      }
    };
    
    window.addEventListener('hashchange', checkHash);
    checkHash(); // Check on initial load
    
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Sync Data from Firebase
  useEffect(() => {
    const candidatesRef = ref(db, 'candidates');
    const unsubCandidates = onValue(candidatesRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as Candidate[];
        setCandidates(list.sort((a, b) => b.votes - a.votes));
      } else {
        setCandidates([]);
      }
    });

    const settingsRef = ref(db, 'settings');
    const unsubSettings = onValue(settingsRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        if (data.status) setVotingStatus(data.status);
        if (data.manualTotal !== undefined) setManualTotal(data.manualTotal);
      }
    });

    const activitiesRef = ref(db, 'activities');
    const unsubActivities = onValue(activitiesRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as Activity[];
        setActivities(list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20));
      }
    });

    const votersRef = ref(db, 'voters');
    const unsubVoters = onValue(votersRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        setVotedNumbers(new Set(Object.keys(data)));
      } else {
        setVotedNumbers(new Set());
      }
    });

    return () => {
      unsubCandidates();
      unsubSettings();
      unsubActivities();
      unsubVoters();
    };
  }, []);

  const totalVotes = (manualTotal || 0) + candidates.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVoteClick = (candidate: Candidate) => {
    if (votingStatus !== 'ongoing') return;
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  const handleVoteSubmit = useCallback((name: string, whatsapp: string) => {
    const phoneKey = whatsapp.replace(/\D/g, '');
    
    if (votedNumbers.has(phoneKey)) {
      alert("Nambarkan WhatsApp-ka ayaa horay u codeeyay!");
      setIsVoteModalOpen(false);
      return;
    }

    const updates: any = {};
    updates[`voters/${phoneKey}`] = { name, timestamp: Date.now(), candidateId: selectedCandidate?.id };
    updates[`candidates/${selectedCandidate?.id}/votes`] = (selectedCandidate?.votes || 0) + 1;
    
    const activityRef = push(ref(db, 'activities'));
    updates[`activities/${activityRef.key}`] = {
      id: activityRef.key,
      userName: name.split(' ')[0],
      candidateName: selectedCandidate?.name || 'Musharax',
      timestamp: Date.now()
    };

    update(ref(db), updates).then(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ff00e5', '#ffffff'],
        ticks: 200
      });
    });

    setIsVoteModalOpen(false);
  }, [selectedCandidate, votedNumbers]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    // Clear hash without reload
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  return (
    <div className="min-h-screen">
      <div className="mesh-gradient" />
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5">
        <div className="absolute inset-0 glass opacity-95"></div>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] flex items-center justify-center font-black text-[#0f172a] shadow-lg">D</div>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-white flex items-center">
              DIS-<span className="text-[#00f2ff]">VOTE</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-[10px] font-black text-gray-400 hover:text-[#00f2ff] uppercase tracking-[0.2em] transition-colors">Musharaxiinta</a>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-white">
                <ShieldCheck size={14} className="text-[#00f2ff]" />
                HUFKNAAN
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-44 pb-32">
        <Hero totalVotes={totalVotes} status={votingStatus} />

        {candidates.length === 0 ? (
          <div className="text-center py-32 opacity-20">
            <p className="text-2xl font-black text-gray-500 uppercase tracking-widest">Lama helin musharaxiin...</p>
          </div>
        ) : (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {candidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onVote={handleVoteClick} 
                disabled={votingStatus !== 'ongoing'}
              />
            ))}
          </div>
        )}

        {candidates.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
            <Leaderboard candidates={candidates} />
            <VoteFeed activities={activities} />
          </div>
        )}

        {/* Beautiful Somali Footer */}
        <footer className="mt-40 py-20 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent"></div>
          
          <div className="mb-12">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse"></div>
             </div>
             <p className="text-2xl font-black text-white mb-3 italic tracking-tight">PulseVote</p>
             <p className="text-gray-500 font-medium opacity-80 max-w-lg mx-auto leading-relaxed">
               U codeey musharaxa aad jeceshahay si hufan oo caddaalad ah. 
               PulseVote waa nidaamka ugu casrisan ee codeynta online-ka ah.
             </p>
          </div>

          <div className="flex flex-col items-center gap-8 mb-12">
            <div className="flex justify-center gap-6">
              <a 
                href="https://chat.whatsapp.com/LiaSFkYmhIzBXsZgdOxxCE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-5 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all hover:scale-110 shadow-xl"
              >
                <MessageCircle size={32} fill="currentColor" fillOpacity={0.1} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Hufnaan Data</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.5em] font-black text-gray-600 mb-2">
              DIS VOTING © 2026
            </p>
            <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em]">
              Designed with precision by <span className="text-white">LP.</span>
            </p>
          </div>
        </footer>
      </main>

      <VoteModal 
        isOpen={isVoteModalOpen} 
        candidate={selectedCandidate}
        onClose={() => setIsVoteModalOpen(false)}
        onSubmit={handleVoteSubmit}
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={closeAdmin}
        candidates={candidates}
        currentStatus={votingStatus}
      />

      <ActivityTicker activities={activities} />
    </div>
  );
};

export default App;
