"use client";

import { FC, useState } from "react";

import { IAvatar } from "@/types/Avatar";
import { SectorAction, SpinRequest, SpinResult } from "@/types/GameTypes";
import Wheel from "@/components/Wheel";

interface GameProps {
	avatar: IAvatar;
}

const Game: FC<GameProps> = ({ avatar }) => {
	const [isLoading, setLoading] = useState(false);
	const [amount, setAmount] = useState(avatar.amount);
	const [position, setPosition] = useState(SectorAction.DOUBLE);
	const [offset, setOffset] = useState(0);

	const handleSpin = async () => {
		setLoading(true);

		try {
			const requestBody: SpinRequest = {
				name: avatar.name,
				currentAmount: amount,
				currentPosition: position,
			};
			const response = await fetch("/api/game-flow", {
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
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
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

				<Wheel onSpin={handleSpin} offset={offset} isSpinning={isLoading} />
			</div>
		</>
	);
};

export default Game;
