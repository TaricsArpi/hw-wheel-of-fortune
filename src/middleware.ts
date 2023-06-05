import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// Check if user has valid game session in progress
	const sessionCookie = request.cookies.get("wof_sesssion_token");

	// If there is a session going on, always continue the game
	if (sessionCookie) {
		const response = request.nextUrl.pathname.startsWith("/game")
			? NextResponse.next()
			: NextResponse.redirect(new URL("/game", request.nextUrl.origin));
		response.cookies.set("wof_sesssion_token", sessionCookie.value, {
			expires: Date.now() + 1000 * 60 * 5, // 5 minutes
		});
		return response;
	}
	// If no session available, redirect from "/game" to the home page
	else {
		if (request.nextUrl.pathname.startsWith("/game")) {
			return NextResponse.redirect(new URL("/", request.nextUrl.origin));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/leaderboard", "/game"],
};
