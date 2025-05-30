export const AUTH_TYPE = {
    BEARER: 'Bearer',
    NONE: 'None',
} as const;

export type AuthType = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];