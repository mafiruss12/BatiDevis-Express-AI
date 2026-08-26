import React from 'react';
import { Building2, Hammer, HardHat, Wrench, Paintbrush, Ruler, Truck } from 'lucide-react';
import { CompanyInfo } from '../types';

interface CompanyLogoProps {
  company: CompanyInfo;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ company, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
    xl: 56
  };

  if (company.logoUrl && company.logoUrl.trim().length > 0) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs ${className}`}>
        <img
          src={company.logoUrl}
          alt={company.name}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Preset vector logos based on construction domain
  const preset = company.logoPreset || 'crane';
  const getIcon = () => {
    switch (preset) {
      case 'hammer':
        return <Hammer size={iconSizes[size]} className="text-amber-400" />;
      case 'brick':
        return <HardHat size={iconSizes[size]} className="text-amber-400" />;
      case 'paint':
        return <Paintbrush size={iconSizes[size]} className="text-cyan-400" />;
      case 'ruler':
        return <Ruler size={iconSizes[size]} className="text-amber-400" />;
      case 'truck':
        return <Truck size={iconSizes[size]} className="text-amber-400" />;
      case 'building':
        return <Building2 size={iconSizes[size]} className="text-amber-400" />;
      case 'crane':
      default:
        return <Building2 size={iconSizes[size]} className="text-amber-400" />;
    }
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/40 flex items-center justify-center shadow-md ${className}`}>
      {getIcon()}
    </div>
  );
};
