"use client";

import Image from "next/image";
import wheel from "../../public/wheel.png";
import { useEffect, useRef, useState } from "react";

import { FC } from "react";
import { SectorAction } from "@/types/GameTypes";

interface WheelProps {
	onSpin: () => void;
	offset: number;
	isSpinning: boolean;
}

const Wheel: FC<WheelProps> = ({ onSpin, offset, isSpinning }) => {
	const wheel = useRef<HTMLDivElement>(null);

	const spin = () => {
		// if (!isLoading) {
		// 	setLoading(true);

		// 	setTimeout(() => {
		// 		setLoading(false);

		// 		if (wheel.current) {
		// 			wheel.current.style.transform = `rotate(${75}deg)`;

		// 			// setOffset((prev) => prev + Math.ceil(Math.random() * 3600));
		// 			setOffset(75);
		// 		}
		// 	}, 5000)
		// }

		onSpin();
	};

	return (
		<div className="wheel-container">
			<div className="spin-button" onClick={spin} aria-disabled>
				Spin
			</div>
			<div>
				<div ref={wheel} className={`wheel ${isSpinning ? "spinning" : ""}`}>
					<div
						className="wheel-section"
						style={{ "--i": 1, "--clr": "#8cc152" } as React.CSSProperties}
					>
						<span>+</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 2, "--clr": "#ed5565" } as React.CSSProperties}
					>
						<span>-</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 3, "--clr": "#ffce54" } as React.CSSProperties}
					>
						<span>=</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 4, "--clr": "#8cc152" } as React.CSSProperties}
					>
						<span>+</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 5, "--clr": "#ed5565" } as React.CSSProperties}
					>
						<span>-</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 6, "--clr": "#ffce54" } as React.CSSProperties}
					>
						<span>=</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 7, "--clr": "#8cc152" } as React.CSSProperties}
					>
						<span>+</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 8, "--clr": "#ed5565" } as React.CSSProperties}
					>
						<span>-</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 9, "--clr": "#ffce54" } as React.CSSProperties}
					>
						<span>=</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 10, "--clr": "#8cc152" } as React.CSSProperties}
					>
						<span>+</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 11, "--clr": "#ed5565" } as React.CSSProperties}
					>
						<span>-</span>
					</div>
					<div
						className="wheel-section"
						style={{ "--i": 12, "--clr": "#ffce54" } as React.CSSProperties}
					>
						<span>=</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Wheel;
