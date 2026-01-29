import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MosaicHeader from '../components/MosaicHeader';
import { 
  ArrowLeft, Map as MapIcon, Volume2, Navigation, 
  ShieldCheck, Share2, ShoppingBag, Info, Play, Pause, X,
  WifiOff, Headphones, Footprints, Coins, Tag, Briefcase, Droplets, Armchair
} from 'lucide-react';

// Mock Data for the Medina Map
const LANDMARKS = [
  { id: 1, name: "Chouara Tannery", x: 65, y: 30, type: "landmark", audio: "The oldest tannery in the world, operating since the 11th century. Best viewed from the balconies. The distinct smell comes from the mixtures used to soften leather, including limestone and pigeon droppings.", duration: "0:45" },
  { id: 2, name: "Al-Attarine Madrasa", x: 45, y: 55, type: "landmark", audio: "A masterpiece of Merenid architecture. Notice the intricate zellige tilework and cedar wood carving. It was built between 1323 and 1325 by Sultan Uthman II.", duration: "1:15" },
  { id: 3, name: "Bou Inania", x: 25, y: 70, type: "landmark", audio: "One of the few religious buildings non-Muslims can enter. It functioned as both a school and a mosque. It is widely acknowledged as an excellent example of Marinid architecture.", duration: "0:50" },
  { id: 4, name: "Blue Gate (Bab Boujeloud)", x: 10, y: 80, type: "entry", audio: "The main western entrance. Blue on the outside for Fes, Green on the inside for Islam. A perfect meeting point and gateway to the old medina.", duration: "0:30" },
];

const SHOPPING_ZONES = [
  { id: 's1', name: "Leather Souk", x: 60, y: 40 },
  { id: 's2', name: "Spice Market", x: 40, y: 60 },
];

const SHOP_ITEMS = [
  { id: 'i1', name: "Leather Satchel", price: "350 - 550 MAD", x: 62, y: 36, icon: Briefcase, desc: "Genuine camel or goat leather. Smell it to ensure authenticity (should smell like leather, not chemicals)." },
  { id: 'i2', name: "Saffron (1g)", price: "30 - 50 MAD", x: 38, y: 64, icon: Tag, desc: "Real saffron turns water yellow, not red. Taliouine saffron is the best quality." },
  { id: 'i3', name: "Babouches", price: "70 - 150 MAD", x: 55, y: 45, icon: Footprints, desc: "Traditional slippers. Yellow is for men, embroidered colors for women." },
  { id: 'i4', name: "Argan Oil (100ml)", price: "80 - 150 MAD", x: 42, y: 58, icon: Droplets, desc: "Cosmetic is clear/yellow, Culinary is darker/nutty. Shake it - pure oil shouldn't have sediment." },
  { id: 'i5', name: "Leather Pouf", price: "250 - 400 MAD", x: 65, y: 42, icon: Armchair, desc: "Sold unstuffed. Check the zipper quality on the bottom and stitching strength before buying." },
];

const BARGAINING_TIPS = [
  { title: "The walk away", text: "If the price isn't right, politely say 'Shukran' and walk away. 80% of the time, they will call you back with a lower price." },
  { title: "The 50% Rule", text: "Start your offer at roughly 40-50% of their opening price. Aim to meet in the middle (around 70-75%)." },
  { title: "Keep it friendly", text: "Bargaining is a social interaction, not a fight. Smile, joke, and compliment the shop." },
  { title: "Hidden Pockets", text: "Don't pull out a large wad of cash. Keep small bills in a separate pocket to show 'this is all I have'." },
];

const MedinaModePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'map' | 'tips'>('map');
  const [showSafePath, setShowSafePath] = useState(true);
  
  const [selectedLandmark, setSelectedLandmark] = useState<typeof LANDMARKS[0] | null>(null);
  const [selectedShopItem, setSelectedShopItem] = useState<typeof SHOP_ITEMS[0] | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Audio Guide Controller
  const toggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      if (!selectedLandmark) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedLandmark.audio);
      // For Landmark descriptions (which are in English in the database), use an English voice for clarity
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Simulate getting location for "I'm Lost"
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log("Location access denied")
      );
    }
  }, []);

  const handleShareLocation = async () => {
    const text = `I'm exploring the Medina! Current Location: ${currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : 'Near Bab Boujeloud'}. Need assistance.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location in Medina',
          text: text,
          url: 'https://maps.google.com'
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      alert("Location copied to clipboard!");
    }
    setShowLostModal(false);
  };

  const handleLandmarkClick = (l: typeof LANDMARKS[0]) => {
    setSelectedShopItem(null); // Close shop item if open
    setSelectedLandmark(l); 
    setIsPlaying(false); 
    window.speechSynthesis.cancel();
  };

  const handleShopItemClick = (item: typeof SHOP_ITEMS[0]) => {
    setSelectedLandmark(null); // Close landmark if open
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    setSelectedShopItem(item);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] overflow-hidden">
      {/* Header */}
      <div className="relative bg-[#0B1E3B] pt-safe pb-4 px-4 shadow-lg z-20">
        <div className="flex justify-between items-center mb-4 pt-4">
           <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft size={24} />
           </button>
           <div className="flex flex-col items-center">
              <h1 className="text-white font-display font-bold text-xl tracking-wider">Medina Mode</h1>
              <div className="flex items-center gap-1.5 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                 <span className="text-[10px] text-green-100 font-bold uppercase tracking-wide">Offline Ready</span>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setShowInfoModal(true)} 
               className="text-[#D4AF37] hover:text-[#F4E6C2] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
               title="Feature Guide"
             >
                <Info size={20} />
             </button>
             <button 
                onClick={() => setActiveTab(activeTab === 'map' ? 'tips' : 'map')} 
                className={`p-2 rounded-full transition-colors ${activeTab === 'tips' ? 'bg-[#D4AF37] text-[#0B1E3B]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title={activeTab === 'map' ? "Switch to Bargaining Tips" : "Switch to Map"}
             >
                {activeTab === 'map' ? <ShoppingBag size={20} /> : <MapIcon size={20} />}
             </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {activeTab === 'map' ? (
          <div className="w-full h-full relative bg-[#D6C4B0]">
            {/* SVG Map Visualization */}
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
              {/* Background Texture (Buildings) */}
              <pattern id="buildings" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="9" height="9" fill="#C5B4A0" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#buildings)" />
              
              {/* Winding Alleys (White space) - Increased stroke for clarity */}
              <path 
                d="M10,80 Q25,75 25,70 T45,55 T65,30 M45,55 Q50,50 60,40 M25,70 Q35,65 40,60" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="drop-shadow-sm"
              />

              {/* Safe Path Overlay */}
              {showSafePath && (
                <path 
                  d="M10,80 Q25,75 25,70 T45,55 T65,30" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="2" 
                  strokeDasharray="3,1" 
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Interactive Elements Layer */}
            <div className="absolute inset-0 z-10">
               {/* Landmarks */}
               {LANDMARKS.map(l => (
                 <button
                    key={l.id}
                    onClick={() => handleLandmarkClick(l)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                      selectedLandmark?.id === l.id ? 'bg-[#0B1E3B] scale-125 z-20 ring-2 ring-white' : 'bg-[#C19A6B] z-10 hover:scale-110'
                    }`}
                    style={{ left: `${l.x}%`, top: `${l.y}%` }}
                    aria-label={`Select landmark ${l.name}`}
                 >
                    <Volume2 size={14} className="text-white" />
                 </button>
               ))}

               {/* Shop Markers */}
               {SHOP_ITEMS.map(item => (
                 <button
                    key={item.id}
                    onClick={() => handleShopItemClick(item)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 border border-white ${
                      selectedShopItem?.id === item.id ? 'bg-[#8B4513] scale-125 z-20' : 'bg-[#D4AF37] z-10 hover:scale-110'
                    }`}
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    aria-label={`View price for ${item.name}`}
                 >
                    <Tag size={12} className="text-white" />
                 </button>
               ))}
               
               {/* Shopping Zones Labels */}
               {SHOPPING_ZONES.map(s => (
                  <div 
                    key={s.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-[10px] font-bold text-[#8B4513] border border-[#8B4513]/20 shadow-sm whitespace-nowrap flex items-center gap-1"
                    style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  >
                    <ShoppingBag size={10} /> {s.name}
                  </div>
               ))}

               {/* Current Location Marker */}
               <div className="absolute left-[10%] top-[80%] z-20 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                  <div className="mt-1 bg-black/50 text-white text-[8px] px-1.5 rounded font-bold backdrop-blur-sm">You</div>
               </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-20 items-end">
               <button 
                 onClick={() => setShowSafePath(!showSafePath)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all font-bold text-xs ${showSafePath ? 'bg-[#10B981] text-white' : 'bg-white text-stone-600 border border-stone-200'}`}
               >
                  <ShieldCheck size={16} />
                  {showSafePath ? 'Safe Path On' : 'Safe Path Off'}
               </button>
               <button 
                 onClick={() => setShowLostModal(true)}
                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white shadow-lg animate-pulse hover:bg-red-700 transition-colors font-bold text-xs border border-red-500"
               >
                  <Navigation size={16} />
                  I'm Lost (SOS)
               </button>
            </div>

            {/* Price Guide Popup (Shop Item) */}
            {selectedShopItem && (
               <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-30 animate-in slide-in-from-bottom-10">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-2">
                        <div className="bg-[#D4AF37]/20 p-2 rounded-full text-[#B8860B]">
                           <selectedShopItem.icon size={18} />
                        </div>
                        <div>
                           <h3 className="font-display font-bold text-[#0B1E3B] text-lg leading-tight">{selectedShopItem.name}</h3>
                           <p className="text-[10px] text-stone-500 uppercase tracking-wide font-bold">Price Guide</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedShopItem(null)} 
                        className="text-stone-400 hover:text-stone-600"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 mb-3 text-center">
                     <span className="block text-xs text-stone-500 uppercase font-bold mb-1">Target Price Range</span>
                     <span className="block text-xl font-bold text-[#0B1E3B]">{selectedShopItem.price}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic border-t border-stone-100 pt-3">
                     Tip: {selectedShopItem.desc}
                  </p>
               </div>
            )}

            {/* Landmark Audio Card */}
            {selectedLandmark && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border border-stone-200 p-4 z-30 animate-in slide-in-from-bottom-10">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display font-bold text-[#0B1E3B] text-lg">{selectedLandmark.name}</h3>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">Audio Guide • {selectedLandmark.duration}</p>
                    </div>
                    <button 
                      onClick={() => { 
                        setSelectedLandmark(null); 
                        setIsPlaying(false); 
                        window.speechSynthesis.cancel(); 
                      }} 
                      className="text-stone-400 hover:text-stone-600"
                    >
                       <X size={20} />
                    </button>
                 </div>
                 <p className="text-sm text-stone-600 mb-4 leading-relaxed line-clamp-3">{selectedLandmark.audio}</p>
                 <button 
                   onClick={toggleAudio}
                   className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                     isPlaying ? 'bg-[#D4AF37] text-white' : 'bg-[#0B1E3B] text-white'
                   }`}
                 >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    {isPlaying ? 'Pause Audio' : 'Play Audio Cue'}
                 </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto bg-[#FDFBF7] p-4 pb-24">
             <div className="bg-[#0B1E3B] text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="font-display font-bold text-2xl mb-2">Master the Souks</h2>
                   <p className="text-white/80 text-sm">Bargaining is an art form in Morocco. It is expected, respectful, and can be fun!</p>
                </div>
                <div className="absolute -right-6 -bottom-6 opacity-10 text-white">
                   <ShoppingBag size={120} />
                </div>
             </div>

             <div className="space-y-4">
                {BARGAINING_TIPS.map((tip, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex gap-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#B8860B] font-bold text-sm">
                        {idx + 1}
                     </div>
                     <div>
                        <h3 className="font-bold text-[#0B1E3B] mb-1">{tip.title}</h3>
                        <p className="text-sm text-stone-600 leading-relaxed">{tip.text}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Info Modal Overlay */}
      {showInfoModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden relative shadow-2xl">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 bg-stone-100 rounded-full p-1"
              >
                <X size={20} />
              </button>
              
              <div className="bg-[#0B1E3B] p-6 text-center">
                 <h2 className="text-2xl font-display font-bold text-[#F4E6C2] mb-1">Feature Guide</h2>
                 <p className="text-white/60 text-xs uppercase tracking-widest">How to use Medina Mode</p>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-stone-100 rounded-lg text-stone-600"><WifiOff size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Offline Maps</h4>
                       <p className="text-xs text-stone-600 leading-snug">The stylized map is pre-loaded. It highlights main landmarks without needing data.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-700"><Footprints size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Safe Path (Green Line)</h4>
                       <p className="text-xs text-stone-600 leading-snug">Toggle the <strong>Safe Path</strong> button to see the widest, most populated routes to avoid getting lost.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-700"><Headphones size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Audio Markers</h4>
                       <p className="text-xs text-stone-600 leading-snug">Tap the speaker icons on the map to hear history and stories about key landmarks.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700"><Tag size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Price Guide</h4>
                       <p className="text-xs text-stone-600 leading-snug">Tap the yellow tags to see realistic price ranges for common souvenirs like leather and saffron.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg text-red-700"><Navigation size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Emergency Location</h4>
                       <p className="text-xs text-stone-600 leading-snug">Tap the red <strong>SOS</strong> button if you get lost to quickly share your coordinates.</p>
                    </div>
                 </div>
                 
                 <button 
                   onClick={() => setShowInfoModal(false)}
                   className="w-full mt-4 bg-[#0B1E3B] text-white py-3 rounded-xl font-bold text-sm shadow-md"
                 >
                    Got it
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* "I'm Lost" Modal Overlay */}
      {showLostModal && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden text-center">
              <div className="bg-red-600 p-6">
                 <Navigation size={48} className="text-white mx-auto mb-2" />
                 <h2 className="text-2xl font-display font-bold text-white">Feeling Lost?</h2>
                 <p className="text-red-100 text-sm">Don't panic. Stay where you are or find a busy shop.</p>
              </div>
              <div className="p-6 space-y-3">
                 <button 
                   onClick={handleShareLocation}
                   className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                 >
                    <Share2 size={18} /> Share My Location
                 </button>
                 <p className="text-xs text-stone-400">Sends precise coordinates to a trusted contact.</p>
                 
                 <div className="border-t border-stone-100 my-4 pt-4">
                    <h3 className="text-xs font-bold text-stone-500 uppercase mb-3">Quick Help Phrases</h3>
                    <div className="space-y-2 text-left">
                       <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                          <p className="text-sm font-bold text-[#0B1E3B]">"Feen Bab Boujeloud?"</p>
                          <p className="text-xs text-stone-500">Where is the Blue Gate?</p>
                       </div>
                       <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                          <p className="text-sm font-bold text-[#0B1E3B]">"Wesh momkin t-3aw-nee?"</p>
                          <p className="text-xs text-stone-500">Can you help me?</p>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => setShowLostModal(false)}
                   className="w-full py-3 text-stone-500 font-bold text-sm hover:text-stone-800"
                 >
                    I found my way
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MedinaModePage;