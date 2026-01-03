import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This middleware handles protected routes
  // The actual authentication is handled in API routes and client-side
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}




