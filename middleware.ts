import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard routes, don't interfere with auth
  if (pathname.startsWith("/dashboard") || pathname === "/api/auth/status") {
    // Let the request through - auth checking happens client-side with implicit flow
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/status"],
};
