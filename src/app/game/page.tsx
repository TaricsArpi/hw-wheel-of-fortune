import { cookies } from "next/headers";
import Game from "@/components/Game";
import { db } from "@/lib/prisma";

const GamePage = async () => {
	// At this point we are sure the cookie exists since we redirect if it doesn't
	const sessionToken = cookies().get("wof_sesssion_token")?.value || "";

	const avatar = await db.avatar.findFirstOrThrow({
		where: {
			sessionToken: sessionToken,
		},
	});

	return (
		<main className="h-screen flex items-center justify-center flex-col">
			<Game
				avatar={{
					id: avatar.id,
					name: avatar.name,
					amount: Number(avatar.amount.toString()), // Pisma.Decimal can't be sent to Client Components
				}}
			/>
		</main>
	);
};

export default GamePage;
