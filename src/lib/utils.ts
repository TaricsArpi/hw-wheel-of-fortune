import { SESSION_COOKIE_NAME } from "@/types/Cookie";
import { SectorAction, SpinResult } from "@/types/GameTypes";
import { CreateToken, SessionToken } from "@/types/Token";
import { Avatar } from "@prisma/client";
import { ClassValue, clsx } from "clsx";
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { db } from "@/lib/prisma";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getGameToken(tokenData: CreateToken): SessionToken {
	const { ip, ua, name } = tokenData;

	const salt = `${name}:${ip}:${ua}`;

	return {
		token: createHash("sha256").update(salt).digest("hex"),
		expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
	};
}

/**
 * Validate existing avatar and it's session token.
 * We can start a new game, if either:
 * - the avatar already exists but it's not currently in use (no session token available)
 * - the avatar already exists and has a session token, but the token already expired
 * @returns boolean | true if the avatar is available
 */
export function canUseAvatar(avatar: Avatar): boolean {
	return !!(
		!avatar.sessionToken ||
		(avatar.tokenExpiresAt && avatar.tokenExpiresAt < new Date())
	);
}

/**
 * Get the api response with set session token cookie.
 */
export function getResponseWithCookie(
	response: NextResponse,
	sessionToken: SessionToken
): NextResponse {
	response.cookies.set(SESSION_COOKIE_NAME, sessionToken.token, {
		expires: sessionToken.expiresAt,
	});
	return response;
}

/**
 * Clear session in DB
 */
export async function clearSession(sessionTokenValue: string) {
	const sessionExists = await db.avatar.findUnique({
		where: {
			sessionToken: sessionTokenValue,
		},
	});

	if (sessionExists) {
		await db.avatar.update({
			where: {
				sessionToken: sessionTokenValue,
			},
			data: {
				sessionToken: null,
				tokenExpiresAt: null,
			},
		});
	}
}

/**
 * Game: Spin the wheel
 */
export function spinWheel(currentAmount: number, currentPosition: SectorAction): SpinResult {
	const totalSectors = 12;
	const randomNum = Math.floor(Math.random() * totalSectors);

	const newPosition: SectorAction = (currentPosition + randomNum) % 3;
	const newOffset = randomNum * 30; // 360° / 12 sector;

	let newAmount = currentAmount;
	switch (newPosition) {
		case SectorAction.DOUBLE:
			newAmount = currentAmount *= 2;
			break;
		case SectorAction.HALVE:
			newAmount = currentAmount /= 2;
			break;
		case SectorAction.KEEP:
			// no change to the current amount
			break;
	}

	return {
		newAmount,
		newPosition,
		newOffset,
	};
}
