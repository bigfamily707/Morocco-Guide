import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOOD_DETAILS } from '../constants';
import { useContent } from '../contexts/ContentContext';
import MosaicHeader from '../components/MosaicHeader';
import { ArrowLeft, MapPin } from 'lucide-react';

const MoodPage: React.FC = () => {
  const { moodId } = useParams<{ moodId: string }>();
  const navigate = useNavigate();
  const { destinations } = useContent();
  const mood = moodId ? MOOD_DETAILS[moodId] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moodId]);

  if (!mood || !moodId) {
    return <div className="p-8 text-center text-stone-500">Mood not found</div>;
  }

  // Filter destinations based on the mood
  const filteredDestinations = destinations.filter((d) => {
    switch (moodId) {
      case 'adventure':
        return d.type === 'nature' || d.id === 'dakhla' || d.highlights.some(h => h.includes('Trekking') || h.includes('Kitesurfing'));
      case 'relaxation':
        return d.type === 'coastal' || d.id === 'chefchaouen' || d.id === 'merzouga';
      case 'food':
        return ['marrakech', 'fes', 'essaouira', 'meknes', 'tangier'].includes(d.id);
      case 'culture':
        return d.type === 'city' || d.highlights.some(h => h.includes('Mosque') || h.includes('Kasbah'));
      case 'shopping':
        return ['marrakech', 'fes', 'meknes', 'taroudant'].includes(d.id) || d.type === 'city';
      default:
        return false;
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24">
       {/* Hero Section */}
       <div className="relative h-64 bg-stone-900">
          <img 
            src={mood.image} 
            alt={mood.title} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button 
             onClick={() => navigate('/')}
             className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors z-20"
          >
             <ArrowLeft size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6">
             <h1 className="text-3xl font-display font-bold text-white mb-2 drop-shadow-lg">{mood.title}</h1>
          </div>
       </div>

       {/* Description Section */}
       <div className="p-6 bg-white border-b border-stone-100">
          <p className="text-[#0B1E3B] leading-relaxed text-lg italic">
            "{mood.description}"
          </p>
       </div>

       {/* Destinations List */}
       <div className="p-6">
          <h2 className="text-xl font-display font-bold text-[#0B1E3B] mb-4">Recommended Places</h2>
          <div className="space-y-4">
             {filteredDestinations.map((dest) => (
               <div 
                 key={dest.id}
                 onClick={() => navigate(`/explore/${dest.id}`)}
                 className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 flex flex-col sm:flex-row cursor-pointer group"
               >
                  <div className="h-40 sm:h-auto sm:w-32 relative flex-shrink-0 bg-stone-200">
                     <img 
                       src={dest.image} 
                       alt={dest.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                     <h3 className="text-lg font-bold text-stone-800 mb-1">{dest.name}</h3>
                     <p className="text-sm text-stone-500 line-clamp-2 mb-2">{dest.shortDescription}</p>
                     <div className="flex items-center text-[#8B4513] text-xs font-bold mt-auto">
                        <MapPin size={14} className="mr-1" />
                        <span>Explore</span>
                     </div>
                  </div>
               </div>
             ))}
             {filteredDestinations.length === 0 && (
                <div className="text-center py-8 text-stone-400">
                   No destinations found for this category yet.
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default MoodPage;