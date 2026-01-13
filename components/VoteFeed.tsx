
import React from 'react';
import { Activity } from '../types';
import GlassContainer from './GlassContainer';
import { UserCheck, Clock, Zap } from 'lucide-react';

interface VoteFeedProps {
  activities: Activity[];
}

const VoteFeed: React.FC<VoteFeedProps> = ({ activities }) => {
  if (activities.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return 'Hadda';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className="py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-black flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#00f2ff]/10 text-[#00f2ff]">
            <Zap size={28} fill="currentColor" />
          </div>
          Codeyntii udanbeesay
        </h2>
        <div className="flex -space-x-2">
           {[1,2,3,4].map(i => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-white/5 backdrop-blur-sm overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
             </div>
           ))}
           <div className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-[#ff00e5] flex items-center justify-center text-[10px] font-black">+</div>
        </div>
      </div>

      <GlassContainer className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar p-6 border-white/5">
        {activities.map((activity, idx) => (
          <div 
            key={activity.id} 
            className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00f2ff]/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f2ff]/10 to-[#ff00e5]/10 flex items-center justify-center border border-white/5 group">
                  <UserCheck size={22} className="text-[#00f2ff] group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00f2ff] rounded-full border-2 border-[#0f172a]"></div>
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-relaxed">
                  <span className="font-black text-white">{activity.userName}</span>
                  <span className="text-gray-500 mx-2">ayaa u codeeyay</span>
                  <span className="font-black text-[#ff00e5]">{activity.candidateName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock size={12} className="text-[#00f2ff]" />
              {formatTime(activity.timestamp)}
            </div>
          </div>
        ))}
      </GlassContainer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 242, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default VoteFeed;
