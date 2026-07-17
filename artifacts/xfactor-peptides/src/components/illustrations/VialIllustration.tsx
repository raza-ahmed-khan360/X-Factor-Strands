import * as React from 'react';

export function VialIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center group perspective-1000">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" />
      
      {/* Abstract Molecular Particles */}
      <svg className="absolute inset-0 w-full h-full text-accent/40 animate-spin-slow" viewBox="0 0 400 400">
        <circle cx="200" cy="50" r="4" fill="currentColor" />
        <circle cx="350" cy="200" r="6" fill="currentColor" />
        <circle cx="200" cy="350" r="3" fill="currentColor" />
        <circle cx="50" cy="200" r="5" fill="currentColor" />
        <line x1="200" y1="50" x2="350" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="350" y1="200" x2="200" y2="350" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="200" y1="350" x2="50" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50" y1="200" x2="200" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      
      <svg className="absolute inset-0 w-full h-full text-secondary/40 animate-spin-reverse-slow" viewBox="0 0 400 400">
        <circle cx="120" cy="120" r="5" fill="currentColor" />
        <circle cx="280" cy="120" r="4" fill="currentColor" />
        <circle cx="280" cy="280" r="6" fill="currentColor" />
        <circle cx="120" cy="280" r="3" fill="currentColor" />
        <line x1="120" y1="120" x2="280" y2="120" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="280" y1="120" x2="280" y2="280" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      </svg>

      {/* Vial Graphic */}
      <svg className="relative z-10 w-48 h-80 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] transform-gpu transition-transform duration-700 group-hover:scale-105" viewBox="0 0 160 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vialGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="liquid" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#2F5FFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="cap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2F5FFF" />
            <stop offset="50%" stopColor="#4A80FF" />
            <stop offset="100%" stopColor="#1A40CC" />
          </linearGradient>
        </defs>

        {/* Liquid */}
        <path d="M40 280 C40 290 50 295 80 295 C110 295 120 290 120 280 L120 120 Q100 115 80 120 Q60 125 40 120 Z" fill="url(#liquid)" />
        
        {/* Bubbles */}
        <circle cx="60" cy="260" r="4" fill="#fff" opacity="0.6">
           <animate attributeName="cy" values="260; 120" dur="3s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0; 0.6; 0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="240" r="3" fill="#fff" opacity="0.4">
           <animate attributeName="cy" values="240; 120" dur="2.5s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0; 0.8; 0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="200" r="5" fill="#fff" opacity="0.5">
           <animate attributeName="cy" values="200; 120" dur="4s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0; 0.5; 0" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Vial Body (Glass) */}
        <path d="M30 80 L30 280 C30 295 45 300 80 300 C115 300 130 295 130 280 L130 80 Z" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" fill="url(#vialGlass)" />
        <path d="M40 80 L120 80" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" />
        <path d="M30 280 C30 295 45 300 80 300 C115 300 130 295 130 280" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.6" />

        {/* Neck */}
        <rect x="55" y="45" width="50" height="35" fill="url(#vialGlass)" stroke="#fff" strokeWidth="2" strokeOpacity="0.5" />
        <path d="M30 80 Q55 80 55 45 M130 80 Q105 80 105 45" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.5" fill="none" />
        
        {/* Cap Crimp */}
        <rect x="50" y="30" width="60" height="15" rx="2" fill="url(#cap)" />
        <rect x="50" y="35" width="60" height="2" fill="#fff" opacity="0.3" />
        
        {/* Rubber Stopper Top */}
        <path d="M60 30 L60 20 C60 15 100 15 100 20 L100 30 Z" fill="#E7ECF3" />
        
        {/* Highlights */}
        <path d="M40 90 L40 270" stroke="#fff" strokeWidth="4" strokeOpacity="0.5" strokeLinecap="round" />
        <path d="M120 150 L120 220" stroke="#fff" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
