import { NextRequest, NextResponse, userAgent } from "next/server";

import { db } from "@/lib/prisma";
import { getGameToken } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const token = request.nextUrl.searchParams.get("token") || "";

	if (!token) {
		throw new Error("Invalid avatar request!");
	}

	const avatar = await db.avatar.findUnique({
		where: {
			sessionToken: token,
		},
	});

	if (!avatar) {
		return new Error("Invalid avatar token!");
	}

	return NextResponse.json({ ...avatar });
}

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
			name: name,
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

		const response = NextResponse.json({ token });
		response.cookies.set("wof_sesssion_token", token, {
			expires: 1000 * 60 * 5, // 5 minutes
		});
		return response;
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

		const response = NextResponse.json({ token });
		response.cookies.set("wof_sesssion_token", token, {
			expires: Date.now() + 1000 * 60 * 5, // 5 minutes
		});
		return response;
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
