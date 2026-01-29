import React, { useState } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { useContent } from '../contexts/ContentContext';
import { Star, BadgeCheck, MapPin, Languages, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LocalHostsPage: React.FC = () => {
  const { t } = useLanguage();
  const { hosts } = useContent();
  const [filter, setFilter] = useState<'all' | 'food' | 'trekking' | 'history' | 'artisan'>('all');

  const filteredHosts = filter === 'all' 
    ? hosts 
    : hosts.filter(h => h.experienceType === filter);

  const FilterBadge = ({ type, label }: { type: typeof filter, label: string }) => (
    <button 
      onClick={() => setFilter(type)}
      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
        filter === type 
        ? 'bg-[#0B1E3B] text-white border-[#0B1E3B]' 
        : 'bg-white text-stone-600 border-stone-200 hover:border-[#0B1E3B]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <MosaicHeader title="Local Hosts" subtitle="Connect with Verified Guides" className="bg-[#FDFBF7] border-b border-stone-200" />
      
      {/* Filters */}
      <div className="p-4 sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-sm z-20 pb-2 border-b border-stone-100">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <FilterBadge type="all" label="All" />
            <FilterBadge type="food" label="Food & Cooking" />
            <FilterBadge type="trekking" label="Trekking" />
            <FilterBadge type="history" label="History" />
            <FilterBadge type="artisan" label="Artisans" />
         </div>
      </div>

      <div className="p-4 space-y-4 pt-2 pb-24">
        {filteredHosts.length > 0 ? (
          filteredHosts.map((host) => (
            <div key={host.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
               
               <div className="p-4 flex gap-4">
                  {/* Avatar & Verification */}
                  <div className="relative flex-shrink-0">
                     <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-100">
                        <img src={host.image} alt={host.name} className="w-full h-full object-cover" />
                     </div>
                     {host.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" title="Verified Host">
                           <BadgeCheck size={18} className="text-[#0B1E3B] fill-[#D4AF37]" />
                        </div>
                     )}
                  </div>
                  
                  {/* Header Info */}
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <h3 className="font-display font-bold text-lg text-[#0B1E3B] truncate">{host.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-100">
                           <Star size={12} className="fill-yellow-400 text-yellow-400" />
                           <span className="text-xs font-bold text-stone-700">{host.rating}</span>
                           <span className="text-[10px] text-stone-400">({host.reviewCount})</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                        <MapPin size={12} />
                        <span>{host.location}</span>
                        <span className="mx-1">•</span>
                        <span className="capitalize text-[#8B4513] font-bold">{host.experienceType}</span>
                     </div>
                     
                     {host.address && (
                        <div className="text-[10px] text-stone-400 mt-1 pl-4 truncate">{host.address}</div>
                     )}

                     <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-stone-500 bg-stone-100 px-2 py-1 rounded-md">
                           <Languages size={12} />
                           <span>{host.languages.join(', ')}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bio & Action */}
               <div className="px-4 pb-4">
                  <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-3">
                     "{host.bio}"
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-1">
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wide">Starting from</span>
                        <span className="text-sm font-bold text-[#0B1E3B]">{host.price}</span>
                     </div>
                     <button 
                       className="bg-[#0B1E3B] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#1a3a6b] transition-colors border border-transparent"
                       onClick={() => alert('Booking feature coming soon!')}
                     >
                        <MessageSquare size={14} />
                        Contact
                     </button>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-60 text-stone-400">
             <p>No hosts found for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalHostsPage;