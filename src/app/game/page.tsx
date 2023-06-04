"use client";

import { useSearchParams } from "next/navigation";

const Game = () => {
	const queryParams = useSearchParams();

	const sessionToken = queryParams.get("t") ?? 'NO TOKEN PROVIDED';

	return <div>Game started! Session Token: {sessionToken}</div>;
};

export default Game;
