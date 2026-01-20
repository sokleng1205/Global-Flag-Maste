
import React from 'react';

interface FlagDisplayProps {
  countryCode: string;
}

const FlagDisplay: React.FC<FlagDisplayProps> = ({ countryCode }) => {
  return (
    <div className="relative group w-full max-w-sm aspect-[3/2] mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/40 border border-white/10">
      <img
        src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
        alt="Country Flag"
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default FlagDisplay;
