import React from 'react';

// Reusable Lantern Component (Passive Animation)
const Lantern = ({ 
  className, 
  kanji, 
  swayDelay = '0s', 
  swingDirection = 'alternate' 
}: { 
  className?: string; 
  kanji: string; 
  swayDelay?: string; 
  swingDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}) => {
  return (
    <div className={`absolute ${className}`}>
      <div 
        className="lantern-container animate-sway"
        style={{ 
          animationDelay: swayDelay,
          animationDirection: swingDirection 
        }}
      >
          <div className="lantern-string"></div>
          <div className="lantern-body">
              <div className="lantern-cap"></div>
              {/* Ribs for texture */}
              <div className="lantern-rib"></div>
              <div className="lantern-rib"></div>
              <div className="lantern-rib"></div>
              <div className="lantern-rib"></div>
              <div className="lantern-cap"></div>
              
              <div className="lantern-kanji">{kanji}</div>
          </div>
      </div>
    </div>
  );
};

export const Hero3D: React.FC = () => {
  return (
    <div className="relative w-full h-56 flex items-center justify-center perspective-container overflow-visible mb-4">
      
      {/* 3D Objects Layer */}
      <div className="absolute inset-0 pointer-events-none">
          
          {/* 1. Japanese Lantern (Left) */}
          <Lantern 
            className="top-[25%] left-[5%] md:left-[15%]" 
            kanji="知" 
            swayDelay="-1s"
            swingDirection="alternate" 
          />

           {/* 2. Japanese Lantern (Right) */}
           <Lantern 
            className="top-[30%] right-[5%] md:right-[15%]" 
            kanji="和" 
            swayDelay="-3s"
            swingDirection="alternate" 
           />

           {/* 3. Sakura Petals (Floating) */}
           {/* Petal 1 */}
           <div className="absolute top-0 right-[20%] animate-fall" style={{ animationDuration: '8s' }}>
              <div className="sakura"></div>
           </div>
           {/* Petal 2 */}
           <div className="absolute bottom-10 left-[10%] animate-fall" style={{ animationDuration: '12s', animationDelay: '2s' }}>
              <div className="sakura" style={{ width: '12px', height: '12px', background: '#fbcfe8' }}></div>
           </div>
           {/* Petal 3 */}
           <div className="absolute top-1/2 right-[25%] animate-fall" style={{ animationDuration: '7s', animationDelay: '4s' }}>
              <div className="sakura" style={{ transform: 'rotate(45deg)' }}></div>
           </div>
           {/* Petal 4 */}
           <div className="absolute top-10 left-[30%] animate-fall" style={{ animationDuration: '10s', animationDelay: '1s' }}>
              <div className="sakura" style={{ width: '16px', height: '16px', opacity: 1 }}></div>
           </div>
           {/* Petal 5 */}
           <div className="absolute top-[60%] left-[40%] animate-fall" style={{ animationDuration: '15s', animationDelay: '5s' }}>
              <div className="sakura" style={{ transform: 'rotate(90deg)', opacity: 0.7 }}></div>
           </div>
           {/* Petal 6 */}
           <div className="absolute -top-10 right-[40%] animate-fall" style={{ animationDuration: '9s', animationDelay: '0.5s' }}>
              <div className="sakura" style={{ width: '10px', height: '10px' }}></div>
           </div>
           {/* Petal 7 */}
           <div className="absolute top-[40%] right-[10%] animate-fall" style={{ animationDuration: '11s', animationDelay: '3.5s' }}>
              <div className="sakura" style={{ background: '#f9a8d4' }}></div>
           </div>
      </div>

      {/* Main Branding */}
      <div className="relative z-10 text-center transform hover:scale-105 transition-transform duration-500">
        {/* Added Drop Shadow/Glow to Text to prevent blending with background objects */}
        <h1 className="text-7xl md:text-9xl font-black font-sans tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
          <span className="text-brandRed">JI</span>
          <span className="text-brandBlack">Dict</span>
        </h1>
        <div className="flex items-center justify-center mt-4 gap-4 drop-shadow-md">
             <div className="h-[2px] w-8 md:w-12 bg-brandBlack/20"></div>
             <div className="text-brandBlack/60 font-mono tracking-[0.2em] text-xs md:text-sm uppercase whitespace-nowrap">
                Kamus Jepang 299.960 Kosakata
             </div>
             <div className="h-[2px] w-8 md:w-12 bg-brandBlack/20"></div>
        </div>

        {/* Footer Link */}
        <div className="mt-4">
            <a 
              href="https://philiaspace.my.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-brandBlack/60 hover:text-brandRed transition-all duration-300 group"
            >
              <span className="underline decoration-brandBlack/30 hover:decoration-brandRed underline-offset-2">
                Di buat oleh Philia Space Community
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
        </div>
      </div>
    </div>
  );
};