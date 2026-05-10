import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${error}`, request.url)
    );
  }

  if (code) {
    try {
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
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Handle cookie errors gracefully
              }
            },
          },
        }
      );

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        return NextResponse.redirect(
          new URL(`/?error=${exchangeError.message}`, request.url)
        );
      }
    } catch (err) {
      return NextResponse.redirect(
        new URL(`/?error=auth_failed`, request.url)
      );
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
