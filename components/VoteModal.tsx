
import React, { useState } from 'react';
import { X, Smartphone, User, CheckCircle2 } from 'lucide-react';
import GlassContainer from './GlassContainer';
import { Candidate } from '../types';

interface VoteModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, whatsapp: string) => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ candidate, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;
    setIsSubmitting(true);
    // Simulate delay
    setTimeout(() => {
      onSubmit(name, whatsapp);
      setIsSubmitting(false);
      setName('');
      setWhatsapp('');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <GlassContainer className="relative w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-[#ff00e5]/10 border border-[#ff00e5]/20 text-[#ff00e5] mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Xaqiiji Codeynta</h2>
          <p className="text-gray-400">
            Waxaad u codeynaysaa <span className="text-[#00f2ff] font-semibold">{candidate.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Magacaaga oo buuxa</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tusaale: Cali Axmed"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Lambarka WhatsApp-ka</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="tel" 
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Tusaale: +252..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] transition-all"
              />
            </div>
            <p className="text-[10px] text-gray-500 ml-1 mt-1">Kaliya hal cod ayaa loo oggol yahay nambar kasta.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(255,0,229,0.3)] transition-all ${
              isSubmitting 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#ff00e5] to-[#c200ae] hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSubmitting ? 'Waa la xaqiijinayaa...' : 'Xaqiiji Codka'}
          </button>
        </form>
      </GlassContainer>
    </div>
  );
};

export default VoteModal;
