/* eslint-disable camelcase */
type DBEntry = {id: number};

export type DBUser = DBEntry & {
    created_at: Date;
    updated_at: Date;
    type: 'admin' | 'user';
    activated: boolean;
    email: string;
    email_verified: boolean;
    username: string;
    password: string;
    transfer_limit_period: number;
    transfer_limit_start: Date;
    transfer_limit_end: Date;
    transfer_limit_bytes: number;
};

export type DBLoginAttemptWeb = DBEntry & {
    user_id: string;
    created_at: Date;
    state: 'pass' | 'fail';
    username: string;
    ip_addr: string;
};

export type DBLoginAttemptVPN = DBEntry & {
    user_id: string;
    created_at: Date;
    state: 'empty_cred' | 'bad_password' | 'eof' | 'no_user' | 'pass';
    username: string;
    ip_addr: string;
};

export type DBUserSession = DBEntry & {
    user_id: string;
    created_at: Date;
    ip_addr: string;
    token: string;
};

export type DBVPNSession = DBEntry & {
    user_id: string;
    created_at: Date;
    closed_at: Date;
    ip_addr: string;
    transferred: number;
};
