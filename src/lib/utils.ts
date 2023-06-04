import { ClassValue, clsx } from "clsx";
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface TokenData {
	ip: string;
	ua: string;
	name: string;
}

export function getGameToken(tokenData: TokenData): string {
	const { ip, ua, name } = tokenData;

	const salt = `${name}:${ip}:${ua}`;

	return createHash("sha256").update(salt).digest("hex");
}
