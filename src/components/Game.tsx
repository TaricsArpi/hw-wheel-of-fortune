"use client";

import Link from "next/link";
import { FC } from "react";

interface IAvatar {
	id: number;
	name: string;
	amount: number;
}

interface GameProps {
	avatar: IAvatar;
}

const Game: FC<GameProps> = ({ avatar }) => {
	return (
		<>
			<p>You entered the game with avatar: {avatar.name}</p>
			<p>Balance amount: {avatar.amount}</p>
			<Link href="/">Back to the home page!</Link>
		</>
	);
};

export default Game;
