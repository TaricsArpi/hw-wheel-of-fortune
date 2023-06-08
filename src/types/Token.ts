export type SessionToken = {
    token: string;
    expiresAt: Date;
}

export type CreateToken = {
    ip: string;
    ua: string;
    name: string;
}