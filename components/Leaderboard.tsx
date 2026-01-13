
import React from 'react';
import GlassContainer from './GlassContainer';
import { Candidate } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  candidates: Candidate[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ candidates }) => {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="text-[#ff00e5]" />
          Live Leaderboard
        </h2>
        <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#00f2ff]">
          REAL-TIME
        </span>
      </div>

      <GlassContainer className="space-y-8">
        {sortedCandidates.map((candidate, index) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
          
          return (
            <div key={candidate.id} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-black ${index === 0 ? 'text-[#ff00e5]' : 'text-gray-600'}`}>
                    #{index + 1}
                  </span>
                  <span className="font-bold text-gray-200">{candidate.name}</span>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-white">{candidate.votes}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{percentage}% OF TOTAL</span>
                </div>
              </div>
              
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#00f2ff] to-[#ff00e5]"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </GlassContainer>
    </div>
  );
};

export default Leaderboard;
