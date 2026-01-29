import React from 'react';
import { Home, Compass, MessageCircle, User, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav_home'), icon: Home, path: '/' },
    { label: t('nav_explore'), icon: Compass, path: '/explore' },
    { label: t('nav_hosts'), icon: Users, path: '/hosts' },
    { label: t('nav_chat'), icon: MessageCircle, path: '/chat' },
    { label: t('nav_profile'), icon: User, path: '/profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50 pb-safe">
      <div className="flex justify-around items-center h-16 sm:h-[4.5rem] px-2 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center justify-center h-full gap-1 active:scale-95 transition-transform duration-100"
            >
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-[#0B1E3B]' : 'text-stone-400 hover:text-stone-600'
                }`}
              />
              <span className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-[#0B1E3B] font-bold' : 'text-stone-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;