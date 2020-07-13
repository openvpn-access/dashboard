/**
 * TODO: Remove with first stable release
 * They may change. Keep them (manually) in sync with the backend version
 */
export enum ErrorCode {
    INVALID_TOKEN = 1,
    INVALID_PAYLOAD = 2,
    INVALID_PASSWORD = 3,

    DUPLICATE_USERNAME = 4,
    DUPLICATE_EMAIL = 5,

    LOCKED_USERNAME = 6,
    LOCKED_ACCOUNT = 7,
    LOCKED_PASSWORD = 8,

    MISSING_TOKEN = 9,
    USER_NOT_FOUND = 10,
    NOT_ADMIN = 11,
}
