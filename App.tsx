
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

const STORAGE_KEY = 'dis_vote_status_v1';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>('upcoming');
  const [manualTotal, setManualTotal] = useState<number>(43);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [votedNumbers, setVotedNumbers] = useState<Set<string>>(new Set());
  const [votedNames, setVotedNames] = useState<Set<string>>(new Set());
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check Local Storage for previous vote and candidate ID
  useEffect(() => {
    const localVote = localStorage.getItem(STORAGE_KEY);
    if (localVote) {
      setVotedCandidateId(localVote);
    }
  }, []);

  // Secret Admin Access via Hash (#adminlp or #/adminlp)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('adminlp')) {
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
        if (data.winnerId !== undefined) setWinnerId(data.winnerId);
      }
    });

    const activitiesRef = ref(db, 'activities');
    const unsubActivities = onValue(activitiesRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as Activity[];
        setActivities(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setActivities([]);
      }
    });

    const votersRef = ref(db, 'voters');
    const unsubVoters = onValue(votersRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const numbers = new Set<string>();
        const names = new Set<string>();
        Object.keys(data).forEach(key => {
          numbers.add(key);
          if (data[key].name) {
            names.add(data[key].name.toLowerCase().trim());
          }
        });
        setVotedNumbers(numbers);
        setVotedNames(names);
      } else {
        setVotedNumbers(new Set());
        setVotedNames(new Set());
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
    if (votedCandidateId) {
      alert("Horay ayaad u codeysay!");
      return;
    }
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  const handleVoteSubmit = useCallback((name: string, whatsapp: string) => {
    const phoneKey = whatsapp.replace(/\D/g, '');
    const normalizedName = name.toLowerCase().trim();
    
    if (votedNumbers.has(phoneKey) || votedNames.has(normalizedName)) {
      alert("Codkan waa la diiday: Magaca ama lambarka ayaa horay loo isticmaalay.");
      setIsVoteModalOpen(false);
      return;
    }

    const firstNameRaw = name.trim().split(/\s+/)[0];
    const formattedFirstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase();
    const candidateId = selectedCandidate?.id || 'unknown';

    const updates: any = {};
    updates[`voters/${phoneKey}`] = { name, timestamp: Date.now(), candidateId: candidateId };
    updates[`candidates/${candidateId}/votes`] = (selectedCandidate?.votes || 0) + 1;
    
    const activityRef = push(ref(db, 'activities'));
    updates[`activities/${activityRef.key}`] = {
      id: activityRef.key,
      userName: formattedFirstName,
      candidateName: selectedCandidate?.name || 'Musharax',
      timestamp: Date.now()
    };

    update(ref(db), updates).then(() => {
      localStorage.setItem(STORAGE_KEY, candidateId);
      setVotedCandidateId(candidateId);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ff00e5', '#ffffff'],
        ticks: 200
      });
    });

    setIsVoteModalOpen(false);
  }, [selectedCandidate, votedNumbers, votedNames]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  const winnerCandidate = candidates.find(c => c.id === winnerId);

  return (
    <div className="min-h-screen">
      <div className="mesh-gradient" />
      
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5">
        <div className="absolute inset-0 glass opacity-95"></div>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-white/5 shadow-xl flex items-center justify-center">
              <img 
                src="https://files.catbox.moe/718riq.jpg" 
                alt="DIS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
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
        <Hero 
          totalVotes={totalVotes} 
          status={votingStatus} 
          winner={winnerCandidate} 
        />

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
                disabled={votingStatus !== 'ongoing' || !!votedCandidateId}
                isVotedByMe={votedCandidateId === candidate.id}
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

        <footer className="mt-40 py-16 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent"></div>
          
          <div className="flex flex-col items-center gap-8">
            <div className="flex justify-center">
              <a 
                href="https://chat.whatsapp.com/LiaSFkYmhIzBXsZgdOxxCE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-5 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all hover:scale-110 shadow-xl"
              >
                <MessageCircle size={32} fill="currentColor" fillOpacity={0.1} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-[12px] uppercase tracking-[0.3em] font-black text-gray-400">
                DIS-voting © 2026 | by <span className="text-white">LP.</span>
              </p>
            </div>
          </div>
        </footer>
      </main>

      <VoteModal 
        isOpen={isVoteModalOpen} 
        candidate={selectedCandidate}
        onClose={() => setIsVoteModalOpen(false)}
        onSubmit={handleVoteSubmit}
        votedNumbers={votedNumbers}
        votedNames={votedNames}
      />

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={closeAdmin}
        candidates={candidates}
        currentStatus={votingStatus}
        winnerId={winnerId || ''}
      />

      <ActivityTicker activities={activities} />
    </div>
  );
};

export default App;
