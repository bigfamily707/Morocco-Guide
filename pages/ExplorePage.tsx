import React, { useState, useEffect } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { useContent } from '../contexts/ContentContext';
import { Destination } from '../types';
import { MapPin, Filter, Coins } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import CurrencyConverter from '../components/CurrencyConverter';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 flex flex-col md:flex-row h-auto animate-pulse">
    <div className="h-48 md:h-full md:w-1/3 bg-stone-200" />
    <div className="p-4 flex-1 space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-stone-200 rounded w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="h-3 bg-stone-200 rounded w-5/6" />
      </div>
      <div className="h-4 bg-stone-200 rounded w-24 mt-2" />
    </div>
  </div>
);

const DestinationCard: React.FC<{ dest: Destination }> = ({ dest }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div 
      onClick={() => navigate(`/explore/${dest.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 flex flex-col md:flex-row cursor-pointer transition-transform hover:scale-[1.01]"
    >
       <div className="h-48 md:h-full md:w-1/3 relative bg-stone-200">
          {!imgLoaded && <div className="absolute inset-0 bg-stone-200 animate-pulse z-10" />}
          <img 
            src={dest.image} 
            alt={dest.name} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide text-white z-20">
             {dest.type}
          </div>
       </div>
       <div className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-display font-bold text-[#0B1E3B]">{dest.name}</h3>
          </div>
          <p className="text-sm text-stone-600 line-clamp-2 mb-3">{dest.shortDescription}</p>
          <div className="flex items-center text-[#8B4513] text-xs font-bold">
             <MapPin size={14} className="mr-1" />
             <span>View Guide</span>
          </div>
       </div>
    </div>
  );
};

const ExplorePage: React.FC = () => {
  const location = useLocation();
  const { destinations } = useContent();
  const [filter, setFilter] = useState<'all' | 'city' | 'nature' | 'coastal'>('all');
  const [showConverter, setShowConverter] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effect to parse query params when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get('filter');
    
    if (filterParam && ['city', 'nature', 'coastal'].includes(filterParam)) {
      setFilter(filterParam as 'city' | 'nature' | 'coastal');
    } else {
      setFilter('all');
    }
    
    // Reset loading state on navigation to give feedback
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.search]);

  const filteredDestinations = filter === 'all' 
    ? destinations 
    : destinations.filter(d => d.type === filter);

  const FilterBadge = ({ type, label }: { type: typeof filter, label: string }) => (
    <button 
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
        filter === type 
        ? 'bg-[#0B1E3B] text-white shadow-md' 
        : 'bg-white text-stone-600 border border-stone-200 hover:border-[#0B1E3B]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <MosaicHeader title="Explore Morocco" subtitle="Cities, Mountains, and Deserts" />
      
      <div className="p-4 sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-sm z-20 pb-2 space-y-3 border-b border-stone-200/50">
         <div className="flex justify-between items-center gap-3">
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 flex-1">
                <FilterBadge type="all" label="All" />
                <FilterBadge type="city" label="Cities" />
                <FilterBadge type="nature" label="Nature" />
                <FilterBadge type="coastal" label="Coastal" />
             </div>
             
             <button 
               onClick={() => setShowConverter(!showConverter)}
               className={`ml-1 mb-2 p-2 rounded-full shadow-sm border transition-all flex-shrink-0 flex items-center gap-2 ${
                 showConverter 
                  ? 'bg-[#D4AF37] text-white border-[#D4AF37]' 
                  : 'bg-white border-stone-200 text-stone-500 hover:text-[#D4AF37] hover:border-[#D4AF37]'
               }`}
               aria-label="Toggle Currency Converter"
             >
               <Coins size={20} />
             </button>
         </div>

         {showConverter && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
               <CurrencyConverter onClose={() => setShowConverter(false)} />
            </div>
         )}
      </div>

      <div className="p-4 space-y-4 pt-4 pb-24">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} />
            ))
          ) : (
            <div className="text-center py-10 opacity-60 text-stone-500">
               <p>No destinations found for this category yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ExplorePage;