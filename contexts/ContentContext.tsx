import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Destination, LocalHost, Phrase, Review, Trip, SafetyTip, Trivia, CulturalNorm } from '../types';
import { DESTINATIONS, LOCAL_HOSTS, PHRASES, SAFETY_TIPS, TRIVIA, CULTURAL_NORMS } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface AppSettings {
  maintenanceMode: boolean;
}

interface ContentContextType {
  destinations: Destination[];
  hosts: LocalHost[];
  phrases: Phrase[];
  safetyTips: SafetyTip[];
  culturalNorms: CulturalNorm[];
  trivia: Trivia[];
  trips: Trip[];
  isLoading: boolean;
  appSettings: AppSettings;
  toggleMaintenanceMode: () => void;
  addDestination: (dest: Destination) => Promise<void>;
  updateDestination: (dest: Destination) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  addHost: (host: LocalHost) => Promise<void>;
  updateHost: (host: LocalHost) => Promise<void>;
  deleteHost: (id: string) => Promise<void>;
  addPhrase: (phrase: Phrase) => Promise<void>;
  updatePhrase: (phrase: Phrase) => Promise<void>;
  deletePhrase: (id: string) => Promise<void>;
  addSafetyTip: (tip: SafetyTip) => Promise<void>;
  updateSafetyTip: (tip: SafetyTip) => Promise<void>;
  deleteSafetyTip: (id: string) => Promise<void>;
  addCulturalNorm: (norm: CulturalNorm) => Promise<void>;
  updateCulturalNorm: (norm: CulturalNorm) => Promise<void>;
  deleteCulturalNorm: (id: string) => Promise<void>;
  addTrivia: (item: Trivia) => Promise<void>;
  updateTrivia: (item: Trivia) => Promise<void>;
  deleteTrivia: (id: string) => Promise<void>;
  addReview: (destinationId: string, review: Review) => Promise<void>;
  deleteReview: (destinationId: string, reviewId: string) => Promise<void>;
  saveTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  resetContent: () => void;
  refreshData: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hosts, setHosts] = useState<LocalHost[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([]);
  const [culturalNorms, setCulturalNorms] = useState<CulturalNorm[]>([]);
  const [trivia, setTrivia] = useState<Trivia[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettings>({ maintenanceMode: false });

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Fetch Destinations
      const { data: destData, error: destError } = await supabase
        .from('destinations')
        .select('*')
        .order('name');

      if (destError || !destData || destData.length === 0) {
         if (destinations.length === 0) setDestinations(DESTINATIONS);
      } else {
         setDestinations(destData as Destination[]);
      }

      // Fetch Hosts
      const { data: hostData, error: hostError } = await supabase
        .from('hosts')
        .select('*');

      if (hostError || !hostData || hostData.length === 0) {
         if (hosts.length === 0) setHosts(LOCAL_HOSTS);
      } else {
         setHosts(hostData as LocalHost[]);
      }

      // Fetch Phrases
      const { data: phraseData, error: phraseError } = await supabase
        .from('phrases')
        .select('*');

      if (phraseError || !phraseData || phraseData.length === 0) {
         if (phrases.length === 0) setPhrases(PHRASES);
      } else {
         setPhrases(phraseData as Phrase[]);
      }

      // Fetch Safety Tips
      const { data: safetyData, error: safetyError } = await supabase
        .from('safety_tips')
        .select('*');
      
      if (safetyError || !safetyData || safetyData.length === 0) {
         if (safetyTips.length === 0) setSafetyTips(SAFETY_TIPS);
      } else {
         setSafetyTips(safetyData as SafetyTip[]);
      }

      // Fetch Cultural Norms
      const { data: normsData, error: normsError } = await supabase
        .from('cultural_norms')
        .select('*');
      
      if (normsError || !normsData || normsData.length === 0) {
         if (culturalNorms.length === 0) setCulturalNorms(CULTURAL_NORMS);
      } else {
         setCulturalNorms(normsData as CulturalNorm[]);
      }

      // Fetch Trivia
      const { data: triviaData, error: triviaError } = await supabase
        .from('trivia')
        .select('*');
      
      if (triviaError || !triviaData || triviaData.length === 0) {
         if (trivia.length === 0) setTrivia(TRIVIA);
      } else {
         setTrivia(triviaData as Trivia[]);
      }

    } catch (err) {
      console.error('Unexpected error fetching data:', err);
      // Fallback to local constants on error
      if (destinations.length === 0) setDestinations(DESTINATIONS);
      if (hosts.length === 0) setHosts(LOCAL_HOSTS);
      if (phrases.length === 0) setPhrases(PHRASES);
      if (safetyTips.length === 0) setSafetyTips(SAFETY_TIPS);
      if (culturalNorms.length === 0) setCulturalNorms(CULTURAL_NORMS);
      if (trivia.length === 0) setTrivia(TRIVIA);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Trips and Settings from LocalStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('user_trips');
    if (savedTrips) {
      try { setTrips(JSON.parse(savedTrips)); } catch (e) { console.error("Failed to parse trips", e); }
    }
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      try { setAppSettings(JSON.parse(savedSettings)); } catch (e) { console.error("Failed to parse settings", e); }
    }
    refreshData();
  }, []);

  // Save trips to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(appSettings));
  }, [appSettings]);

  const toggleMaintenanceMode = () => {
    setAppSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
  };

  // --- Destination CRUD ---
  const addDestination = async (dest: Destination) => {
    setDestinations(prev => [...prev, dest]);
    try { await supabase.from('destinations').insert([dest]); } catch (err) { console.error(err); }
  };

  const updateDestination = async (dest: Destination) => {
    setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
    try { await supabase.from('destinations').update(dest).eq('id', dest.id); } catch (err) { console.error(err); }
  };

  const deleteDestination = async (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
    try { await supabase.from('destinations').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  // --- Host CRUD ---
  const addHost = async (host: LocalHost) => {
    setHosts(prev => [...prev, host]);
    try { await supabase.from('hosts').insert([host]); } catch (err) { console.error(err); }
  };

  const updateHost = async (host: LocalHost) => {
    setHosts(prev => prev.map(h => h.id === host.id ? host : h));
    try { await supabase.from('hosts').update(host).eq('id', host.id); } catch (err) { console.error(err); }
  };

  const deleteHost = async (id: string) => {
    setHosts(prev => prev.filter(h => h.id !== id));
    try { await supabase.from('hosts').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  // --- Phrase CRUD ---
  const addPhrase = async (phrase: Phrase) => {
    setPhrases(prev => [...prev, phrase]);
    try { await supabase.from('phrases').insert([phrase]); } catch (err) { console.error(err); }
  };

  const updatePhrase = async (phrase: Phrase) => {
    setPhrases(prev => prev.map(p => p.id === phrase.id ? phrase : p));
    try { await supabase.from('phrases').update(phrase).eq('id', phrase.id); } catch (err) { console.error(err); }
  };

  const deletePhrase = async (id: string) => {
    setPhrases(prev => prev.filter(p => p.id !== id));
    try { await supabase.from('phrases').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  // --- Safety Tip CRUD ---
  const addSafetyTip = async (tip: SafetyTip) => {
    setSafetyTips(prev => [...prev, tip]);
    try { await supabase.from('safety_tips').insert([tip]); } catch (err) { console.error(err); }
  };

  const updateSafetyTip = async (tip: SafetyTip) => {
    setSafetyTips(prev => prev.map(t => t.id === tip.id ? tip : t));
    try { await supabase.from('safety_tips').update(tip).eq('id', tip.id); } catch (err) { console.error(err); }
  };

  const deleteSafetyTip = async (id: string) => {
    setSafetyTips(prev => prev.filter(t => t.id !== id));
    try { await supabase.from('safety_tips').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  // --- Cultural Norm CRUD ---
  const addCulturalNorm = async (norm: CulturalNorm) => {
    setCulturalNorms(prev => [...prev, norm]);
    try { await supabase.from('cultural_norms').insert([norm]); } catch (err) { console.error(err); }
  };

  const updateCulturalNorm = async (norm: CulturalNorm) => {
    setCulturalNorms(prev => prev.map(n => n.id === norm.id ? norm : n));
    try { await supabase.from('cultural_norms').update(norm).eq('id', norm.id); } catch (err) { console.error(err); }
  };

  const deleteCulturalNorm = async (id: string) => {
    setCulturalNorms(prev => prev.filter(n => n.id !== id));
    try { await supabase.from('cultural_norms').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  // --- Trivia CRUD ---
  const addTrivia = async (item: Trivia) => {
    setTrivia(prev => [...prev, item]);
    try { await supabase.from('trivia').insert([item]); } catch (err) { console.error(err); }
  };

  const updateTrivia = async (item: Trivia) => {
    setTrivia(prev => prev.map(t => t.id === item.id ? item : t));
    try { await supabase.from('trivia').update(item).eq('id', item.id); } catch (err) { console.error(err); }
  };

  const deleteTrivia = async (id: string) => {
    setTrivia(prev => prev.filter(t => t.id !== id));
    try { await supabase.from('trivia').delete().eq('id', id); } catch (err) { console.error(err); }
  };

  const addReview = async (destinationId: string, review: Review) => {
    const dest = destinations.find(d => d.id === destinationId);
    if (!dest) return;
    const updatedReviews = [review, ...(dest.reviews || [])];
    const updatedDest = { ...dest, reviews: updatedReviews };
    setDestinations(prev => prev.map(d => d.id === destinationId ? updatedDest : d));
    try {
      const { error } = await supabase.from('destinations').update({ reviews: updatedReviews }).eq('id', destinationId);
      if (error) throw error;
    } catch (err) { console.error('Error adding review:', err); }
  };

  const deleteReview = async (destinationId: string, reviewId: string) => {
    const dest = destinations.find(d => d.id === destinationId);
    if (!dest || !dest.reviews) return;
    
    const updatedReviews = dest.reviews.filter(r => r.id !== reviewId);
    const updatedDest = { ...dest, reviews: updatedReviews };
    
    setDestinations(prev => prev.map(d => d.id === destinationId ? updatedDest : d));
    
    try {
      await supabase.from('destinations').update({ reviews: updatedReviews }).eq('id', destinationId);
    } catch (err) { console.error('Error deleting review:', err); }
  };

  const saveTrip = (trip: Trip) => {
    setTrips(prev => {
      const exists = prev.find(t => t.id === trip.id);
      if (exists) {
        return prev.map(t => t.id === trip.id ? trip : t);
      }
      return [trip, ...prev];
    });
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const resetContent = () => {
    if (window.confirm("This will revert your LOCAL view to the original default content. Database is not affected.")) {
      setDestinations(DESTINATIONS);
      setHosts(LOCAL_HOSTS);
      setPhrases(PHRASES);
      setSafetyTips(SAFETY_TIPS);
      setCulturalNorms(CULTURAL_NORMS);
      setTrivia(TRIVIA);
    }
  };

  return (
    <ContentContext.Provider value={{
      destinations,
      hosts,
      phrases,
      safetyTips,
      culturalNorms,
      trivia,
      trips,
      isLoading,
      appSettings,
      toggleMaintenanceMode,
      addDestination,
      updateDestination,
      deleteDestination,
      addHost,
      updateHost,
      deleteHost,
      addPhrase,
      updatePhrase,
      deletePhrase,
      addSafetyTip,
      updateSafetyTip,
      deleteSafetyTip,
      addCulturalNorm,
      updateCulturalNorm,
      deleteCulturalNorm,
      addTrivia,
      updateTrivia,
      deleteTrivia,
      addReview,
      deleteReview,
      saveTrip,
      deleteTrip,
      resetContent,
      refreshData
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
