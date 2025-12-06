import React, { useRef, useState, MouseEvent } from 'react';
import { DictionaryEntry } from '../types';

interface ResultCardProps {
  entry: DictionaryEntry;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ entry, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Disable 3D tilt on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limit rotation to +/- 5 degrees
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
        setIsHovered(true);
    }
  };

  // Fallback Audio using Google Translate TTS API (Unofficial but robust)
  // This runs if the native device TTS fails or doesn't support Japanese
  const playFallbackAudio = (text: string) => {
    // Ensure we don't overlap multiple audios
    setIsPlaying(true);
    
    const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=ja`);
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
        setIsPlaying(false);
        console.error("Audio playback failed completely (Native & Fallback)");
    };
    
    audio.play().catch(e => {
        setIsPlaying(false);
        console.error("Audio play error:", e);
    });
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = entry.word || entry.reading;
    
    // 1. Check if browser supports speech synthesis at all
    if (!window.speechSynthesis) {
        playFallbackAudio(textToSpeak);
        return;
    }
    
    // Stop any previous speech
    window.speechSynthesis.cancel(); 
    
    // 2. Setup Native TTS
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;

    // Check availability of Japanese Voice
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    
    if (jaVoice) {
        utterance.voice = jaVoice;
    }

    // SAFETY NET: If native TTS hangs/freezes (common on Android), force fallback after 500ms
    const safetyTimeout = setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
            console.warn("Native TTS timed out, switching to fallback...");
            window.speechSynthesis.cancel();
            playFallbackAudio(textToSpeak);
        }
    }, 500);

    utterance.onstart = () => {
        clearTimeout(safetyTimeout); // It started working, cancel the fallback timer
        setIsPlaying(true);
    };

    utterance.onend = () => {
        clearTimeout(safetyTimeout);
        setIsPlaying(false);
    };

    utterance.onerror = (e) => {
        clearTimeout(safetyTimeout);
        // Sometimes 'interrupted' or 'canceled' errors happen normally, don't fallback on those
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
             playFallbackAudio(textToSpeak);
        } else {
             setIsPlaying(false);
        }
    };

    // If voices are empty (first load issue) or no JA voice, fallback immediately
    if (voices.length > 0 && !jaVoice) {
         clearTimeout(safetyTimeout);
         playFallbackAudio(textToSpeak);
         return;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Helper to format the meaning text (bullet points or numbered lists)
  const renderMeaning = (text: string) => {
    if (!text) return <span className="text-gray-400 italic">No definition available.</span>;
    
    // Stricter regex to detect numbers at start of line
    const hasNumbers = /(?:^|\s)\d+\./.test(text);

    if (hasNumbers) {
      const parts = text.split(/(?=(?:^|\s)\d+\.)/g).filter(p => p.trim().length > 0);
      return (
        <div className="flex flex-col gap-2">
          {parts.map((part, i) => (
            <div key={i} className="text-gray-700 text-sm leading-relaxed font-sans font-medium bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
              {part.trim().replace(/;$/, '')}
            </div>
          ))}
        </div>
      );
    }
    
    if (text.includes(';')) {
       const parts = text.split(';').filter(p => p.trim().length > 0);
       return (
         <ul className="space-y-1">
           {parts.map((part, i) => (
             <li key={i} className="text-gray-700 text-sm leading-relaxed font-sans font-medium flex items-start gap-2">
               <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
               <span>{part.trim()}</span>
             </li>
           ))}
         </ul>
       );
    }

    return (
      <p className="text-gray-700 text-sm leading-relaxed font-sans font-medium">
        {text}
      </p>
    );
  };

  return (
    <div
      className="perspective-container h-auto w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="card-3d relative h-auto bg-white border border-gray-100 rounded-xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.01 : 1})`,
        }}
      >
        <div className="relative z-10 flex flex-col h-auto">
            
            {/* Header: Entry ID & Status Dot */}
            <div className="flex items-baseline justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                  Entry #{index + 1}
                </span>
                <div 
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${isHovered ? 'bg-brandRed shadow-[0_0_8px_#DC2626]' : 'bg-gray-200'}`}
                ></div>
            </div>
            
            {/* Word (Kanji) */}
            <h2 className="text-4xl font-jp font-black text-brandBlack mb-1 leading-tight tracking-tight">
              {entry.word}
            </h2>
            
            {/* Reading (Kana) & Audio Button */}
            <div className="flex items-center gap-3 mb-5">
                <p className="text-brandRed font-jp text-lg font-bold tracking-wide">
                  {entry.reading}
                </p>
                <button 
                    onClick={handlePlayAudio}
                    className={`p-1.5 rounded-full transition-all duration-200 flex-shrink-0 ${
                        isPlaying 
                        ? 'bg-brandRed/10 text-brandRed scale-110' 
                        : 'text-gray-300 hover:text-brandRed hover:bg-red-50'
                    }`}
                    title="Play Pronunciation"
                >
                    {isPlaying ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0A3.987 3.987 0 0115 10a3.987 3.987 0 01-1.293 2.707 1 1 0 01-1.414-1.414A1.987 1.987 0 0013 10a1.987 1.987 0 00-.707-1.707 1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="w-12 h-0.5 bg-gray-100 mb-4"></div>

            {/* Meaning Section */}
            <div>
                {renderMeaning(entry.meaning)}
            </div>

            {/* External Links Section */}
            <div className="mt-6 flex justify-end">
                <a 
                    href={`https://massif.la/ja/search?q=${entry.word}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brandRed/80 hover:text-brandRed bg-brandRed/5 hover:bg-brandRed/10 px-3 py-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-brandRed/20"
                >
                    <span>Contoh Kalimat</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};