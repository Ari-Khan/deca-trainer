'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';

interface ClientAuthGuardProps {
  children: ReactNode;
}

export default function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Give localStorage a moment to be populated from URL fragment
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push('/');
          return;
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Auth guard error:', err);
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black dark:bg-white flex items-center justify-center">
        <p className="text-zinc-400 dark:text-zinc-600">Loading...</p>
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
