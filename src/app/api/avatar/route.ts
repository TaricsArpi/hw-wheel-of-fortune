import { NextRequest, NextResponse, userAgent } from "next/server";

import { db } from "@/lib/prisma";
import { canUseAvatar, getGameToken, getResponseWithCookie } from "@/lib/utils";

export async function POST(request: NextRequest) {
	const { name: rawName } = await request.json();
	const name = rawName.toUpperCase() as string;
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
		const newAvatar = await db.avatar.create({
			data: {
				name: name,
				amount: 10000.0,
				sessionToken: sessionToken.token,
			},
		});

		return getResponseWithCookie(NextResponse.json({ error: "" }), sessionToken);
	}
	// Check selected avatars availability
	else if (canUseAvatar(avatar)) {
		const updatedAvatar = await db.avatar.update({
			where: {
				id: avatar.id,
			},
			data: {
				sessionToken: sessionToken.token,
			},
		});

		return getResponseWithCookie(NextResponse.json({ error: "" }), sessionToken);
	}

	// The avatar exists but it's already in use. Choose a different one!
	return NextResponse.json({ error: "The avatar is already in use. Choose a different one!" });
}

export async function PATCH(request: NextRequest) {
	const { id } = await request.json();

	// Remove session token
	await db.avatar.update({
		where: {
			id: id,
		},
		data: {
			sessionToken: null,
		},
	});

	return NextResponse.json({ sessionCanceled: true });
}
