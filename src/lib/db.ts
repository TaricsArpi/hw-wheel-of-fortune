import { db } from "@/lib/prisma";

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
