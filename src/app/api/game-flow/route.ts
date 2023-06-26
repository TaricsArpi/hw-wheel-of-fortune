import { db } from "@/lib/prisma";
import { getGameToken, getResponseWithCookie, spinWheel } from "@/lib/utils";
import { SESSION_COOKIE_NAME } from "@/types/Cookie";
import { SpinRequest } from "@/types/GameTypes";
import { NextRequest, NextResponse, userAgent } from "next/server";

export async function POST(request: NextRequest) {
	const { name, currentPosition, currentAmount } = (await request.json()) as SpinRequest;

	// Validation
	const currentToken = request.cookies.get(SESSION_COOKIE_NAME);

	const { ua } = userAgent(request);
	const ip = request.ip || request.headers.get("x-forwarded-for")?.split(",").shift() || "";

	const newToken = getGameToken({ ip, ua, name });

	if (!(currentToken && (currentToken.value === newToken.token))) {
		console.error("The tokens do not match!");
		return NextResponse.error();
	}

	// Calculate next state
	const spinResult = spinWheel(currentAmount, currentPosition);

	// Update avatar in the db
	await db.avatar.update({
		where: {
			sessionToken: newToken.token,
		},
		data: {
			amount: spinResult.newAmount,
			sessionToken: newToken.token,
			tokenExpiresAt: newToken.expiresAt,
		},
	});

	return getResponseWithCookie(NextResponse.json({ ...spinResult }), newToken);
}
