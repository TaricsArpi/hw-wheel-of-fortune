import AvatarPicker from "@/components/AvatarPicker";
import Link from "next/link";

const Home = () => {
	return (
		<div className="h-screen flex items-center justify-center flex-col">
			<AvatarPicker />

			<div>
				<p>- OR -</p>
				<p>Check the <Link href="/leaderboard">leaderboard</Link>!</p>
			</div>
		</div>
	);
};

export default Home;
