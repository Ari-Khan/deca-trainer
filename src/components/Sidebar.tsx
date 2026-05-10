'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { createClient } from '@/lib/supabase/client';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const getUser = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Wait a bit for session to be established after redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setIsLoading(false);
          return;
        }
        
        if (user) {
          setUserEmail(user.email || null);
          const photoUrl = user.user_metadata?.picture;
          if (photoUrl) {
            setProfileImage(photoUrl);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error in getUser:', error);
        setIsLoading(false);
      }
    };

    getUser();
  }, [mounted]);

  if (!mounted) return null;

  const links = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Performance', href: '/dashboard/stats' },
    { name: 'Resources', href: '/dashboard/docs' },
  ];

  return (
    <aside className="w-64 border-r border-zinc-900 dark:border-zinc-100 flex flex-col justify-between p-10 bg-black dark:bg-white text-white dark:text-black transition-colors duration-300">
      <div>
        <div className="font-bold tracking-tighter text-lg mb-20">
          DECA<span className="font-light opacity-50">TRAINER</span>
        </div>
        
        <nav className="space-y-6">
          {links.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-black transition-all duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 text-sm font-medium"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              Dark Theme
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              Light Theme
            </>
          )}
        </button>

        {/* Account Display */}
        <div className="flex items-center gap-3 group cursor-pointer">
          {isLoading ? (
            <div className="w-6 h-6 rounded-full bg-zinc-700 dark:bg-zinc-300 animate-pulse" />
          ) : profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover shrink-0"
              crossOrigin="anonymous"
              onError={() => setProfileImage(null)}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-zinc-700 dark:bg-zinc-300 flex items-center justify-center text-xs font-medium shrink-0">
              {userEmail?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-300 dark:group-hover:text-zinc-600 transition-colors duration-300">
            Account
          </span>
        </div>
      </div>
    </aside>
  );
}