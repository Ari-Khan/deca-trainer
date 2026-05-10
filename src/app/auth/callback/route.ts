import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const error_description = url.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    const message = error_description || error;
    console.error('OAuth error:', message);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(message)}`, request.url)
    );
  }

  // For implicit flow, session is in URL fragment
  // For auth code flow, code is in query params
  // Either way, we redirect to dashboard and let client-side handle it
  console.log('Auth callback received - redirecting to dashboard');
  
  const dashboardUrl = new URL("/dashboard", request.url);
  // Preserve any hash/fragment from the original URL
  if (url.hash) {
    dashboardUrl.hash = url.hash;
  }
  
  const response = NextResponse.redirect(dashboardUrl);
  return response;
}}
