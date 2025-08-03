import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {isAuthenticated} from "@/lib/session";
import {routes} from "@/constants/routes";

const authRoutes = [routes.DangNhapAdmin]

export async function middleware(request: NextRequest) {
    const isLoggedIn = await isAuthenticated();
    const pathname: string = request.nextUrl.pathname

    if (!isLoggedIn && pathname.startsWith('/admin') && !authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(routes.DangNhapAdmin, request.url));
    }
    if (isLoggedIn && pathname.includes('/login')) {
        return NextResponse.redirect(new URL(routes.Dashboard, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
