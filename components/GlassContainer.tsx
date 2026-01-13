
import React from 'react';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`glass rounded-2xl p-6 transition-all duration-300 ${hoverEffect ? 'hover:bg-white/10 hover:border-white/30 hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassContainer;
