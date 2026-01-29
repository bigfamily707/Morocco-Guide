import React, { useState } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { useContent } from '../contexts/ContentContext';
import { Destination, Trip } from '../types';
import { Calendar, MapPin, Plus, Check, ArrowRight, Save, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TripPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { destinations, saveTrip } = useContent();
  const [step, setStep] = useState(1);
  
  // Trip State
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(7);
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>([]);

  // Derived State
  const selectedDestinations = destinations.filter(d => selectedDestIds.includes(d.id));

  // STEP 1: Details
  const handleDetailsSubmit = () => {
    if (tripName && startDate && duration > 0) {
      setStep(2);
    }
  };

  // STEP 2: Destinations
  const toggleDestination = (id: string) => {
    if (selectedDestIds.includes(id)) {
      setSelectedDestIds(prev => prev.filter(d => d !== id));
    } else {
      setSelectedDestIds(prev => [...prev, id]);
    }
  };

  // STEP 3: Generation & Save
  const generateItinerary = (): Record<number, string> => {
    // Simple logic: distribute days evenly among selected cities
    const itinerary: Record<number, string> = {};
    if (selectedDestinations.length === 0) return itinerary;

    const daysPerCity = Math.max(1, Math.floor(duration / selectedDestinations.length));
    
    let currentDay = 1;
    selectedDestinations.forEach((dest, idx) => {
        // If it's the last destination, give it all remaining days
        const daysForThisDest = (idx === selectedDestinations.length - 1) 
          ? (duration - currentDay + 1) 
          : daysPerCity;

        for (let i = 0; i < daysForThisDest; i++) {
           if (currentDay > duration) break;
           
           if (i === 0) itinerary[currentDay] = `Travel to ${dest.name} & Explore Medina`;
           else if (i === 1) itinerary[currentDay] = `Full day in ${dest.name} - Visit ${dest.highlights[0]}`;
           else itinerary[currentDay] = `Relax in ${dest.name} or Day Trip`;
           
           currentDay++;
        }
    });

    return itinerary;
  };

  const handleSaveTrip = () => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName,
      startDate,
      duration,
      destinations: selectedDestIds,
      itinerary: generateItinerary(),
      createdAt: new Date().toISOString()
    };
    saveTrip(newTrip);
    navigate('/profile'); // Redirect to profile to see the saved trip
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24">
      <MosaicHeader title="Trip Planner" subtitle="Design Your Journey" />

      {/* Progress Bar */}
      <div className="flex px-8 py-4 justify-between items-center relative z-10 bg-[#FDFBF7]">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-[#0B1E3B] text-white' : 'bg-stone-200 text-stone-500'}`}>1</div>
         <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-[#0B1E3B]' : 'bg-stone-200'}`}></div>
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-[#0B1E3B] text-white' : 'bg-stone-200 text-stone-500'}`}>2</div>
         <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-[#0B1E3B]' : 'bg-stone-200'}`}></div>
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 3 ? 'bg-[#0B1E3B] text-white' : 'bg-stone-200 text-stone-500'}`}>3</div>
      </div>

      <div className="px-4 flex-1">
        
        {/* STEP 1: DETAILS */}
        {step === 1 && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-display font-bold text-[#0B1E3B] mb-4">Trip Details</h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Trip Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Summer in Sahara"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm font-bold text-[#0B1E3B] focus:border-[#D4AF37] outline-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Start Date</label>
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm font-bold text-[#0B1E3B] focus:border-[#D4AF37] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1 uppercase">Duration (Days)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="30"
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm font-bold text-[#0B1E3B] focus:border-[#D4AF37] outline-none"
                        />
                    </div>
                 </div>
              </div>

              <div className="mt-8">
                 <button 
                   onClick={handleDetailsSubmit}
                   disabled={!tripName || !startDate || duration < 1}
                   className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a3a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                 >
                    Next Step <ArrowRight size={18} />
                 </button>
              </div>
           </div>
        )}

        {/* STEP 2: SELECT DESTINATIONS */}
        {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold text-[#0B1E3B]">Choose Stops</h2>
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                     {selectedDestIds.length} Selected
                  </span>
               </div>
               
               <div className="grid grid-cols-1 gap-3 pb-20">
                  {destinations.map(dest => {
                     const isSelected = selectedDestIds.includes(dest.id);
                     return (
                        <div 
                          key={dest.id}
                          onClick={() => toggleDestination(dest.id)}
                          className={`flex p-3 rounded-xl border-2 transition-all cursor-pointer ${
                             isSelected 
                             ? 'border-[#0B1E3B] bg-white shadow-md' 
                             : 'border-transparent bg-white shadow-sm opacity-80'
                          }`}
                        >
                           <img src={dest.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-stone-200" />
                           <div className="ml-3 flex-1 flex flex-col justify-center">
                              <h3 className="font-bold text-[#0B1E3B]">{dest.name}</h3>
                              <p className="text-xs text-stone-500 capitalize">{dest.type}</p>
                           </div>
                           <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center self-center mr-2 transition-colors ${
                              isSelected ? 'bg-[#0B1E3B] border-[#0B1E3B]' : 'border-stone-300'
                           }`}>
                              {isSelected && <Check size={14} className="text-white" />}
                           </div>
                        </div>
                     )
                  })}
               </div>

               <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 z-50 flex gap-3 pb-safe">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-stone-300 text-stone-600 font-bold"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={selectedDestIds.length === 0}
                    className="flex-1 bg-[#0B1E3B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a3a6b] disabled:opacity-50"
                  >
                     Build Itinerary <ArrowRight size={18} />
                  </button>
               </div>
            </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
           <div className="pb-24 animate-in slide-in-from-right-4 duration-300">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-6">
                  <h2 className="text-2xl font-display font-bold text-[#0B1E3B] mb-1">{tripName}</h2>
                  <div className="flex items-center gap-4 text-xs text-stone-500 font-bold uppercase tracking-wide">
                     <span className="flex items-center gap-1"><Calendar size={14} /> {duration} Days</span>
                     <span className="flex items-center gap-1"><MapPin size={14} /> {selectedDestIds.length} Stops</span>
                  </div>
               </div>

               <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">Draft Itinerary</h3>
               
               <div className="space-y-4">
                  {Object.entries(generateItinerary()).map(([day, activity]) => (
                     <div key={day} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex flex-col items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                           <span className="text-[8px] font-bold uppercase">Day</span>
                           <span className="text-lg font-bold leading-none">{day}</span>
                        </div>
                        <div className="flex-1 flex items-center">
                           <p className="text-sm font-medium text-[#0B1E3B]">{activity}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-200 z-50 flex gap-3 pb-safe">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-4 py-3 rounded-xl border border-stone-300 text-stone-600 font-bold"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={handleSaveTrip}
                    className="flex-1 bg-[#D4AF37] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b89628] shadow-lg shadow-orange-100"
                  >
                     <Save size={18} /> Save Trip
                  </button>
               </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default TripPlannerPage;