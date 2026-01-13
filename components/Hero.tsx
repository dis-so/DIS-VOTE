
import React, { useState, useEffect } from 'react';
import { VotingStatus } from '../types';

interface HeroProps {
  totalVotes: number;
  status: VotingStatus;
}

const Hero: React.FC<HeroProps> = ({ totalVotes, status }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = displayCount;
    const end = totalVotes;
    if (start === end) return;

    const duration = 1000;
    const increment = (end - start) / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayCount(end);
        clearInterval(counter);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [totalVotes]);

  const getStatusConfig = () => {
    switch (status) {
      case 'ongoing':
        return {
          text: 'WEEY SOCOTAA CODEYNTA',
          color: 'text-[#00f2ff] border-[#00f2ff]/60 bg-[#00f2ff]/5',
          animate: 'animate-pulse'
        };
      case 'upcoming':
        return {
          text: 'Wali ma bilaaban',
          color: 'text-yellow-400 border-yellow-400/60 bg-yellow-400/5',
          animate: ''
        };
      case 'ended':
        return {
          text: 'Wuu dhamaaday',
          color: 'text-red-500 border-red-500/60 bg-red-500/5',
          animate: ''
        };
      default:
        return {
          text: 'WEEY SOCOTAA CODEYNTA',
          color: 'text-[#00f2ff] border-[#00f2ff]/60 bg-[#00f2ff]/5',
          animate: 'animate-pulse'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="text-center">
      {/* Refined Status Banner inspired by user image */}
      <div className="flex justify-center mb-8">
        <div className={`px-10 py-3 rounded-full border glass font-black text-sm tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-3 ${statusConfig.color} ${statusConfig.animate}`}>
          {status === 'ongoing' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
          )}
          {statusConfig.text}
        </div>
      </div>

      <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
        Codkaagu waa <span className="bg-gradient-to-r from-[#00f2ff] to-[#ff00e5] bg-clip-text text-transparent">Awooddaada</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
        Si hufan oo casri ah ugu codeey musharaxa aad ku kalsoon tay.
      </p>

      <div className="relative inline-block px-12 py-8 glass rounded-3xl border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.1)]">
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tirada guud ee la codeeyay</p>
        <div className="text-6xl md:text-8xl font-black text-white neon-cyan tabular-nums tracking-tighter">
          {displayCount.toLocaleString()}
        </div>
        {status === 'ongoing' && (
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#ff00e5] shadow-[0_0_15px_rgba(255,0,229,0.8)] animate-ping" />
        )}
      </div>
    </div>
  );
};

export default Hero;
