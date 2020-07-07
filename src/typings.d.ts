declare module '*.scss';
declare module '*.svg';

// We have to check if we're inside of safari...
declare interface Window {
    safari: unknown;
}

// Environment, ts somehow requires VERSION to be in the global scope too
declare const VERSION: string;
declare const env: {
    NODE_ENV: 'development' | 'production';
    BUILD_DATE: number;
    VERSION: string;
    HTTPS_ENDPOINT: string;
    API_ENDPOINT: string;
};
