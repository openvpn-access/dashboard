export type APIError = {
    statusCode: number;
    message: string;
    error: string;
    id: number;
};

export type DBUser = {
    created_at: Date;
    updated_at: Date;
    type: 'admin' | 'user';
    state: 'activated' | 'pending' | 'deactivated';
    email: string;
    username: string;
};
