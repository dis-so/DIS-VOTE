
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
import { MessageCircle } from 'lucide-react';
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

  // Secret Admin Access via Hash (#adminlp)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#adminlp') {
        setIsAdminOpen(true);
      }
    };
    
    window.addEventListener('hashchange', checkHash);
    checkHash(); // Check on initial load
    
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Sync Data from Firebase
  useEffect(() => {
    // 1. Sync Candidates
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

    // 2. Sync Settings (Status & Manual Total)
    const settingsRef = ref(db, 'settings');
    const unsubSettings = onValue(settingsRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        if (data.status) setVotingStatus(data.status);
        if (data.manualTotal !== undefined) setManualTotal(data.manualTotal);
      }
    });

    // 3. Sync Activities
    const activitiesRef = ref(db, 'activities');
    const unsubActivities = onValue(activitiesRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data) as Activity[];
        setActivities(list.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20));
      }
    });

    // 4. Sync Voted Numbers
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

  // Total votes = Manual base total + sum of candidate votes
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
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2ff', '#ff00e5', '#ffffff']
      });
    });

    setIsVoteModalOpen(false);
  }, [selectedCandidate, votedNumbers]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="mesh-gradient" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2ff] to-[#ff00e5] flex items-center justify-center font-black text-[#0f172a]">D</div>
            <span className="font-black text-xl tracking-tighter uppercase italic text-white">DIS-<span className="text-[#00f2ff]">VOTE</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Musharaxiinta</a>
              <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
                HUFKNAAN
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <Hero totalVotes={totalVotes} status={votingStatus} />

        {candidates.length === 0 ? (
          <div className="text-center py-24 opacity-30">
            <p className="text-xl font-medium text-gray-400">Musharaxiin wali laguma soo darin.</p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <Leaderboard candidates={candidates} />
            <VoteFeed activities={activities} />
          </div>
        )}

        <footer className="mt-20 py-12 border-t border-white/10 text-center text-gray-400">
          <p className="mb-6 font-medium italic">PulseVote: Transparent & Real-time Democracy</p>
          <p className="mb-6 text-xs uppercase tracking-[0.2em] font-bold">DIS VOTING © 2026 | by LP.</p>
          <div className="flex justify-center gap-6">
            <a 
              href="https://chat.whatsapp.com/LiaSFkYmhIzBXsZgdOxxCE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all hover:scale-110 shadow-[0_0_15px_rgba(37,211,102,0.2)]"
            >
              <MessageCircle size={24} fill="currentColor" fillOpacity={0.1} />
            </a>
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
