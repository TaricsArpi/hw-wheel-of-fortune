"use client";

import Link from "next/link";
import { FC, useState } from "react";

import { IAvatar } from "@/types/Avatar";
import { SectorAction, SpinRequest, SpinResult } from "@/types/GameTypes";

interface GameProps {
	avatar: IAvatar;
}

const Game: FC<GameProps> = ({ avatar }) => {
	const [amount, setAmount] = useState(avatar.amount);
	const [position, setPosition] = useState(SectorAction.DOUBLE);
	const [offset, setOffset] = useState(0);

	const handleClick = async () => {
		try {
			const requestBody: SpinRequest = {
				name: avatar.name,
				currentAmount: amount,
				currentPosition: position,
			};
			const response = await fetch("/api/game", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			const { newAmount, newOffset, newPosition } = (await response.json()) as SpinResult;

			// Update game state
			setAmount(newAmount);
			setOffset(newOffset);
			setPosition(newPosition);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className="mb-10 flex flex-col justify-center gap-2">
				<p>You entered the game with avatar: {avatar.name}</p>

				<p>Balance amount: {amount}</p>

				<p>Current wheel position:</p>
				<ul>
					<li>Position: {position}</li>
					<li>Offset: {offset}</li>
				</ul>

				<button onClick={handleClick}>SPIN</button>
			</div>
			<Link href="/">Back to the home page!</Link>
		</>
	);
};

export default Game;
