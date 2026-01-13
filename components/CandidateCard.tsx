
import React from 'react';
import { Candidate } from '../types';
import GlassContainer from './GlassContainer';
import { Vote, Lock } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidate: Candidate) => void;
  disabled?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, disabled = false }) => {
  return (
    <div className={`relative mt-12 mb-6 px-4 transition-opacity duration-300 ${disabled ? 'opacity-70' : ''}`}>
      <GlassContainer hoverEffect={!disabled} className="relative flex flex-col items-center text-center">
        {/* Floating Profile Image */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-[#0f172a] shadow-[0_0_20px_rgba(0,242,255,0.3)] overflow-hidden transition-all ${disabled ? 'grayscale brightness-50' : ''}`}>
          <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="mt-12 w-full">
          <h3 className="text-xl font-bold mb-2 text-white">{candidate.name}</h3>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3">
            {candidate.bio}
          </p>
          
          <button
            onClick={() => onVote(candidate)}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all transform ${
              disabled 
                ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' 
                : 'text-[#0f172a] bg-[#00f2ff] hover:bg-[#00d8e6] hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
            }`}
          >
            {disabled ? <Lock size={18} /> : <Vote size={20} />}
            {disabled ? 'Lama heli karo' : 'U codeey'}
          </button>
        </div>
      </GlassContainer>
    </div>
  );
};

export default CandidateCard;
