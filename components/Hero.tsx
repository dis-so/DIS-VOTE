
import React, { useState, useEffect } from 'react';
import { VotingStatus, Candidate } from '../types';
import { Trophy } from 'lucide-react';

interface HeroProps {
  totalVotes: number;
  status: VotingStatus;
  winner?: Candidate;
}

const Hero: React.FC<HeroProps> = ({ totalVotes, status, winner }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = displayCount;
    const end = totalVotes;
    if (start === end) return;

    const duration = 1500; 
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(start + (end - start) * easeProgress);
      setDisplayCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [totalVotes]);

  const getStatusLabel = () => {
    switch (status) {
      case 'ongoing':
        return {
          text: 'WEEY SOCOTAA CODEYNTA',
          class: 'text-[#00f2ff] border-[#00f2ff]/30 bg-[#00f2ff]/5',
          dot: 'bg-[#00f2ff]'
        };
      case 'upcoming':
        return {
          text: 'WALI MA BILAABAN',
          class: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
          dot: 'bg-yellow-400'
        };
      case 'ended':
        return {
          text: 'WUU DHAMAADAY',
          class: 'text-red-500 border-red-500/30 bg-red-500/5',
          dot: 'bg-red-500'
        };
      default:
        return {
          text: 'XALADDA LAMA YAQAAN',
          class: 'text-gray-400 border-gray-400/30 bg-gray-400/5',
          dot: 'bg-gray-400'
        };
    }
  };

  const statusConfig = getStatusLabel();

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
      <div className={`mb-10 px-8 py-3 rounded-full border glass flex items-center gap-3 transition-all duration-700 ${statusConfig.class}`}>
        <span className="relative flex h-2.5 w-2.5">
          {status === 'ongoing' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dot}`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.dot}`}></span>
        </span>
        <span className="text-[11px] font-black tracking-[0.3em] uppercase">{statusConfig.text}</span>
      </div>

      <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        Codkaagu waa <span className="bg-gradient-to-r from-[#00f2ff] via-[#9d4edd] to-[#ff00e5] bg-clip-text text-transparent">Awooddaada</span>
      </h1>
      
      <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mb-14 opacity-80 leading-relaxed">
        Si hufan oo casri ah ugu codeey musharaxa aad ku kalsoon tay.
      </p>

      {/* Winner Announcement if exists */}
      {winner && (
        <div className="w-full max-w-2xl mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative glass border-[#ff00e5]/30 p-8 rounded-[2.5rem] overflow-hidden group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff00e5]/20 to-[#00f2ff]/20 blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-[#ff00e5] rounded-full blur-sm opacity-30 animate-pulse"></div>
                <img src={winner.image} alt={winner.name} className="relative w-32 h-32 rounded-full border-4 border-[#ff00e5] object-cover shadow-2xl" />
                <div className="absolute -bottom-2 -right-2 bg-[#ff00e5] text-white p-2 rounded-full shadow-lg">
                  <Trophy size={20} fill="currentColor" />
                </div>
              </div>
              <div className="text-left flex-1">
                <div className="text-[10px] font-black text-[#ff00e5] uppercase tracking-[0.4em] mb-2">GUULAYSTAHA RASMIGA AH</div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{winner.name}</h2>
                <p className="text-gray-400 text-sm font-medium leading-relaxed opacity-80">{winner.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redesigned Voting Counter Card */}
      <div className="relative w-full max-w-lg mx-auto">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#00f2ff]/10 to-[#ff00e5]/10 blur-2xl rounded-full opacity-50"></div>
        <div className="relative flex flex-col items-center justify-center pt-8 pb-10 px-6 glass border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f2ff]/30 rounded-tl-[3rem]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff00e5]/30 rounded-tr-[3rem]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff00e5]/30 rounded-bl-[3rem]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f2ff]/30 rounded-br-[3rem]"></div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Live Pulse Data</span>
            </div>
            
            <div className="relative flex flex-col items-center">
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-1 opacity-60">Tirada dadka codeeyay</span>
              <div className="text-8xl md:text-[10rem] font-black text-white tabular-nums tracking-tighter leading-none neon-text-cyan transition-all duration-300">
                {displayCount.toLocaleString()}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00f2ff]/40"></div>
              <span className="text-[9px] font-bold text-[#00f2ff] uppercase tracking-[0.2em] neon-text-cyan">LIVE</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#00f2ff]/40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
