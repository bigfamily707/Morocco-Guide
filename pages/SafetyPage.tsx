import React, { useState } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { useContent } from '../contexts/ContentContext';
import { Phone, ShieldAlert, ChevronRight, AlertTriangle, Heart, Droplets, Banknote, Map, Ambulance, AlertCircle, Search, X, Building2, Car, Shirt, HeartHandshake, Hand, Moon, Camera } from 'lucide-react';

const EMBASSIES = [
  { country: 'United States', city: 'Casablanca', type: 'Consulate General', phone: '+212 5222-64560', address: '8 Blvd Moulay Youssef' },
  { country: 'United States', city: 'Rabat', type: 'Embassy', phone: '+212 5376-37200', address: 'Km 5.7, Avenue Mohamed VI' },
  { country: 'United Kingdom', city: 'Rabat', type: 'Embassy', phone: '+212 5376-33333', address: '28 Avenue S.A.R. Sidi Mohammed' },
  { country: 'France', city: 'Rabat', type: 'Embassy', phone: '+212 5376-89700', address: '1 Rue Ibn Hajar' },
  { country: 'France', city: 'Casablanca', type: 'Consulate General', phone: '+212 5224-89300', address: 'Rue du Prince Moulay Abdallah' },
  { country: 'Spain', city: 'Rabat', type: 'Embassy', phone: '+212 5376-33900', address: 'Rue Ain Khalouiya' },
  { country: 'Spain', city: 'Casablanca', type: 'Consulate General', phone: '+212 5222-20752', address: '31 Rue d\'Alger' },
  { country: 'Germany', city: 'Rabat', type: 'Embassy', phone: '+212 5372-18600', address: '7 Zankat Madnine' },
  { country: 'Canada', city: 'Rabat', type: 'Embassy', phone: '+212 5376-87400', address: '66 Avenue Mehdi Ben Barka' },
  { country: 'Italy', city: 'Casablanca', type: 'Consulate General', phone: '+212 5224-37070', address: '21 Avenue Hassan Souktani' },
  { country: 'Netherlands', city: 'Rabat', type: 'Embassy', phone: '+212 5372-19600', address: '40 Rue de Tunis' },
  { country: 'China', city: 'Rabat', type: 'Embassy', phone: '+212 5377-54056', address: '16 Avenue Ahmed Balafrej' },
  { country: 'Russia', city: 'Rabat', type: 'Embassy', phone: '+212 5377-53509', address: 'Km 4, Avenue Mohammed VI' },
  { country: 'Switzerland', city: 'Rabat', type: 'Embassy', phone: '+212 5377-06972', address: 'Square de Berkane' },
];

const SafetyPage: React.FC = () => {
  const { safetyTips, culturalNorms } = useContent();
  const [activeTab, setActiveTab] = useState<'norms' | 'safety' | 'health'>('norms');
  const [showEmbassyModal, setShowEmbassyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmbassies = EMBASSIES.filter(e => 
    e.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-colors border-b-2 ${
        activeTab === id 
        ? 'border-[#0B1E3B] text-[#0B1E3B] bg-stone-50' 
        : 'border-transparent text-stone-400 hover:text-stone-600 bg-white'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-[#0B1E3B]' : 'text-stone-300'} />
      {label}
    </button>
  );

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={20} />;
      case 'taxi': return <Car size={20} />;
      case 'map': return <Map size={20} />;
      case 'water': return <Droplets size={20} />;
      default: return <ShieldAlert size={20} />;
    }
  };

  const getNormIcon = (type: string) => {
     switch (type) {
        case 'shirt': return <Shirt size={20} />;
        case 'handshake': return <HeartHandshake size={20} />;
        case 'hand': return <Hand size={20} />;
        case 'moon': return <Moon size={20} />;
        case 'camera': return <Camera size={20} />;
        default: return <Heart size={20} />;
     }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24">
      <MosaicHeader title="Safety & Rules" subtitle="Essential Guide for Travelers" />
      
      {/* Quick Emergency Strip */}
      <div className="bg-red-50 border-b border-red-100 p-4">
        <h3 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-3 flex items-center gap-2">
            <AlertCircle size={14} /> Emergency Contacts
        </h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
           <a href="tel:19" className="flex-1 min-w-[100px] bg-white p-3 rounded-lg border border-red-100 shadow-sm flex flex-col items-center">
              <span className="text-2xl font-bold text-red-600">19</span>
              <span className="text-[9px] text-stone-500 uppercase font-bold mt-1">Police (City)</span>
           </a>
           <a href="tel:177" className="flex-1 min-w-[100px] bg-white p-3 rounded-lg border border-red-100 shadow-sm flex flex-col items-center">
              <span className="text-2xl font-bold text-red-600">177</span>
              <span className="text-[9px] text-stone-500 uppercase font-bold mt-1">Gendarmerie</span>
           </a>
           <a href="tel:15" className="flex-1 min-w-[100px] bg-white p-3 rounded-lg border border-red-100 shadow-sm flex flex-col items-center">
              <span className="text-2xl font-bold text-red-600">15</span>
              <span className="text-[9px] text-stone-500 uppercase font-bold mt-1">Ambulance</span>
           </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white sticky top-0 z-10">
        <TabButton id="norms" label="Roles & Rules" icon={Heart} />
        <TabButton id="safety" label="Scams & Tips" icon={ShieldAlert} />
        <TabButton id="health" label="Health & Log" icon={Droplets} />
      </div>

      <div className="p-4 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* CULTURAL NORMS (ROLES) */}
        {activeTab === 'norms' && (
           <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <p className="text-sm text-blue-800 leading-relaxed italic">
                    "Respect is the currency of Morocco. Understanding these cultural roles will open doors and hearts."
                 </p>
              </div>

              {culturalNorms.map((norm) => (
                 <div key={norm.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-4">
                    <div className="flex-shrink-0 mt-1 p-2 bg-stone-100 rounded-full h-fit text-[#0B1E3B]">
                       {getNormIcon(norm.icon)}
                    </div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm mb-1">{norm.title}</h4>
                       <p className="text-xs text-stone-600 leading-relaxed">{norm.content}</p>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* SAFETY & SCAMS */}
        {activeTab === 'safety' && (
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider ml-1">Common Scams & Advice</h3>
              {safetyTips.map((tip) => (
                <div key={tip.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex gap-4 group hover:border-orange-200 transition-colors">
                  <div className="flex-shrink-0 mt-1 text-orange-600 bg-orange-50 p-2 rounded-full h-fit">
                    {getTipIcon(tip.icon)}
                  </div>
                  <div>
                     <h4 className="font-bold text-[#0B1E3B] text-sm mb-1 group-hover:text-orange-700 transition-colors">{tip.title}</h4>
                     <p className="text-xs text-stone-600 leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              ))}
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-4">
                 <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Important Note
                 </h4>
                 <p className="text-xs text-stone-600 leading-relaxed">
                    Morocco is generally very safe. Violent crime is rare. Most issues are minor nuisances or overcharging. A firm "No, thank you" (La, Shukran) and walking away is your best defense.
                 </p>
              </div>
           </div>
        )}

        {/* HEALTH & LOGISTICS */}
        {activeTab === 'health' && (
           <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-start gap-4">
                    <div className="p-2 bg-cyan-50 text-cyan-600 rounded-full"><Droplets size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Tap Water</h4>
                       <p className="text-xs text-stone-600 mt-1">Do not drink tap water. Stick to sealed bottled water. Ice in high-end hotels is usually safe, but avoid it in street stalls.</p>
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-start gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-full"><Banknote size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Cash is King</h4>
                       <p className="text-xs text-stone-600 mt-1">Many riads, taxis, and souk shops do not take cards. Keep Dirhams (MAD) handy, especially coins for tips.</p>
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-start gap-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><Map size={20} /></div>
                    <div>
                       <h4 className="font-bold text-[#0B1E3B] text-sm">Offline Maps</h4>
                       <p className="text-xs text-stone-600 mt-1">Medina streets are confusing. Download Google Maps offline or use Maps.me. GPS can be spotty in narrow alleys.</p>
                    </div>
                 </div>
              </div>

              {/* Useful Links */}
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider ml-1 mt-6">External Resources</h3>
              <div className="space-y-2">
                 <button 
                    onClick={() => setShowEmbassyModal(true)}
                    className="w-full bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between hover:bg-stone-50"
                 >
                    <div className="flex items-center gap-3">
                       <Building2 size={20} className="text-[#0B1E3B]" />
                       <span className="text-sm font-bold text-stone-700">Embassy & Consulate Finder</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                 </button>
              </div>
           </div>
        )}

      </div>

      {/* Embassy Modal */}
      {showEmbassyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 backdrop-blur-sm">
           <div className="bg-[#FDFBF7] w-full h-[80vh] sm:h-[600px] sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-white rounded-t-2xl">
                 <h2 className="font-display font-bold text-lg text-[#0B1E3B]">Embassy Finder</h2>
                 <button onClick={() => setShowEmbassyModal(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500">
                    <X size={20} />
                 </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-white border-b border-stone-100">
                 <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Search country (e.g., USA, France)..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-[#0B1E3B] focus:border-[#D4AF37] outline-none transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                 </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
                 {filteredEmbassies.length > 0 ? (
                    filteredEmbassies.map((embassy, idx) => (
                       <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-[#0B1E3B]">{embassy.country}</h3>
                                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">{embassy.type} • {embassy.city}</span>
                             </div>
                             <a href={`tel:${embassy.phone}`} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
                                <Phone size={18} />
                             </a>
                          </div>
                          <p className="text-xs text-stone-600 mb-2 flex items-start gap-1.5">
                             <Map size={14} className="flex-shrink-0 mt-0.5 text-stone-400" />
                             {embassy.address}
                          </p>
                       </div>
                    ))
                 ) : (
                    <div className="text-center py-10 text-stone-400">
                       <p>No results found for "{searchQuery}"</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SafetyPage;
