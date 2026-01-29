import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Map, Compass, Cloud, Sun, Wind, CloudSun, Thermometer, Settings, ArrowRight, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import { Phrase, Trivia } from '../types';

const WEATHER_DATA = [
  { city: 'Marrakech', temp: 28, icon: Sun, color: 'text-orange-500' },
  { city: 'Casablanca', temp: 22, icon: CloudSun, color: 'text-blue-400' },
  { city: 'Chefchaouen', temp: 19, icon: Cloud, color: 'text-blue-300' },
  { city: 'Fes', temp: 25, icon: Sun, color: 'text-yellow-500' },
  { city: 'Tangier', temp: 21, icon: Wind, color: 'text-teal-400' },
  { city: 'Merzouga', temp: 32, icon: Thermometer, color: 'text-red-500' },
  { city: 'Agadir', temp: 24, icon: Sun, color: 'text-orange-400' },
];

const NavIcon = ({ label, onClick, img }: { label: string, onClick: () => void, img: string }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 group w-full mb-2"
  >
    {/* Diamond Shape Container for Moroccan Touch */}
    <div className="w-14 h-14 sm:w-16 sm:h-16 transform rotate-45 overflow-hidden shadow-lg border-2 border-[#D4AF37] group-hover:border-[#B8860B] group-hover:scale-105 transition-all duration-300 relative bg-white flex items-center justify-center mt-3 mb-1">
       {/* Counter-rotate content so it stays straight */}
       <div className="absolute inset-[-40%] transform -rotate-45 flex items-center justify-center bg-[#FDFBF7]">
            <img src={img} alt={label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
       </div>
       
       {/* Inner Border decorative line */}
       <div className="absolute inset-1 border border-[#D4AF37]/30 pointer-events-none"></div>
    </div>
    
    <span className="text-[10px] sm:text-xs font-bold text-[#5D4037] uppercase tracking-wide text-center max-w-[80px] leading-tight">{label}</span>
  </button>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { phrases, trivia } = useContent();
  const [randomPhrase, setRandomPhrase] = useState<Phrase | null>(null);
  const [randomTrivia, setRandomTrivia] = useState<Trivia | null>(null);
  const [isTriviaRevealed, setIsTriviaRevealed] = useState(false);
  const [isPlayingPhrase, setIsPlayingPhrase] = useState(false);

  useEffect(() => {
    if (phrases && phrases.length > 0) {
      setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
    if (trivia && trivia.length > 0) {
       setRandomTrivia(trivia[Math.floor(Math.random() * trivia.length)]);
    }
    
    // Cleanup speech on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [phrases, trivia]);

  // Pre-load voices (fix for Chrome requiring user interaction/event)
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleRevealTrivia = () => {
    setIsTriviaRevealed(!isTriviaRevealed);
  };

  const playPhraseAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!randomPhrase) return;

    window.speechSynthesis.cancel();

    // Utterance for the Darija text
    const utterance = new SpeechSynthesisUtterance(randomPhrase.darija);
    
    // VOICE SELECTION LOGIC
    const voices = window.speechSynthesis.getVoices();
    
    // 1. Try to find a specific Moroccan Arabic voice (ar-MA)
    let selectedVoice = voices.find(v => v.lang === 'ar-MA');
    
    // 2. If not found, try any Arabic voice (ar, ar-SA, ar-EG)
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('ar'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Fallback if no Arabic voice is installed on the OS
      utterance.lang = 'ar';
    }

    // Slow down slightly for better Darija clarity
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsPlayingPhrase(true);
    utterance.onend = () => setIsPlayingPhrase(false);
    utterance.onerror = () => setIsPlayingPhrase(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans">
      
      {/* HEADER: Enhanced Moroccan Style */}
      <div className="relative bg-[#0B1E3B] pt-14 pb-10 px-6 text-center rounded-b-[3rem] shadow-2xl z-10 overflow-hidden border-b-4 border-[#C19A6B]">
         
         {/* Admin/Settings Quick Access */}
         <button 
           onClick={() => navigate('/admin')}
           className="absolute top-6 right-6 z-30 p-2 bg-white/10 backdrop-blur-md rounded-full text-[#F4E6C2] hover:bg-white/20 border border-[#F4E6C2]/20 transition-all shadow-lg"
           aria-label="Admin Panel"
         >
            <Settings size={18} />
         </button>

         {/* Geometric Background Pattern */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
               <defs>
                  <pattern id="moroccan-geo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                     <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="#F4E6C2" strokeWidth="1"/>
                     <circle cx="20" cy="20" r="3" fill="#C19A6B"/>
                     <circle cx="0" cy="0" r="2" fill="#F4E6C2"/>
                     <circle cx="40" cy="0" r="2" fill="#F4E6C2"/>
                     <circle cx="0" cy="40" r="2" fill="#F4E6C2"/>
                     <circle cx="40" cy="40" r="2" fill="#F4E6C2"/>
                  </pattern>
               </defs>
               <rect width="100%" height="100%" fill="url(#moroccan-geo)" />
            </svg>
         </div>

         {/* Islamic Star/Ornament Corner Accents */}
         <div className="absolute -top-6 -left-6 w-32 h-32 text-[#C19A6B] opacity-20 pointer-events-none">
             <svg viewBox="0 0 100 100" fill="currentColor">
               <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
             </svg>
         </div>
         <div className="absolute -top-6 -right-6 w-32 h-32 text-[#C19A6B] opacity-20 pointer-events-none">
             <svg viewBox="0 0 100 100" fill="currentColor">
               <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" />
             </svg>
         </div>
         
         {/* Title Block */}
         <div className="relative z-10 mt-2 flex flex-col items-center">
            <div className="inline-block border-t border-b border-[#C19A6B]/50 py-2 px-6 mb-2 bg-[#0B1E3B]/50 backdrop-blur-sm">
                 <h1 className="text-4xl font-display font-bold text-[#F4E6C2] drop-shadow-lg tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Ahlan <span className="italic text-[#C19A6B]">Morocco</span>
                </h1>
            </div>
            <p className="text-[#F4E6C2]/70 text-[10px] uppercase tracking-[0.3em] font-medium mb-3">Your Gateway to Maghreb</p>
            
            <button 
              onClick={() => navigate('/planner')}
              className="bg-[#D4AF37] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-[#b89628] transition-transform active:scale-95 border border-[#F4E6C2]/20"
            >
               + Plan Your Trip
            </button>
         </div>
      </div>

      <div className="px-5 space-y-6 -mt-6 pb-24 relative z-20">
        
        {/* WEATHER WIDGET (Horizontal Scroll) */}
        <div className="mx-1 relative z-30">
            <div className="flex overflow-x-auto no-scrollbar gap-2 py-1">
                {WEATHER_DATA.map((w, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl shadow-sm border border-[#E6CDB2] min-w-[85px] flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                        <span className="font-display font-bold text-stone-700 text-[10px] uppercase text-center leading-tight">{w.city}</span>
                        <div className="flex items-center gap-1.5">
                            <w.icon size={14} className={w.color} />
                            <span className="font-bold text-stone-800 text-xs">{w.temp}°C</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* HERO: Sahara Adventure */}
        <div 
          onClick={() => navigate('/mood/adventure')}
          className="relative h-44 rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer group transform transition hover:scale-[1.01]"
        >
          <img 
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=800" 
            className="w-full h-full object-cover" 
            alt="Sahara" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#8B4513]/90 via-transparent to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-[#F4E6C2] animate-pulse" />
                <span className="text-[#F4E6C2] text-xs uppercase tracking-widest font-bold">Featured</span>
            </div>
            <span className="text-white font-display text-2xl font-bold drop-shadow-md">Sahara Adventure</span>
          </div>
        </div>

        {/* ICON GRID - Moroccan Diamond Style */}
        <div className="pt-2 pb-2">
          <div className="flex justify-between items-start px-1">
             <NavIcon 
               label="Top Spots" 
               onClick={() => navigate('/explore?filter=city')} 
               img="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=200"
             />
             <NavIcon 
               label="Cuisine" 
               onClick={() => navigate('/mood/food')} 
               img="https://images.unsplash.com/photo-1541518738315-bb945a90e580?auto=format&fit=crop&q=80&w=200"
             />
             <NavIcon 
               label="Culture" 
               onClick={() => navigate('/mood/culture')} 
               img="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=200"
             />
             <NavIcon 
               label="Guide Info" 
               onClick={() => navigate('/safety')} 
               img="https://images.unsplash.com/photo-1544977421-4d1421691942?auto=format&fit=crop&q=80&w=200"
             />
          </div>
        </div>

        {/* MEDINA MODE CARD */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#D4AF37]/40 group bg-[#FFF8E7]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="medina-pat" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                       <circle cx="2" cy="2" r="1" fill="#8B4513" />
                       <circle cx="12" cy="12" r="1" fill="#8B4513" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#medina-pat)" />
                 </svg>
            </div>

            <div className="relative p-5 flex items-center justify-between">
               <div className="flex-1 z-10">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="text-[#8B4513]"><Map size={20} /></div>
                     <h3 className="font-display font-bold text-[#8B4513] text-xl">Medina Mode</h3>
                  </div>
                  <p className="text-[#5D4037] text-xs font-medium max-w-[160px] leading-snug">Navigate the Souks safely</p>
               </div>
               <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-transparent to-transparent z-0"></div>
               <div className="w-20 h-20 absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
                  <img src="https://cdn-icons-png.flaticon.com/512/5770/5770956.png" className="w-full h-full object-contain" alt="Lantern" />
               </div>
               <button 
                 onClick={() => navigate('/medina-mode')}
                 className="bg-[#0B1E3B] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-[#1a3a6b] transition-colors z-10 border border-[#D4AF37]"
               >
                 Start
               </button>
            </div>
        </div>

        {/* ADVENTURE AWAITS CARD - REDESIGNED */}
        <div 
           onClick={() => navigate('/mood/adventure')}
           className="relative h-44 rounded-2xl overflow-hidden shadow-xl border border-[#0B1E3B]/20 cursor-pointer group transform transition-all hover:scale-[1.02]"
        >
           {/* Background Image with slight zoom effect on hover */}
           <img 
             src="https://images.unsplash.com/photo-1465311440653-ba9bf472a644?auto=format&fit=crop&q=80&w=800" 
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
             alt="Atlas Mountains" 
           />
           
           {/* Dark Gradient Overlay for Readability */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E3B] via-[#0B1E3B]/60 to-transparent p-6 flex flex-col justify-center">
              
              {/* Badge */}
              <div className="flex items-center gap-1.5 mb-2">
                 <div className="bg-[#D4AF37] p-1 rounded-full">
                    <Compass size={12} className="text-[#0B1E3B]" />
                 </div>
                 <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">Explore Nature</span>
              </div>

              {/* Typography */}
              <h3 className="text-white font-display font-bold text-2xl leading-tight mb-1 drop-shadow-md">Adventure Awaits</h3>
              <p className="text-stone-200 text-xs font-medium mb-4 max-w-[220px] leading-relaxed">Trek the High Atlas & Discover Hidden Valleys</p>
              
              {/* Button */}
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white w-fit px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wide shadow-sm group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-[#0B1E3B] transition-all flex items-center gap-2">
                 Start Journey <ArrowRight size={12} />
              </button>
           </div>
        </div>
        
        {/* FOOTER UTILS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Phrase */}
            <div 
               onClick={playPhraseAudio}
               className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col gap-2 relative overflow-hidden cursor-pointer active:scale-95 transition-transform group"
            >
               <div className="absolute top-0 right-0 p-2 opacity-10"><Play size={40} className="text-[#D4AF37]" /></div>
               <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider flex items-center gap-1">
                  Daily Phrase {isPlayingPhrase && <Volume2 size={10} className="animate-pulse" />}
               </span>
               <div className="z-10">
                  <p className="font-bold text-stone-800 text-lg">{randomPhrase?.darija || "Salam"}</p>
                  <p className="text-xs text-stone-500 italic">{randomPhrase?.english || "Hello"}</p>
                  <div className="mt-2 text-[9px] text-stone-400 flex items-center gap-1 group-hover:text-[#D4AF37]">
                     <Volume2 size={10} /> Tap for Darija
                  </div>
               </div>
            </div>
            {/* Trivia */}
            {randomTrivia ? (
               <div 
                 onClick={handleRevealTrivia}
                 className="bg-[#0B1E3B] p-4 rounded-xl shadow-sm border border-stone-800 flex flex-col gap-2 cursor-pointer relative overflow-hidden active:scale-95 transition-transform"
               >
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={40} className="text-white" /></div>
                  <span className="text-[10px] font-bold uppercase text-[#F4E6C2] tracking-wider flex items-center gap-1 z-10"><Sparkles size={10}/> Trivia</span>
                  <p className="text-xs font-medium text-white/90 leading-snug z-10">
                     {isTriviaRevealed ? randomTrivia.a : randomTrivia.q}
                  </p>
               </div>
            ) : (
               <div className="bg-[#0B1E3B] p-4 rounded-xl shadow-sm flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
               </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;