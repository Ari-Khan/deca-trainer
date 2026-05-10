import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ActionCard from '@/components/ActionCard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/");
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black dark:bg-white p-8 min-h-screen transition-colors duration-300">
      {/* Visual Header for the Menu */}
      <div className="mb-16 text-center space-y-2">
        <h2 className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.5em] transition-colors duration-300">Portal</h2>
        <div className="h-px w-12 bg-zinc-800 dark:bg-zinc-200 mx-auto transition-colors duration-300" />
      </div>

      {/* The Two Main Module Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <ActionCard 
          number="01" 
          title="Exams" 
          description="Access timed business administration core and specialty exams."
          href="/dashboard/exams"
        />
        <ActionCard 
          number="02" 
          title="Roleplays" 
          description="Interactive AI simulations for Series events and Team Decision Making."
          href="/dashboard/roleplays"
        />
      </div>
    </div>
  );
}