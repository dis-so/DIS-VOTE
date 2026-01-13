
import React from 'react';
import { Candidate } from '../types';
import GlassContainer from './GlassContainer';
import { Vote, Lock, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidate: Candidate) => void;
  disabled?: boolean;
  isVotedByMe?: boolean;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&skinColor=614335&topType=shortHair&hairColor=2c1b18";

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, disabled = false, isVotedByMe = false }) => {
  return (
    <div className={`relative mt-20 mb-8 transition-all duration-500 group ${disabled && !isVotedByMe ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#00f2ff]/20 to-[#ff00e5]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <GlassContainer className={`relative flex flex-col items-center text-center p-8 border-white/5 group-hover:bg-white/[0.05] ${isVotedByMe ? 'border-[#00f2ff]/50 bg-[#00f2ff]/5' : 'group-hover:border-[#00f2ff]/30'}`}>
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className={`absolute -inset-1 rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-opacity ${isVotedByMe ? 'bg-[#00f2ff] opacity-80 animate-pulse' : 'bg-gradient-to-tr from-[#00f2ff] to-[#ff00e5]'}`}></div>
            <div className={`relative w-32 h-32 rounded-full border-4 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 ${isVotedByMe ? 'border-[#00f2ff]' : 'border-[#0f172a]'}`}>
              <img 
                src={candidate.image || DEFAULT_AVATAR} 
                alt={candidate.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
              />
            </div>
            {isVotedByMe && (
              <div className="absolute bottom-1 right-1 bg-[#00f2ff] text-[#0f172a] p-1.5 rounded-full shadow-lg scale-110 z-10">
                <CheckCircle size={16} />
              </div>
            )}
            {!disabled && !isVotedByMe && (
              <div className="absolute bottom-1 right-1 bg-[#00f2ff] text-[#0f172a] p-1.5 rounded-full shadow-lg">
                <ShieldCheck size={14} />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-16 w-full">
          <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{candidate.name}</h3>
          <div className={`w-12 h-1 mx-auto mb-6 rounded-full ${isVotedByMe ? 'bg-[#00f2ff]' : 'bg-gradient-to-r from-[#00f2ff] to-transparent'}`}></div>
          
          <p className="text-sm text-gray-400 mb-8 leading-relaxed line-clamp-3 font-medium opacity-80">
            {candidate.bio || "Musharaxan wuxuu u taagan yahay isbedel dhab ah iyo horumar lagu kalsoonaan karo."}
          </p>
          
          <button
            onClick={() => onVote(candidate)}
            disabled={disabled}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all transform voting-btn-glow ${
              isVotedByMe
                ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50 cursor-default scale-100'
                : disabled 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                  : 'text-[#0f172a] bg-[#00f2ff] hover:bg-white hover:scale-[1.03] active:scale-95'
            }`}
          >
            {isVotedByMe ? (
              <><CheckCircle size={18} /> Mahadsanid!</>
            ) : disabled ? (
              <><XCircle size={16} /> Uma codeeynin</>
            ) : (
              <><Vote size={18} /> U codeey</>
            )}
          </button>
        </div>
      </GlassContainer>
    </div>
  );
};

export default CandidateCard;
