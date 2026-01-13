
import React from 'react';
import { Activity } from '../types';
import GlassContainer from './GlassContainer';
import { UserCheck, Clock } from 'lucide-react';

interface VoteFeedProps {
  activities: Activity[];
}

const VoteFeed: React.FC<VoteFeedProps> = ({ activities }) => {
  if (activities.length === 0) return null;

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Hadda';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} daqiiqo ka hor`;
  };

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <UserCheck className="text-[#00f2ff]" />
          Codeyntii u dambeysay
        </h2>
      </div>

      <GlassContainer className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 animate-in slide-in-from-right duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f2ff]/20 to-[#ff00e5]/20 flex items-center justify-center border border-white/10">
                <UserCheck size={20} className="text-[#00f2ff]" />
              </div>
              <div>
                <p className="text-white font-bold">
                  <span className="text-[#00f2ff]">{activity.userName}</span>
                  <span className="text-gray-400 font-normal mx-2">ayaa u codeeyay</span>
                  <span className="text-[#ff00e5]">{activity.candidateName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
              <Clock size={12} />
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
          background: rgba(0, 242, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default VoteFeed;
