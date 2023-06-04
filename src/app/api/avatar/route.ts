import { NextRequest, NextResponse, userAgent } from "next/server";

import { db } from "@/lib/prisma";
import { getGameToken } from "@/lib/utils";

export async function POST(request: NextRequest) {
	const { name: rawName } = await request.json();
    const name = rawName.toUpperCase() as string;
	const { ua } = userAgent(request);
	const ip = request.ip || request.headers.get("x-forwarded-for")?.split(",").shift() || "";

	// Get game token
	const token = getGameToken({ ip, ua, name });

	// Get avatar from DB
	const avatar = await db.avatar.findUnique({
		where: {
			name,
		},
	});

	if (!avatar) {
		// If no avatar exists with the give name, create a new one
		// and start a game session
		await db.avatar.create({
			data: {
				name: name,
				amount: 10000.0,
				sessionToken: token,
			},
		});
;
		return NextResponse.json({ token });
	} else if (!avatar.sessionToken) {
		// If the avatar already exists but it's not currently in use,
		// upate it's session token in the DB and start the game
		await db.avatar.update({
			where: {
				id: avatar.id,
			},
			data: {
				sessionToken: token,
			},
		});

		return NextResponse.json({ token });
	}

	// The avatar exists but it's already in use. Choose a different one!
	return NextResponse.json({ error: "The avatar is already in use. Choose a different one!" });
}
