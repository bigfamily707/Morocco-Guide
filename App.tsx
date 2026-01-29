import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LocalHostsPage from './pages/LocalHostsPage';
import ChatPage from './pages/ChatPage';
import SafetyPage from './pages/SafetyPage';
import ProfilePage from './pages/ProfilePage';
import DestinationDetail from './pages/DestinationDetail';
import MoodPage from './pages/MoodPage';
import AdminPage from './pages/AdminPage';
import MedinaModePage from './pages/MedinaModePage';
import TripPlannerPage from './pages/TripPlannerPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ContentProvider } from './contexts/ContentContext';
import { trackEvent } from './services/analyticsService';
import { supabase } from './lib/supabaseClient';

const Layout = () => {
  const location = useLocation();

  // Track Page Views & Realtime Presence
  useEffect(() => {
    // 1. Analytics Tracking
    trackEvent('page_view', { path: location.pathname });

    // 2. Realtime Presence (Active Users)
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: localStorage.getItem('session_id') || Math.random().toString(36).substring(7),
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
          page: location.pathname,
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location]);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#FDFBF7]">
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  // Generate a persistent session ID for this load
  useEffect(() => {
    if (!localStorage.getItem('session_id')) {
      localStorage.setItem('session_id', Math.random().toString(36).substring(7));
    }
  }, []);

  return (
    <LanguageProvider>
      <ContentProvider>
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-0 sm:p-4 lg:p-8 font-sans">
          {/* Phone Frame Container */}
          <div className="w-full h-screen sm:h-[844px] sm:w-[390px] bg-black sm:rounded-[3rem] sm:border-[8px] sm:border-gray-800 shadow-2xl overflow-hidden relative">
             
             {/* Notch Simulation (Desktop only) */}
             <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-40 bg-black rounded-b-2xl z-50"></div>
             
             <HashRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/explore/:id" element={<DestinationDetail />} />
                  <Route path="/hosts" element={<LocalHostsPage />} />
                  <Route path="/mood/:moodId" element={<MoodPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/safety" element={<SafetyPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/medina-mode" element={<MedinaModePage />} />
                  <Route path="/planner" element={<TripPlannerPage />} />
                </Route>
              </Routes>
            </HashRouter>
          </div>
        </div>
      </ContentProvider>
    </LanguageProvider>
  );
};

export default App;