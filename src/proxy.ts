import { log } from 'console';
import { NextResponse, type NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const isPublicPath = ['/login', '/signup', '/verifyemail'].includes(pathname);
    log('Middleware triggered for path:', pathname);
    log('Is public path:', isPublicPath);
    const token = req.cookies.get('token')?.value || '';
    log('Token found:', !!token);
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    
}   
export const config = {
  matcher: ['/','/login', '/signup', '/verifyemail', '/profile'],
};