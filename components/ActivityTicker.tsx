
import React from 'react';
import { Activity } from '../types';
import { UserCheck } from 'lucide-react';

interface ActivityTickerProps {
  activities: Activity[];
}

const ActivityTicker: React.FC<ActivityTickerProps> = ({ activities }) => {
  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-12 glass border-t border-white/10 flex items-center overflow-hidden">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {[...activities, ...activities].map((activity, idx) => (
          <div key={`${activity.id}-${idx}`} className="flex items-center gap-2 px-8 border-r border-white/10 h-full">
            <UserCheck size={14} className="text-[#00f2ff]" />
            <span className="text-sm">
              <span className="font-bold text-[#00f2ff]">{activity.userName}</span>
              <span className="text-gray-400 mx-1">ayaa u codeeyay</span>
              <span className="font-bold text-[#ff00e5]">{activity.candidateName}</span>
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ActivityTicker;
