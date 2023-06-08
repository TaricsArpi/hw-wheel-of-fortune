import { NextResponse, userAgent } from "next/server";
import { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./types/Cookie";

export function middleware(request: NextRequest) {
	// Check if user has valid game session in progress
	const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

	// Every URL except "/api/*"
	const regexPattern = /^(?!\/api\/).*/;

	/**
	 * Pages
	 */
	// Tryies to access any page with a sessionCookie set => continue game if possible
	if (regexPattern.test(request.nextUrl.pathname) && sessionCookie) {
		return request.nextUrl.pathname.startsWith("/game")
			? NextResponse.next()
			: NextResponse.redirect(new URL("/game", request.nextUrl.origin));
	}

	// Trying to access /game without session token
	if (request.nextUrl.pathname.startsWith("/game")) {
		return NextResponse.redirect(new URL("/", request.nextUrl.origin));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/leaderboard", "/game"],
};
