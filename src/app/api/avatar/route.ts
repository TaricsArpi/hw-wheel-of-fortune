import { NextRequest, NextResponse, userAgent } from "next/server";

import { db } from "@/lib/prisma";
import { canUseAvatar, clearSession, getGameToken, getResponseWithCookie } from "@/lib/utils";
import { SESSION_COOKIE_NAME } from "@/types/Cookie";

// Called when starting a new game
export async function POST(request: NextRequest) {
	// WORKAROUND: clear stuck session cookie
	const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
	if (sessionCookie && sessionCookie.value) {
		await clearSession(sessionCookie.value);
	}

	const { name }: { name: string } = await request.json();
	const { ua } = userAgent(request);
	const ip = request.ip || request.headers.get("x-forwarded-for")?.split(",").shift() || "";

	// Get game token
	const sessionToken = getGameToken({ ip, ua, name });

	// Get avatar from DB
	let avatar = await db.avatar.findUnique({
		where: {
			name: name,
		},
	});

	if (!avatar) {
		await db.avatar.create({
			data: {
				name: name,
				amount: 10000.0,
				sessionToken: sessionToken.token,
				tokenExpiresAt: sessionToken.expiresAt,
			},
		});

		return getResponseWithCookie(NextResponse.json({ error: "" }), sessionToken);
	}
	// Check selected avatars availability
	else if (canUseAvatar(avatar)) {
		await db.avatar.update({
			where: {
				id: avatar.id,
			},
			data: {
				sessionToken: sessionToken.token,
				tokenExpiresAt: sessionToken.expiresAt,
			},
		});

		return getResponseWithCookie(NextResponse.json({ error: "" }), sessionToken);
	}

	// The avatar exists but it's already in use. Choose a different one!
	return NextResponse.json({ error: "The avatar is already in use. Choose a different one!" });
}

// Delete session token data for an avatar
export async function PATCH(request: NextRequest) {
	const { sessionToken }: { sessionToken: string } = await request.json();

	if (sessionToken && sessionToken.length) {
		// Remove session token
		await clearSession(sessionToken);
	}

	return new Response("OK", { status: 200 });
}
