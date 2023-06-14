/* eslint-disable react/no-unescaped-entities */
import AvatarPicker from "@/components/AvatarPicker";
import Link from "next/link";

const Home = () => {
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<div className="max-w-lg flex flex-col items-center justify-center">
				<ul className="list-disc">
					<li>Choose a character name to begin playing the Wheel-of-Fortune game.</li>
					<li>
						If your chosen name has been used before, you'll continue with the amount
						left from the previous game.
					</li>
					<li>
						If it's a new name, you'll start with the default amount of 10000 credits.
					</li>
					<li>
						Spin the wheel and trust your luck: it can either double your amount, halve
						your credits, or keep them as they are.
					</li>
					<li>Keep an eye on the leaderboard to see who the luckiest avatars are!</li>
				</ul>

				<AvatarPicker />

				<div>
					<p className="text-center">- OR -</p>
					<p>
						Check the <Link href="/leaderboard">leaderboard</Link>!
					</p>
				</div>
			</div>
		</div>
	);
};

export default Home;
