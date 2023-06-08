export enum SectorAction {
	DOUBLE = 0,
	HALVE = 1,
	KEEP = 2,
}

export interface SpinRequest {
	name: string;
	currentPosition: SectorAction;
	currentAmount: number;
}

export interface SpinResult {
	newAmount: number;
	newPosition: SectorAction;
	newOffset: number;
}
