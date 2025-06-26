import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Rafraîchit la session si elle existe
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return res
}

// Spécifie sur quels chemins le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
  ],
} 