import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./types/Cookie";

export async function middleware(request: NextRequest) {
	// Check if user has valid game session in progress
	const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

	// On "/game" if the user has a session token, then continue the game. Redirect otherwise
	if (request.nextUrl.pathname.startsWith("/game")) {
		return sessionCookie
			? NextResponse.next()
			: NextResponse.redirect(new URL("/", request.nextUrl.origin));
	}

	// When navigating to another page, clear session token if present
	if (sessionCookie) {
		try {
			await fetch(new URL("/api/avatar", request.nextUrl.origin), {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ sessionToken: sessionCookie.value }),
			});
		} catch (error) {
			console.error(error);
		} finally {
			const response = NextResponse.next();
			response.cookies.delete(SESSION_COOKIE_NAME);
			return response;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
