
import React, { useState } from 'react';
import { X, Smartphone, User, CheckCircle2, AlertCircle } from 'lucide-react';
import GlassContainer from './GlassContainer';
import { Candidate } from '../types';

interface VoteModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, whatsapp: string) => void;
  votedNumbers: Set<string>;
  votedNames: Set<string>;
}

const VoteModal: React.FC<VoteModalProps> = ({ candidate, isOpen, onClose, onSubmit, votedNumbers, votedNames }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !candidate) return null;

  const validate = () => {
    setError(null);
    const trimmedName = name.trim();
    const parts = trimmedName.split(/\s+/);
    
    // 1. Name must contain at least two parts
    if (parts.length < 2) {
      setError("Fadlan qor magacaaga oo saddexan (Ugu yaraan labo magac).");
      return false;
    }

    // 2. Name uniqueness
    if (votedNames.has(trimmedName.toLowerCase())) {
      setError("Magacan ayaa horay loo isticmaalay codeyn kale!");
      return false;
    }

    // 3. Number validation
    const phoneDigits = whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      setError("Fadlan geli nambar WhatsApp oo sax ah.");
      return false;
    }

    // 4. Number uniqueness
    if (votedNumbers.has(phoneDigits)) {
      setError("Nambarkan ayaa horay u codeeyay!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    // Simulate delay for aesthetics
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

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Magacaaga oo buuxa (Laba magac)</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => { setName(e.target.value); if(error) setError(null); }}
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
                onChange={(e) => { setWhatsapp(e.target.value); if(error) setError(null); }}
                placeholder="Tusaale: +252..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00f2ff] focus:ring-1 focus:ring-[#00f2ff] transition-all"
              />
            </div>
            <p className="text-[10px] text-gray-500 ml-1 mt-1">Kaliya hal cod ayaa loo oggol yahay qof kasta.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(255,0,229,0.3)] transition-all flex items-center justify-center gap-3 ${
              isSubmitting 
                ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-[#ff00e5] to-[#c200ae] hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Waa la xaqiijinayaa...
              </>
            ) : 'Xaqiiji Codka'}
          </button>
        </form>
      </GlassContainer>
    </div>
  );
};

export default VoteModal;
