import React, { KeyboardEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, isLoading }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 z-50">
        <div className="group relative">
            {/* Soft Shadow Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brandRed/20 to-brandBlack/10 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
            
            <div className="relative flex items-center bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <button 
                    onClick={onSearch}
                    className="pl-6 pr-2 py-4 text-brandRed hover:text-red-700 hover:scale-110 transition-all duration-200 focus:outline-none"
                    aria-label="Search"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Cari Kosakata"
                    className="w-full bg-transparent text-gray-800 text-lg px-2 py-6 focus:outline-none placeholder-gray-400 font-sans font-medium"
                />
                {isLoading && (
                    <div className="pr-6">
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brandRed"></div>
                    </div>
                )}
            </div>
        </div>
        
        {/* Helper Text */}
        <div className="flex justify-center mt-3 gap-6 text-[10px] md:text-xs text-gray-400 font-medium tracking-wide">
             <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                SERVER TERHUBUNG
             </span>
             <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brandBlack rounded-full"></span>
                MENDUKUNG ROMAJI
             </span>
        </div>
    </div>
  );
};