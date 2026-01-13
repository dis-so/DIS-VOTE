import React from 'react';
import GlassContainer from './GlassContainer';
import { Candidate } from '../types';
import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  candidates: Candidate[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ candidates }) => {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="py-10 md:py-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-2xl bg-[#ff00e5]/10 text-[#ff00e5]">
            <Trophy size={24} className="md:w-7 md:h-7" />
          </div>
          Kaalinta Hadda
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] text-[9px] md:text-[10px] font-black uppercase tracking-widest animate-pulse">
          <TrendingUp size={12} className="md:w-3.5 md:h-3.5" />
          Live Update
        </div>
      </div>

      <GlassContainer className="space-y-8 md:space-y-10 p-6 md:p-10 border-white/5">
        {sortedCandidates.map((candidate, index) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);
          const isWinner = index === 0 && candidate.votes > 0;
          
          return (
            <div key={candidate.id} className="group">
              <div className="flex justify-between items-end mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-base md:text-xl border transition-all ${
                    index === 0 ? 'bg-[#ff00e5]/20 border-[#ff00e5] text-[#ff00e5]' : 
                    index === 1 ? 'bg-gray-400/20 border-gray-400 text-gray-400' :
                    index === 2 ? 'bg-[#cd7f32]/20 border-[#cd7f32] text-[#cd7f32]' :
                    'bg-white/5 border-white/10 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <span className="block font-black text-white text-base md:text-lg tracking-tight group-hover:text-[#00f2ff] transition-colors">
                      {candidate.name}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {isWinner ? "Hadda Guulaysanaya" : "Musharax"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl md:text-3xl font-black text-white">{candidate.votes}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Cod</span>
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black text-[#00f2ff] uppercase tracking-widest">{percentage}%</span>
                </div>
              </div>
              
              <div className="h-3 md:h-4 w-full bg-white/5 rounded-full overflow-hidden p-0.5 md:p-1 border border-white/5 relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                    index === 0 ? 'bg-gradient-to-r from-[#00f2ff] to-[#ff00e5]' : 'bg-white/10'
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {index === 0 && (
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] opacity-30"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </GlassContainer>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;