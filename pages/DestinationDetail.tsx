import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { Review } from '../types';
import { ArrowLeft, Calendar, Star, MapPin, Map, AlignLeft, ChevronDown, ChevronUp, Camera, ImageIcon, X, ZoomIn, ZoomOut, Maximize2, MessageSquare, Plus, Send, User, Mountain, Footprints, Compass, AlertTriangle, ThermometerSun, CheckCircle2 } from 'lucide-react';
import MosaicHeader from '../components/MosaicHeader';

const DetailSkeleton = () => (
  <div className="min-h-screen bg-[#FDFBF7] pb-24 animate-pulse">
    <div className="h-72 bg-stone-200 w-full" />
    <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10 space-y-6">
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 bg-stone-200 rounded-full" />
        <div className="h-6 w-24 bg-stone-200 rounded-full" />
        <div className="h-6 w-16 bg-stone-200 rounded-full" />
      </div>
      <div>
        <div className="h-8 w-1/2 bg-stone-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-full bg-stone-200 rounded" />
          <div className="h-4 w-3/4 bg-stone-200 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-24 w-full bg-stone-200 rounded-xl" />
        <div className="h-24 w-full bg-stone-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const ImageViewer = ({ src, alt, onClose }: { src: string, alt: string, onClose: () => void }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse Handlers
  const handleWheel = (e: React.WheelEvent) => {
     e.stopPropagation();
     if (e.deltaY < 0) {
        setScale(s => Math.min(s + 0.25, 4));
     } else {
        setScale(s => Math.max(s - 0.25, 1));
     }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
     e.preventDefault();
     if (scale > 1) {
       setIsDragging(true);
       setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
     }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
     if (isDragging && scale > 1) {
        e.preventDefault();
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
     }
  };

  const handleMouseUp = () => {
     setIsDragging(false);
  };

  // Touch Handlers for Mobile Panning
  const handleTouchStart = (e: React.TouchEvent) => {
     if (e.touches.length === 1 && scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
     }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (isDragging && e.touches.length === 1 && scale > 1) {
        // e.preventDefault() is implicit with touch-action: none css
        setPosition({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
     }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col animate-in fade-in duration-200 touch-none">
       {/* Toolbar */}
       <div className="flex justify-between items-center p-4 text-white z-50 bg-gradient-to-b from-black/50 to-transparent">
          <span className="text-sm font-bold opacity-80 truncate max-w-[60%]">{alt}</span>
          <div className="flex gap-4 items-center">
             <button onClick={() => setScale(s => Math.max(s - 0.5, 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomOut size={20} /></button>
             <button onClick={() => setScale(s => Math.min(s + 0.5, 4))} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ZoomIn size={20} /></button>
             <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors ml-2"><X size={20} /></button>
          </div>
       </div>
       
       {/* Image Area */}
       <div 
         className="flex-1 overflow-hidden flex items-center justify-center w-full h-full"
         onWheel={handleWheel}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleMouseUp}
       >
          <img 
            src={src} 
            alt={alt} 
            className="max-h-full max-w-full object-contain transition-transform duration-75 select-none"
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default'
            }}
            draggable={false}
          />
       </div>
       <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs pointer-events-none px-4">
          Scroll/Pinch to zoom • Drag to pan
       </div>
    </div>
  );
};

const StarRating = ({ rating, onRate }: { rating: number, onRate?: (r: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={(e) => {
             e.preventDefault();
             onRate && onRate(star);
          }}
          className={`${onRate ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          disabled={!onRate}
          type="button"
        >
          <Star
            size={onRate ? 24 : 16}
            className={`${star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-stone-300'}`}
          />
        </button>
      ))}
    </div>
  )
}

const DifficultyBadge = ({ level }: { level: 'Easy' | 'Moderate' | 'Hard' }) => {
  const colors = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors[level]}`}>
      {level}
    </span>
  );
};

const DestinationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { destinations, addReview } = useContent();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'content' | 'map' | 'trekking'>('content');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const dest = destinations.find(d => d.id === id);
  const [currentHeroImage, setCurrentHeroImage] = useState<string>('');
  const [heroImgLoaded, setHeroImgLoaded] = useState(false);

  // Trekking Data comes directly from destination object
  const trekkingInfo = dest?.trekking;

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (dest) {
        setCurrentHeroImage(dest.image);
        setReviews(dest.reviews || []);
    }
  }, [dest]);

  useEffect(() => {
    // When hero image changes, reset loaded state to show skeleton/loader
    setHeroImgLoaded(false);
  }, [currentHeroImage]);

  if (!dest) {
    return <div className="p-8 text-center text-stone-500">Destination not found</div>;
  }

  if (loading) {
    return <DetailSkeleton />;
  }

  // Calculate Map BBox for embed
  const delta = 0.04; // Zoom level approximation
  const bbox = `${dest.coordinates.lng - delta},${dest.coordinates.lat - delta},${dest.coordinates.lng + delta},${dest.coordinates.lat + delta}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${dest.coordinates.lat},${dest.coordinates.lng}`;

  const toggleDescription = () => setIsDescExpanded(!isDescExpanded);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: 'Traveler', // In a real app this would come from auth
      rating: newRating,
      text: newReviewText,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    };

    // Use context to save review to Supabase
    await addReview(dest.id, newReview);

    setIsWritingReview(false);
    setNewReviewText('');
    setNewRating(5);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 animate-in fade-in duration-500">
       {isFullScreen && <ImageViewer src={currentHeroImage} alt={dest.name} onClose={() => setIsFullScreen(false)} />}

       <div 
         className="relative h-72 group overflow-hidden bg-stone-200 cursor-zoom-in"
         onClick={() => setIsFullScreen(true)}
       >
          {!heroImgLoaded && (
             <div className="absolute inset-0 flex items-center justify-center bg-stone-200 animate-pulse z-10">
                <ImageIcon className="text-stone-400 w-12 h-12" /> 
             </div>
          )}
          <img 
            src={currentHeroImage} 
            alt={dest.name} 
            className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${heroImgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setHeroImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute top-4 left-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors z-20"
          >
            <ArrowLeft size={24} />
          </button>
          
          <button 
             className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition-colors z-20 opacity-0 group-hover:opacity-100"
          >
            <Maximize2 size={20} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
             <h1 className="text-4xl font-display font-bold text-white mb-2 drop-shadow-lg">{dest.name}</h1>
             <div className="flex items-center text-white/90 text-sm">
                <MapPin size={16} className="mr-1 text-[#D4AF37]" />
                <span className="capitalize">{dest.type} Destination</span>
             </div>
          </div>
       </div>

       <div className="p-6 -mt-6 bg-white rounded-t-3xl relative z-10 shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] min-h-[400px]">
          
          {/* Toggle Controls */}
          <div className="flex bg-stone-100 p-1 rounded-xl mb-6 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setViewMode('content')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                viewMode === 'content' 
                ? 'bg-white text-[#0B1E3B] shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <AlignLeft size={16} /> Overview
            </button>
            {trekkingInfo && (
              <button 
                onClick={() => setViewMode('trekking')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  viewMode === 'trekking' 
                  ? 'bg-white text-[#0B1E3B] shadow-sm' 
                  : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Mountain size={16} /> Trails & Treks
              </button>
            )}
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                viewMode === 'map' 
                ? 'bg-white text-[#0B1E3B] shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Map size={16} /> Map View
            </button>
          </div>

          {viewMode === 'content' && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              {/* Highlights Chips */}
              <div className="flex flex-wrap gap-2">
                {dest.highlights.map((h, i) => (
                  <span key={i} className="px-3 py-1 bg-[#D4AF37]/10 text-[#B8860B] rounded-full text-xs font-bold border border-[#D4AF37]/20">
                    {h}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-display font-bold text-[#0B1E3B] mb-2">Overview</h2>
                <div className="relative">
                  <p className={`text-stone-600 leading-relaxed text-sm md:text-base transition-all duration-300 ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                    {dest.fullDescription}
                  </p>
                  <button 
                    onClick={toggleDescription} 
                    className="mt-2 text-[#8B4513] text-sm font-bold flex items-center gap-1 hover:underline transition-all"
                  >
                    {isDescExpanded ? (
                      <>Show Less <ChevronUp size={16} /></>
                    ) : (
                      <>Read More <ChevronDown size={16} /></>
                    )}
                  </button>
                </div>
              </div>

              {/* Photo Gallery Carousel */}
              {dest.gallery && dest.gallery.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={20} className="text-[#D4AF37]" />
                    <h2 className="text-xl font-display font-bold text-[#0B1E3B]">Gallery</h2>
                  </div>
                  
                  <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory no-scrollbar -mx-6 px-6">
                    {/* Include the main image as the first item in the carousel to allow returning to it */}
                    {[dest.image, ...dest.gallery].map((imgUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentHeroImage(imgUrl)}
                        className={`relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden snap-center border-2 transition-all duration-200 bg-stone-100 ${
                          currentHeroImage === imgUrl ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${dest.name} ${index}`} 
                          className="w-full h-full object-cover opacity-0 transition-opacity duration-300" 
                          onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-start gap-3 hover:bg-stone-50 transition-colors">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1E3B] text-sm">Best Time to Visit</h4>
                      <p className="text-xs text-stone-500 mt-1">{dest.bestTime}</p>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-start gap-3 hover:bg-stone-50 transition-colors">
                    <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                      <Star size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1E3B] text-sm">Top Local Experience</h4>
                      <p className="text-xs text-stone-500 mt-1">Try a traditional cooking class in a Riad.</p>
                    </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <MessageSquare size={20} className="text-[#8B4513]" />
                     <h2 className="text-xl font-display font-bold text-[#0B1E3B]">Traveler Insights</h2>
                   </div>
                   <button 
                     onClick={() => setIsWritingReview(!isWritingReview)}
                     className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                   >
                     {isWritingReview ? <X size={14} /> : <Plus size={14} />} 
                     {isWritingReview ? 'Cancel' : 'Share Experience'}
                   </button>
                </div>

                {isWritingReview && (
                   <form onSubmit={handleSubmitReview} className="bg-stone-50 p-4 rounded-xl shadow-inner border border-stone-200 mb-6 animate-in slide-in-from-top-2">
                      <h3 className="text-sm font-bold text-[#0B1E3B] mb-3">Write your advice</h3>
                      <div className="mb-3">
                         <label className="block text-xs font-bold text-stone-500 mb-1">Rating</label>
                         <StarRating rating={newRating} onRate={setNewRating} />
                      </div>
                      <div className="mb-3">
                         <label className="block text-xs font-bold text-stone-500 mb-1">Your Tips</label>
                         <textarea 
                           className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm focus:border-[#0B1E3B] outline-none transition-colors"
                           rows={3}
                           placeholder="What should other travelers know? (e.g. best photo spots, hidden gems...)"
                           value={newReviewText}
                           onChange={(e) => setNewReviewText(e.target.value)}
                         />
                      </div>
                      <button 
                        type="submit" 
                        disabled={!newReviewText.trim()}
                        className="w-full bg-[#0B1E3B] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#1a3a6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                         <Send size={16} /> Post Advice
                      </button>
                   </form>
                )}

                <div className="space-y-4">
                   {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="bg-stone-50 p-4 rounded-xl border border-stone-100 shadow-sm">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
                                    {review.avatar ? (
                                       <img src={review.avatar} alt={review.userName} className="w-full h-full object-cover" />
                                    ) : (
                                       <User size={16} className="text-stone-400" />
                                    )}
                                 </div>
                                 <div>
                                    <span className="block text-xs font-bold text-stone-800">{review.userName}</span>
                                    <span className="block text-[10px] text-stone-400">{review.date}</span>
                                 </div>
                              </div>
                              <StarRating rating={review.rating} />
                           </div>
                           <p className="text-sm text-stone-600 leading-relaxed">
                              {review.text}
                           </p>
                        </div>
                      ))
                   ) : (
                      <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                         <p className="text-stone-400 text-sm">No reviews yet. Be the first to share your experience!</p>
                      </div>
                   )}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'trekking' && trekkingInfo && (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
              
              {/* Intro Box */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-4">
                 <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                    <Mountain size={20} className="text-green-700" />
                 </div>
                 <div>
                    <h3 className="font-bold text-[#0B1E3B] text-sm">Trekking Overview</h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                       Explore the natural beauty of {dest.name}. Always check weather conditions and carry sufficient water.
                    </p>
                 </div>
              </div>

              {/* Trail Map Visualization (Stylized) */}
              <div className="relative h-60 bg-[#EFEBE4] rounded-xl overflow-hidden border border-stone-200 shadow-inner group">
                 <div className="absolute top-2 left-3 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <Compass size={12} /> Trail Map
                 </div>
                 <svg viewBox="0 0 100 50" className="w-full h-full absolute inset-0 text-stone-300" preserveAspectRatio="none">
                    <path d="M0,50 L20,30 L40,40 L60,10 L80,35 L100,20 V50 H0 Z" fill="currentColor" opacity="0.3" />
                    <path d="M10,50 Q30,20 50,30 T90,10" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1,0.5" className="animate-pulse" />
                    <circle cx="10" cy="50" r="1" fill="#0B1E3B" />
                    <circle cx="90" cy="10" r="1" fill="#D4AF37" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-stone-500 text-xs font-bold bg-white/50 px-3 py-1 rounded-full">Interactive Map Loading...</p>
                 </div>
              </div>

              {/* Routes List */}
              <div>
                 <h3 className="font-display font-bold text-[#0B1E3B] mb-3 flex items-center gap-2">
                   <Footprints size={18} /> Popular Routes
                 </h3>
                 <div className="space-y-3">
                    {trekkingInfo.routes.map((route, idx) => (
                       <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:border-[#D4AF37] transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-[#0B1E3B] text-sm">{route.name}</h4>
                             <DifficultyBadge level={route.difficulty} />
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-stone-500 font-bold mb-2 uppercase tracking-wide">
                             <span>{route.duration}</span>
                             <span>•</span>
                             <span>{route.elevation} elev.</span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">{route.desc}</p>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Safety & Gear */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
                       <AlertTriangle size={14} /> Safety Tips
                    </h4>
                    <ul className="space-y-2">
                       {trekkingInfo.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                             <span className="mt-1 w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                             {tip}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                       <CheckCircle2 size={14} /> Essential Gear
                    </h4>
                    <ul className="space-y-2">
                       {trekkingInfo.gear.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                             <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>

              {/* CTA Guide */}
              <button 
                onClick={() => navigate('/hosts?filter=trekking')}
                className="w-full py-3 bg-[#0B1E3B] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#1a3a6b] transition-all flex items-center justify-center gap-2"
              >
                 <User size={16} /> Find a Local Trekking Guide
              </button>

            </div>
          )}

          {viewMode === 'map' && (
            <div className="animate-in slide-in-from-right-4 duration-300 h-96 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-inner relative">
               <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={mapSrc}
                  className="w-full h-full"
                  title="Destination Map"
               ></iframe>
               <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs text-stone-600 border border-stone-200 shadow-sm text-center">
                 Showing {dest.name} and surrounding area
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default DestinationDetail;
