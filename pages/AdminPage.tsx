import React, { useState, useEffect } from 'react';
import MosaicHeader from '../components/MosaicHeader';
import { useContent } from '../contexts/ContentContext';
import { Destination, LocalHost, Phrase, SafetyTip, Trivia, CulturalNorm } from '../types';
import { DESTINATIONS, LOCAL_HOSTS, PHRASES, SAFETY_TIPS, TRIVIA, CULTURAL_NORMS } from '../constants';
import { supabase, uploadImage } from '../lib/supabaseClient';
import { getAnalyticsSummary } from '../services/analyticsService';
import { 
  Plus, Edit2, Trash2, Save, X, RotateCcw, Database, Loader2, 
  BarChart2, Users, Eye, Activity, MapPin, Layers, Lock, LogOut, Key,
  ShieldAlert, Sparkles, Settings, MessageSquare, Upload, Smartphone, Monitor, Heart, Mountain
} from 'lucide-react';

type Tab = 'dashboard' | 'content' | 'settings';
type ContentType = 'destinations' | 'hosts' | 'phrases' | 'safety' | 'norms' | 'trivia' | 'reviews';

const AdminPage: React.FC = () => {
  const { 
    destinations, hosts, phrases, safetyTips, trivia, culturalNorms, appSettings,
    addDestination, updateDestination, deleteDestination, 
    addHost, updateHost, deleteHost, 
    addPhrase, updatePhrase, deletePhrase,
    addSafetyTip, updateSafetyTip, deleteSafetyTip,
    addCulturalNorm, updateCulturalNorm, deleteCulturalNorm,
    addTrivia, updateTrivia, deleteTrivia,
    deleteReview,
    toggleMaintenanceMode,
    resetContent, refreshData 
  } = useContent();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activeContent, setActiveContent] = useState<ContentType>('destinations');
  
  // Content Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Destination> | Partial<LocalHost> | Partial<Phrase> | Partial<SafetyTip> | Partial<CulturalNorm> | Partial<Trivia> | null>(null);
  
  // JSON Editor state for Trekking Data
  const [trekkingJson, setTrekkingJson] = useState('');

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState({
    destinations: { count: 0, loading: true },
    hosts: { count: 0, loading: true },
    phrases: { count: 0, loading: true }
  });

  // Check Auth on Mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDbStats();
      fetchAnalytics();

      // Realtime Presence Subscription
      const channel = supabase.channel('online-users')
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const users: any[] = [];
          
          for (const key in state) {
             // @ts-ignore
             users.push(...state[key]);
          }
          setActiveUsers(users);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin96') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const fetchAnalytics = async () => {
    const data = await getAnalyticsSummary();
    setAnalytics(data);
  };

  const fetchDbStats = async () => {
    try {
      const { count: destCount } = await supabase.from('destinations').select('*', { count: 'exact', head: true });
      const { count: hostCount } = await supabase.from('hosts').select('*', { count: 'exact', head: true });
      const { count: phraseCount } = await supabase.from('phrases').select('*', { count: 'exact', head: true });
      
      setDbStatus({
        destinations: { count: destCount || 0, loading: false },
        hosts: { count: hostCount || 0, loading: false },
        phrases: { count: phraseCount || 0, loading: false }
      });
    } catch (e) {
      // console.error("Error fetching stats", e);
    }
  };

  // --- Handlers for Database Seeding ---
  const handleSeedDatabase = async () => {
    const confirmMsg = `Ready to upload:\n- ${DESTINATIONS.length} Cities\n- ${LOCAL_HOSTS.length} Hosts\n- ${PHRASES.length} Phrases\n- ${SAFETY_TIPS.length} Safety Tips\n- ${CULTURAL_NORMS.length} Norms\n- ${TRIVIA.length} Trivia\n\nThis will overwrite existing entries with the same ID.`;
    if (!window.confirm(confirmMsg)) return;
    
    setIsSeeding(true);
    try {
      // Attempt to upsert
      await supabase.from('destinations').upsert(DESTINATIONS, { onConflict: 'id' });
      await supabase.from('hosts').upsert(LOCAL_HOSTS, { onConflict: 'id' });
      await supabase.from('phrases').upsert(PHRASES, { onConflict: 'id' });
      await supabase.from('safety_tips').upsert(SAFETY_TIPS, { onConflict: 'id' });
      await supabase.from('cultural_norms').upsert(CULTURAL_NORMS, { onConflict: 'id' });
      await supabase.from('trivia').upsert(TRIVIA, { onConflict: 'id' });

      await fetchDbStats();
      await refreshData();
      
      alert("✅ Success! Database synced and App refreshed.");
    } catch (error: any) {
      // If RLS blocks the seed, we treat it as a "Local Mode" success because Context handles fallback
      if (error.message && error.message.includes('row-level security')) {
         alert("⚠️ Database is Read-Only (RLS Active). Content has been reset locally for this session.");
         await resetContent(); // Fallback to reset local state
      } else {
         console.error(error);
         alert(`Error during sync: ${error.message}`);
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const folder = activeContent === 'hosts' ? 'hosts' : 'destinations';
    const publicUrl = await uploadImage(file, folder);
    
    if (publicUrl) {
      setEditItem(prev => prev ? ({ ...prev, [fieldName]: publicUrl }) : null);
    }
    setIsUploading(false);
  };

  const handleEditClick = (item: any) => {
    setEditItem({ ...item });
    if (activeContent === 'destinations') {
       setTrekkingJson(item.trekking ? JSON.stringify(item.trekking, null, 2) : '');
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editItem) return;

    if (activeContent === 'destinations') {
      const dest = editItem as Destination;
      if (!dest.id) dest.id = Date.now().toString();
      if (!dest.coordinates) dest.coordinates = { lat: 0, lng: 0 };
      if (!dest.highlights) dest.highlights = [];
      if (!dest.gallery) dest.gallery = [];
      try {
         if (trekkingJson.trim()) {
            dest.trekking = JSON.parse(trekkingJson);
         } else {
            dest.trekking = undefined;
         }
      } catch (e) {
         alert("Invalid Trekking JSON format.");
         return;
      }
      const exists = destinations.find(d => d.id === dest.id);
      exists ? updateDestination(dest) : addDestination(dest);
    } else if (activeContent === 'hosts') {
      const host = editItem as LocalHost;
      if (!host.id) host.id = Date.now().toString();
      if (!host.languages) host.languages = [];
      const exists = hosts.find(h => h.id === host.id);
      exists ? updateHost(host) : addHost(host);
    } else if (activeContent === 'phrases') {
      const phrase = editItem as Phrase;
      if (!phrase.id) phrase.id = Date.now().toString();
      const exists = phrases.find(p => p.id === phrase.id);
      exists ? updatePhrase(phrase) : addPhrase(phrase);
    } else if (activeContent === 'safety') {
      const tip = editItem as SafetyTip;
      if (!tip.id) tip.id = Date.now().toString();
      const exists = safetyTips.find(t => t.id === tip.id);
      exists ? updateSafetyTip(tip) : addSafetyTip(tip);
    } else if (activeContent === 'norms') {
      const norm = editItem as CulturalNorm;
      if (!norm.id) norm.id = Date.now().toString();
      const exists = culturalNorms.find(n => n.id === norm.id);
      exists ? updateCulturalNorm(norm) : addCulturalNorm(norm);
    } else if (activeContent === 'trivia') {
      const item = editItem as Trivia;
      if (!item.id) item.id = Date.now().toString();
      const exists = trivia.find(t => t.id === item.id);
      exists ? updateTrivia(item) : addTrivia(item);
    }
    setIsEditing(false);
    setEditItem(null);
    setTrekkingJson('');
  };

  const startNew = () => {
    setTrekkingJson('');
    if (activeContent === 'destinations') {
      setEditItem({
        name: '', type: 'city', shortDescription: '', fullDescription: '',
        image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=800', // Verified Marrakech
        highlights: [], bestTime: '', coordinates: { lat: 31.7917, lng: -7.0926 }, gallery: []
      } as Partial<Destination>);
    } else if (activeContent === 'hosts') {
      setEditItem({
        name: '', location: '', address: '', experienceType: 'food', bio: '',
        price: '300 MAD', verified: false, rating: 5.0, reviewCount: 0,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        languages: ['English']
      } as Partial<LocalHost>);
    } else if (activeContent === 'phrases') {
      setEditItem({
        english: '', darija: '', pronunciation: '', category: 'greetings'
      } as Partial<Phrase>);
    } else if (activeContent === 'safety') {
      setEditItem({
        title: '', content: '', icon: 'alert'
      } as Partial<SafetyTip>);
    } else if (activeContent === 'norms') {
      setEditItem({
        title: '', content: '', icon: 'shirt'
      } as Partial<CulturalNorm>);
    } else if (activeContent === 'trivia') {
      setEditItem({
        q: '', a: ''
      } as Partial<Trivia>);
    }
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
        <MosaicHeader title="Admin Login" subtitle="Restricted Access" />
        <div className="flex-1 flex items-center justify-center p-6 -mt-20">
          <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-stone-200">
             <div className="w-16 h-16 bg-[#0B1E3B] rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
                <Lock size={32} />
             </div>
             <h2 className="text-2xl font-display font-bold text-[#0B1E3B] text-center mb-6">Security Check</h2>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Password</label>
                   <div className="relative">
                      <Key size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-[#0B1E3B] focus:border-[#D4AF37] outline-none"
                        placeholder="Enter admin key..."
                      />
                   </div>
                </div>
                {authError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{authError}</p>}
                
                <button 
                  type="submit" 
                  className="w-full bg-[#0B1E3B] text-white py-3 rounded-xl font-bold hover:bg-[#1a3a6b] transition-colors shadow-lg"
                >
                   Unlock Dashboard
                </button>
             </div>
          </form>
        </div>
      </div>
    );
  }

  // Helper to aggregate all reviews
  const allReviews = activeContent === 'reviews' 
    ? destinations.flatMap(d => (d.reviews || []).map(r => ({ ...r, destName: d.name, destId: d.id })))
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-24">
      <div className="relative">
         <MosaicHeader title="Command Center" subtitle="Full Access Mode" />
         <button 
           onClick={handleLogout}
           className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 border border-white/20 transition-all"
           title="Logout"
         >
            <LogOut size={20} />
         </button>
      </div>

      {/* Main Tab Switcher */}
      <div className="px-4 -mt-4 mb-4 relative z-10">
        <div className="bg-white p-1 rounded-xl shadow-md border border-stone-200 flex">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#0B1E3B] text-white shadow-sm' : 'text-stone-500 hover:bg-stone-50'}`}
           >
              <BarChart2 size={16} /> Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('content')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'content' ? 'bg-[#0B1E3B] text-white shadow-sm' : 'text-stone-500 hover:bg-stone-50'}`}
           >
              <Layers size={16} /> Content
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-[#0B1E3B] text-white shadow-sm' : 'text-stone-500 hover:bg-stone-50'}`}
           >
              <Settings size={16} /> Settings
           </button>
        </div>
      </div>

      <div className="px-4">
        
        {/* === ANALYTICS DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            
            {/* Real-time Presence Card */}
            <div className="bg-[#0B1E3B] p-4 rounded-xl shadow-md relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10">
                  <Activity size={80} className="text-white" />
               </div>
               <div className="relative z-10 flex items-center gap-3">
                  <div className="relative">
                    <span className="w-3 h-3 bg-green-500 rounded-full block animate-ping absolute top-0 right-0"></span>
                    <span className="w-3 h-3 bg-green-500 rounded-full block relative border-2 border-[#0B1E3B]"></span>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-display font-bold">Instant Active Users</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-white tracking-tight">{activeUsers.length}</span>
                      <span className="text-xs text-white/60">online now</span>
                    </div>
                  </div>
               </div>
               
               {/* Live User List */}
               {activeUsers.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-[10px] text-white/50 uppercase font-bold mb-2">Current Locations</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                       {activeUsers.map((user, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-white/80 bg-white/5 p-2 rounded-lg">
                             <div className="flex items-center gap-2">
                               {user.device === 'mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
                               <span className="truncate max-w-[150px]">{user.page}</span>
                             </div>
                             <span className="text-[9px] text-white/40">Active</span>
                          </div>
                       ))}
                    </div>
                  </div>
               )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-2 top-2 p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={16} /></div>
                  <div className="text-2xl font-display font-bold text-[#0B1E3B] mt-2">{analytics?.uniqueSessions || '-'}</div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wide mt-1">Unique Visitors</div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-2 top-2 p-1.5 bg-green-50 text-green-600 rounded-lg"><Eye size={16} /></div>
                  <div className="text-2xl font-display font-bold text-[#0B1E3B] mt-2">{analytics?.totalEvents || '-'}</div>
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wide mt-1">Total Actions</div>
               </div>
            </div>

            {/* Popular Destinations */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
               <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin size={14} /> Top Destinations
               </h3>
               <div className="space-y-3">
                  {analytics?.topDestinations?.map(([name, count]: any, idx: number) => (
                     <div key={idx} className="flex items-center gap-3">
                        <span className="w-4 text-xs font-bold text-stone-400">#{idx + 1}</span>
                        <div className="flex-1">
                           <div className="flex justify-between text-xs font-bold text-[#0B1E3B] mb-1">
                              <span className="capitalize">{name}</span>
                              <span>{count} views</span>
                           </div>
                           <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#D4AF37]" style={{ width: `${(count / (analytics.topDestinations[0][1] || 1)) * 100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* === CONTENT MANAGEMENT === */}
        {activeTab === 'content' && (
          <div className="animate-in fade-in duration-300">
             {/* Sub Tabs */}
             <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                <button onClick={() => setActiveContent('destinations')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'destinations' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Destinations</button>
                <button onClick={() => setActiveContent('hosts')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'hosts' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Hosts</button>
                <button onClick={() => setActiveContent('phrases')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'phrases' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Phrases</button>
                <button onClick={() => setActiveContent('safety')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'safety' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Safety</button>
                <button onClick={() => setActiveContent('norms')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'norms' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Norms</button>
                <button onClick={() => setActiveContent('trivia')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'trivia' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Trivia</button>
                <button onClick={() => setActiveContent('reviews')} className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${activeContent === 'reviews' ? 'bg-stone-800 text-white' : 'bg-white text-stone-500'}`}>Reviews</button>
             </div>

             {/* Editing Form Overlay */}
             {isEditing && editItem ? (
                <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-4 mb-6 animate-in zoom-in-95 duration-200">
                   <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                      <h3 className="font-display font-bold text-[#0B1E3B] text-lg">{editItem.id ? 'Edit Item' : 'New Item'}</h3>
                      <button onClick={() => { setIsEditing(false); setTrekkingJson(''); }} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
                   </div>
                   
                   <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                      {/* Destination Fields */}
                      {activeContent === 'destinations' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">Name</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Destination).name} onChange={e => setEditItem({...editItem, name: e.target.value})} /></div>
                           <div>
                              <label className="block text-xs font-bold text-stone-500 mb-1">Image</label>
                              <div className="flex gap-2">
                                 <input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Destination).image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="Image URL" />
                                 <label className="flex items-center justify-center p-2 bg-stone-200 rounded-lg cursor-pointer hover:bg-stone-300 transition-colors" title="Upload Image">
                                    {isUploading ? <Loader2 size={16} className="animate-spin text-stone-500" /> : <Upload size={16} className="text-stone-600" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={isUploading} />
                                 </label>
                              </div>
                           </div>
                           <div><label className="block text-xs font-bold text-stone-500">Short Desc</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Destination).shortDescription} onChange={e => setEditItem({...editItem, shortDescription: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Full Desc</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={3} value={(editItem as Destination).fullDescription} onChange={e => setEditItem({...editItem, fullDescription: e.target.value})} /></div>
                           
                           {/* Trekking JSON Editor */}
                           <div>
                              <label className="block text-xs font-bold text-stone-500 flex items-center gap-2">
                                 <Mountain size={14} /> Trekking Data (JSON)
                              </label>
                              <p className="text-[10px] text-stone-400 mb-1">Format: {`{ "routes": [], "tips": [], "gear": [] }`}</p>
                              <textarea 
                                className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-xs text-green-400 font-mono" 
                                rows={6} 
                                value={trekkingJson} 
                                onChange={e => setTrekkingJson(e.target.value)} 
                                placeholder="{}"
                              />
                           </div>
                        </>
                      )}

                      {/* Host Fields */}
                      {activeContent === 'hosts' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">Name</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as LocalHost).name} onChange={e => setEditItem({...editItem, name: e.target.value})} /></div>
                           <div>
                              <label className="block text-xs font-bold text-stone-500 mb-1">Photo</label>
                              <div className="flex gap-2">
                                 <input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as LocalHost).image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="Image URL" />
                                 <label className="flex items-center justify-center p-2 bg-stone-200 rounded-lg cursor-pointer hover:bg-stone-300 transition-colors" title="Upload Photo">
                                    {isUploading ? <Loader2 size={16} className="animate-spin text-stone-500" /> : <Upload size={16} className="text-stone-600" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} disabled={isUploading} />
                                 </label>
                              </div>
                           </div>
                           <div><label className="block text-xs font-bold text-stone-500">Location</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as LocalHost).location} onChange={e => setEditItem({...editItem, location: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Bio</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={2} value={(editItem as LocalHost).bio} onChange={e => setEditItem({...editItem, bio: e.target.value})} /></div>
                        </>
                      )}

                      {/* Phrase Fields */}
                      {activeContent === 'phrases' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">English</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Phrase).english} onChange={e => setEditItem({...editItem, english: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Darija</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Phrase).darija} onChange={e => setEditItem({...editItem, darija: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Pronunciation</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as Phrase).pronunciation} onChange={e => setEditItem({...editItem, pronunciation: e.target.value})} /></div>
                        </>
                      )}

                      {/* Safety Fields */}
                      {activeContent === 'safety' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">Title</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as SafetyTip).title} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Content</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={2} value={(editItem as SafetyTip).content} onChange={e => setEditItem({...editItem, content: e.target.value})} /></div>
                           <div>
                              <label className="block text-xs font-bold text-stone-500">Icon Type</label>
                              <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as SafetyTip).icon} onChange={e => setEditItem({...editItem, icon: e.target.value})}>
                                <option value="alert">Alert (Warning)</option>
                                <option value="taxi">Taxi</option>
                                <option value="map">Map</option>
                                <option value="water">Water</option>
                              </select>
                           </div>
                        </>
                      )}

                      {/* Cultural Norm Fields */}
                      {activeContent === 'norms' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">Title</label><input className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as CulturalNorm).title} onChange={e => setEditItem({...editItem, title: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Content</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={2} value={(editItem as CulturalNorm).content} onChange={e => setEditItem({...editItem, content: e.target.value})} /></div>
                           <div>
                              <label className="block text-xs font-bold text-stone-500">Icon Type</label>
                              <select className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" value={(editItem as CulturalNorm).icon} onChange={e => setEditItem({...editItem, icon: e.target.value})}>
                                <option value="shirt">Shirt (Dress)</option>
                                <option value="handshake">Handshake (Affection)</option>
                                <option value="hand">Hand (Right Hand)</option>
                                <option value="moon">Moon (Religion)</option>
                                <option value="camera">Camera (Photos)</option>
                              </select>
                           </div>
                        </>
                      )}

                      {/* Trivia Fields */}
                      {activeContent === 'trivia' && (
                        <>
                           <div><label className="block text-xs font-bold text-stone-500">Question</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={2} value={(editItem as Trivia).q} onChange={e => setEditItem({...editItem, q: e.target.value})} /></div>
                           <div><label className="block text-xs font-bold text-stone-500">Answer</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm text-[#0B1E3B]" rows={2} value={(editItem as Trivia).a} onChange={e => setEditItem({...editItem, a: e.target.value})} /></div>
                        </>
                      )}
                   </div>
                   <button onClick={handleSave} className="w-full mt-4 bg-[#0B1E3B] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a3a6b]"><Save size={18} /> Save Changes</button>
                </div>
             ) : (
                <div className="space-y-3">
                   {activeContent !== 'reviews' && (
                     <button onClick={startNew} className="w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 font-bold flex items-center justify-center gap-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"><Plus size={20} /> Add New Item</button>
                   )}
                   
                   {activeContent === 'destinations' && destinations.map(d => (
                      <div key={d.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <img src={d.image} className="w-10 h-10 rounded-md object-cover bg-stone-200" alt="" />
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{d.name}</h4><p className="text-[10px] text-stone-400 capitalize">{d.type}</p></div>
                         {d.trekking && <div className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded mr-2"><Mountain size={10} /></div>}
                         <button onClick={() => handleEditClick(d)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteDestination(d.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}

                   {activeContent === 'hosts' && hosts.map(h => (
                      <div key={h.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <img src={h.image} className="w-10 h-10 rounded-full object-cover bg-stone-200" alt="" />
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{h.name}</h4><p className="text-[10px] text-stone-400 capitalize">{h.experienceType}</p></div>
                         <button onClick={() => handleEditClick(h)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteHost(h.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}

                   {activeContent === 'phrases' && phrases.map(p => (
                      <div key={p.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">{p.english.charAt(0)}</div>
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{p.english}</h4><p className="text-[10px] text-stone-400">{p.darija}</p></div>
                         <button onClick={() => handleEditClick(p)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deletePhrase(p.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}

                   {activeContent === 'safety' && safetyTips.map(t => (
                      <div key={t.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><ShieldAlert size={16} /></div>
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{t.title}</h4><p className="text-[10px] text-stone-400 truncate">{t.content}</p></div>
                         <button onClick={() => handleEditClick(t)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteSafetyTip(t.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}

                   {activeContent === 'norms' && culturalNorms.map(n => (
                      <div key={n.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Heart size={16} /></div>
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{n.title}</h4><p className="text-[10px] text-stone-400 truncate">{n.content}</p></div>
                         <button onClick={() => handleEditClick(n)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteCulturalNorm(n.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}

                   {activeContent === 'trivia' && trivia.map(t => (
                      <div key={t.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><Sparkles size={16} /></div>
                         <div className="flex-1 min-w-0"><h4 className="font-bold text-[#0B1E3B] text-sm truncate">{t.q}</h4><p className="text-[10px] text-stone-400 truncate">{t.a}</p></div>
                         <button onClick={() => handleEditClick(t)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200"><Edit2 size={14} /></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteTrivia(t.id); }} className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100"><Trash2 size={14} /></button>
                      </div>
                   ))}
                   
                   {activeContent === 'reviews' && (
                     <div className="space-y-4">
                       <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">User Content Moderation</h3>
                       {allReviews.length > 0 ? (
                         allReviews.map(r => (
                           <div key={r.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex justify-between items-start">
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-[#0B1E3B] text-sm">{r.userName}</span>
                                 <span className="text-[10px] text-stone-400">on {r.destName}</span>
                                 <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 rounded font-bold">★ {r.rating}</span>
                               </div>
                               <p className="text-xs text-stone-600 leading-snug max-w-[200px] sm:max-w-md">{r.text}</p>
                               <span className="text-[10px] text-stone-300 mt-1 block">{r.date}</span>
                             </div>
                             <button onClick={() => { if(window.confirm('Delete this review?')) deleteReview(r.destId, r.id); }} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-full"><Trash2 size={14} /></button>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-8 text-stone-400 italic">No reviews found.</div>
                       )}
                     </div>
                   )}
                </div>
             )}

             {/* Database Tools Footer */}
             <div className="mt-8 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Database Tools</h4>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={handleSeedDatabase} disabled={isSeeding} className="py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      {isSeeding ? <Loader2 size={12} className="animate-spin" /> : <Database size={12} />} Seed / Sync DB
                   </button>
                   <button onClick={resetContent} className="py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      <RotateCcw size={12} /> Reset Local
                   </button>
                </div>
                <div className="mt-2 text-[10px] text-stone-400 text-center">
                   DB Status: Dest ({dbStatus.destinations.count}) • Hosts ({dbStatus.hosts.count}) • Phrases ({dbStatus.phrases.count})
                </div>
             </div>
          </div>
        )}

        {/* === APPLICATION SETTINGS === */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300">
             <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h3 className="font-display font-bold text-[#0B1E3B] text-lg mb-4">Global Configuration</h3>
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                      <div>
                         <h4 className="font-bold text-sm text-[#0B1E3B]">Maintenance Mode</h4>
                         <p className="text-xs text-stone-500">Disable app access for users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={appSettings.maintenanceMode} onChange={toggleMaintenanceMode} className="sr-only peer" />
                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B1E3B]"></div>
                      </label>
                   </div>
                   
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                      <strong>System Status:</strong> <span className="font-bold text-green-600">Operational</span><br/>
                      Database Connection: <span className="font-bold text-green-600">Active</span> (Supabase)<br/>
                      Analytics: <span className="font-bold text-green-600">Tracking</span>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;