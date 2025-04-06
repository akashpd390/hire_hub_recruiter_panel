import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server';
export async function middleware(request) {

  // update user's auth session
  const { supabase, supabaseResponse } = await updateSession(request)
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();

  const isProtected = request.nextUrl.pathname.startsWith('/recuiter/dashboard')

  if (!user && !request.nextUrl.pathname.startsWith('/recuiter')) {
    return NextResponse.redirect(new URL("/recuiter", request.url));
  }

  if (!user && isProtected) {
   return  NextResponse.redirect(new URL("/recuiter", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/recuiter/dashboard/:path*',
  ],
}