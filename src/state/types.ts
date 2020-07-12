type DBEntry = {id: string};

export type APIError = {
    status: number;
    code: number;
    message: string;
};

export type DBUser = DBEntry & {
    created_at: Date;
    updated_at: Date;
    type: 'admin' | 'user';
    state: 'activated' | 'pending' | 'deactivated';
    email: string;
    username: string;
};
