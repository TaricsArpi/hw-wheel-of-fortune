"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
	const [error, setError] = useState("");
	const [avatarName, setAvatarName] = useState("");

	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (validateForm()) {
			try {
				const response = await fetch("/api/avatar", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name: avatarName }),
				});
				const { error: errorMsg = "", token = "" }: { error: string; token: string } =
					await response.json();

				if (errorMsg) {
					setError(errorMsg);
					return;
				}

				// Start game session by navigating to /game?t=<token> url
				router.push('/game');
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setError("");
		setAvatarName(event.target.value.toUpperCase());
	};

	const validateForm = () => {
		if (!avatarName) {
			setError("Please enter an avatar name!");
			return false;
		}

		if (avatarName.length > 10 || avatarName.length < 4) {
			setError("Avatar name must be 4-10 characters long!");
			return false;
		}

		return true;
	};

	return (
		<main className="h-screen flex items-center justify-center flex-col">
			<form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
				<input type="text" name="avatar" value={avatarName} onChange={handleChange} />
				<button type="submit">Play</button>
			</form>

			{error && <p>{error}</p>}
		</main>
	);
};
