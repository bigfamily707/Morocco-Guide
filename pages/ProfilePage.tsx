import React, { useState, useRef, useEffect } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { UserPersona, OfflineRegion } from '../types';
import { User, Check, Globe, Download, Trash2, HardDrive, WifiOff, Loader2, ChevronRight, X, Camera, Lock, Calendar, Map, Plus, Bell, Navigation, ToggleRight, ToggleLeft } from 'lucide-react';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { uploadImage } from '../lib/supabaseClient';

const ProfilePage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { trips, deleteTrip } = useContent();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Permissions State
  const [permissions, setPermissions] = useState({
    notifications: Notification.permission === 'granted',
    location: false
  });
  
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(UserPersona.CULTURAL);
  const [regions, setRegions] = useState<OfflineRegion[]>([
    { id: '1', name: 'Marrakech & Central', description: 'Maps, Souk guides, Audio', sizeMB: 45, status: 'downloaded', progress: 100 },
    { id: '2', name: 'Fes & The North', description: 'Medina map, History tours', sizeMB: 38, status: 'idle', progress: 0 },
    { id: '3', name: 'Atlas & Sahara', description: 'Trekking trails, Star maps', sizeMB: 62, status: 'idle', progress: 0 },
    { id: '4', name: 'Coastal Cities', description: 'Essaouira & Agadir guides', sizeMB: 25, status: 'idle', progress: 0 },
  ]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) setProfileImage(savedAvatar);
    
    // Check initial location state
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setPermissions(prev => ({ ...prev, location: result.state === 'granted' }));
      });
    }
  }, []);

  const personas = Object.values(UserPersona);

  // Calculate total used storage
  const usedStorage = regions
    .filter(r => r.status === 'downloaded')
    .reduce((acc, curr) => acc + curr.sizeMB, 0);

  const simulateDownload = (id: string) => {
    setRegions(prev => prev.map(r => r.id === id ? { ...r, status: 'downloading', progress: 5 } : r));

    // Simulation intervals
    let progress = 5;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setRegions(prev => prev.map(r => r.id === id ? { ...r, status: 'downloaded', progress: 100 } : r));
      } else {
        setRegions(prev => prev.map(r => r.id === id ? { ...r, progress } : r));
      }
    }, 400);
  };

  const deleteBundle = (id: string) => {
    setRegions(prev => prev.map(r => r.id === id ? { ...r, status: 'idle', progress: 0 } : r));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Upload to Supabase 'MG photos' bucket (handles local fallback)
      const publicUrl = await uploadImage(file, 'profiles');
      
      if (publicUrl) {
        setProfileImage(publicUrl);
        localStorage.setItem('user_avatar', publicUrl);
      }
      setIsUploading(false);
    }
  };

  const requestNotificationAccess = async () => {
    if (!('Notification' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setPermissions(prev => ({ ...prev, notifications: permission === 'granted' }));
    } catch (e) {
      console.error(e);
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => setPermissions(prev => ({ ...prev, location: true })),
      (err) => console.log(err),
      { timeout: 5000 }
    );
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-6">
      <MosaicHeader title={t('profile_title')} subtitle={t('profile_subtitle')} />
      
      <div className="p-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center border border-stone-100">
           <div 
             className="relative w-24 h-24 mx-auto mb-3 cursor-pointer group"
             onClick={() => !isUploading && fileInputRef.current?.click()}
           >
              <div className="w-full h-full bg-stone-100 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center text-stone-400 relative">
                 {isUploading ? (
                    <Loader2 size={32} className="animate-spin text-[#0B1E3B]" />
                 ) : profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <User size={32} />
                 )}
                 {!isUploading && (
                   <div className="absolute inset-0 bg-black/10 hidden group-hover:flex items-center justify-center transition-all">
                      <Camera size={24} className="text-white drop-shadow-md" />
                   </div>
                 )}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#0B1E3B] text-white p-1.5 rounded-full shadow-md border-2 border-white">
                 <Camera size={14} />
              </div>
              {/* Native File Input supports Camera/Gallery selection on mobile */}
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleImageUpload}
                 disabled={isUploading}
              />
           </div>
           <h2 className="text-xl font-display font-bold text-[#0B1E3B]">{t('profile_traveler')}</h2>
           <p className="text-stone-500 text-sm">{t('profile_customize')}</p>
        </div>

        <div className="space-y-6">
           {/* Device Permissions */}
           <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">Device Access</h3>
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                 <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-stone-100 rounded-lg text-stone-500"><Bell size={18} /></div>
                       <span className="text-sm font-bold text-[#0B1E3B]">Notifications</span>
                    </div>
                    <button 
                      onClick={requestNotificationAccess}
                      className={`text-2xl transition-colors ${permissions.notifications ? 'text-[#10B981]' : 'text-stone-300'}`}
                    >
                       {permissions.notifications ? <ToggleRight size={28} className="fill-current" /> : <ToggleLeft size={28} />}
                    </button>
                 </div>
                 <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-stone-100 rounded-lg text-stone-500"><Navigation size={18} /></div>
                       <span className="text-sm font-bold text-[#0B1E3B]">Location Services</span>
                    </div>
                    <button 
                      onClick={requestLocationAccess}
                      className={`text-2xl transition-colors ${permissions.location ? 'text-[#10B981]' : 'text-stone-300'}`}
                    >
                       {permissions.location ? <ToggleRight size={28} className="fill-current" /> : <ToggleLeft size={28} />}
                    </button>
                 </div>
              </div>
           </div>

           {/* My Trips Section */}
           <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                 <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">My Saved Trips</h3>
                 <button 
                   onClick={() => navigate('/planner')}
                   className="text-xs font-bold text-[#0B1E3B] flex items-center gap-1 hover:underline"
                 >
                    <Plus size={14} /> Create New
                 </button>
              </div>

              {trips.length > 0 ? (
                <div className="space-y-3">
                   {trips.map(trip => (
                      <div key={trip.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm relative group">
                         <button 
                           onClick={() => deleteTrip(trip.id)}
                           className="absolute top-2 right-2 p-2 text-stone-300 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                         <h4 className="font-display font-bold text-[#0B1E3B] text-lg mb-1">{trip.name}</h4>
                         <div className="flex items-center gap-4 text-xs text-stone-500">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {trip.duration} days</span>
                            <span className="flex items-center gap-1"><Map size={12} /> {trip.destinations.length} stops</span>
                         </div>
                         <div className="mt-3 pt-3 border-t border-stone-100">
                             <span className="text-[10px] font-bold bg-[#D4AF37]/10 text-[#B8860B] px-2 py-1 rounded">
                                Starts: {trip.startDate}
                             </span>
                         </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div 
                   onClick={() => navigate('/planner')}
                   className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all group"
                >
                   <Map size={32} className="mx-auto text-stone-300 group-hover:text-[#D4AF37] mb-2" />
                   <p className="text-sm font-bold text-stone-500 group-hover:text-[#D4AF37]">Plan your first adventure</p>
                </div>
              )}
           </div>

           {/* Persona Selector */}
           <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">{t('profile_style')}</h3>
              <div className="grid grid-cols-2 gap-3">
                 {personas.map(persona => (
                   <button
                     key={persona}
                     onClick={() => setSelectedPersona(persona)}
                     className={`p-3 rounded-xl border text-sm font-bold flex justify-between items-center transition-all ${
                       selectedPersona === persona 
                       ? 'bg-[#0B1E3B] text-white border-[#0B1E3B] shadow-sm' 
                       : 'bg-white border-stone-200 text-stone-600 hover:border-[#D4AF37]'
                     }`}
                   >
                     {t(`persona_${persona}`)}
                     {selectedPersona === persona && <Check size={16} className="text-white" />}
                   </button>
                 ))}
              </div>
              <p className="text-xs text-stone-400 mt-2 px-1">
                 {t('profile_style_desc')}
              </p>
           </div>

           {/* Offline Bundles Section */}
           <div>
              <div className="flex justify-between items-end mb-3 ml-1 mr-1">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">{t('profile_offline')}</h3>
                <span className="text-xs font-bold text-[#0B1E3B] bg-stone-200 px-2 py-1 rounded-md">
                   {usedStorage} MB {t('profile_used')}
                </span>
              </div>
              
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-sm">
                 {regions.map((region) => (
                   <div key={region.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${region.status === 'downloaded' ? 'bg-[#0B1E3B] text-white' : 'bg-stone-100 text-stone-400'}`}>
                            {region.status === 'downloaded' ? <WifiOff size={20} /> : <Globe size={20} />}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-[#0B1E3B]">{region.name}</h4>
                            <p className="text-xs text-stone-500">{region.description} • {region.sizeMB} MB</p>
                            {region.status === 'downloading' && (
                               <div className="w-24 h-1 bg-stone-100 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${region.progress}%` }} />
                               </div>
                            )}
                         </div>
                      </div>

                      <div>
                         {region.status === 'idle' && (
                            <button 
                              onClick={() => simulateDownload(region.id)}
                              className="p-2 bg-stone-100 text-stone-400 rounded-full hover:bg-stone-200 transition-colors"
                              title={t('download')}
                            >
                               <Download size={18} />
                            </button>
                         )}
                         {region.status === 'downloading' && (
                            <div className="p-2">
                               <Loader2 size={18} className="animate-spin text-[#D4AF37]" />
                            </div>
                         )}
                         {region.status === 'downloaded' && (
                            <button 
                              onClick={() => deleteBundle(region.id)}
                              className="p-2 bg-white text-red-400 rounded-full hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors group"
                              title="Delete"
                            >
                               <Trash2 size={18} className="group-hover:text-red-600" />
                            </button>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* General Settings */}
           <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">{t('profile_general')}</h3>
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 relative">
                 
                 {/* Language Switcher */}
                 <div className="relative">
                    <button 
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                           <Globe size={18} className="text-stone-400" />
                           <span className="text-sm font-medium text-stone-700">{t('profile_lang')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-400">{currentLangLabel}</span>
                          <ChevronRight size={16} className={`text-stone-300 transition-transform ${showLangMenu ? 'rotate-90' : ''}`} />
                        </div>
                    </button>
                    
                    {/* Language Menu Dropdown */}
                    {showLangMenu && (
                       <div className="bg-stone-50 border-t border-stone-200 animate-in slide-in-from-top-2 duration-200">
                          {LANGUAGES.map((lang) => (
                             <button
                                key={lang.code}
                                onClick={() => {
                                  setLanguage(lang.code);
                                  setShowLangMenu(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-100 transition-colors ${
                                  language === lang.code ? 'bg-[#0B1E3B]/5 text-[#0B1E3B]' : 'text-stone-600'
                                }`}
                             >
                                <span className="flex items-center gap-3 ml-8 text-sm font-medium">
                                   <span className="text-lg">{lang.flag}</span> {lang.label}
                                </span>
                                {language === lang.code && <Check size={16} className="text-[#0B1E3B]" />}
                             </button>
                          ))}
                       </div>
                    )}
                 </div>

                 <button className="w-full flex items-center justify-between p-4 hover:bg-stone-50">
                    <div className="flex items-center gap-3">
                       <HardDrive size={18} className="text-stone-400" />
                       <span className="text-sm font-medium text-stone-700">{t('profile_cache')}</span>
                    </div>
                    <span className="text-xs font-bold text-stone-400">84 MB</span>
                 </button>

                 <button 
                   onClick={() => navigate('/admin')}
                   className="w-full flex items-center justify-between p-4 hover:bg-stone-50"
                 >
                    <div className="flex items-center gap-3">
                       <Lock size={18} className="text-stone-400" />
                       <span className="text-sm font-medium text-stone-700">Admin Dashboard</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                 </button>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;