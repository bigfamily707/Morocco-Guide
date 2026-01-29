import React from 'react';
import { ZelligePattern } from '../constants';

interface MosaicHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  patternColor?: string;
}

const MosaicHeader: React.FC<MosaicHeaderProps> = ({ title, subtitle, className = "", patternColor = "text-[#0B1E3B]/5" }) => {
  return (
    <div className={`relative overflow-hidden p-6 ${className}`}>
      <div className={`absolute inset-0 ${patternColor}`}>
        <ZelligePattern />
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl font-display font-bold text-[#0B1E3B] drop-shadow-sm tracking-wide">{title}</h1>
        {subtitle && <p className="text-[#8B4513] mt-2 font-medium text-sm tracking-widest uppercase">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MosaicHeader;