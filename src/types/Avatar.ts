export interface IAvatar {
    id: number;
    name: string;
    amount: number;
}

export interface AvatarTableRow extends IAvatar {
    rank: number;
}