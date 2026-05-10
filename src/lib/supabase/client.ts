import { createClient as createClientBase } from "@supabase/supabase-js";

export function createClient() {
  return createClientBase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Use implicit flow which works better with SPAs
        flowType: "implicit",
      },
    }
  );
}
