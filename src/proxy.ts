import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
    console.log("Proxy Middleware running. Path:", request.nextUrl.pathname);
    console.log("Session Cookie present:", !!sessionCookie);

	if (!sessionCookie) {
        console.log("No session cookie. Redirecting to /sign-in");
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
    
    console.log("Session cookie found. Allowing request.");
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
], 
};