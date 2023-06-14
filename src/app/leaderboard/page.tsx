import LeaderBoardTable from "@/components/LeaderBoardTable";
import { db } from "@/lib/prisma";

const Leaderboard = async () => {
	const avatars = await db.avatar.findMany({
		select: {
			id: true,
			name: true,
			amount: true,
		},
		orderBy: {
			amount: "desc",
		},
	});

	return (
		<main className="h-screen flex items-center justify-center flex-col">
			<LeaderBoardTable
				data={avatars.map((avatar, index) => ({
					id: avatar.id,
					name: avatar.name,
					amount: Number(avatar.amount.toString()),
					rank: index + 1,
				}))}
			/>
		</main>
	);
};

export default Leaderboard;
