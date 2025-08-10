export const PUBLIC_USER_PROVIDERS = {
    LOCAL: 'local'
} as const;

export type PublicUserProvider = (typeof PUBLIC_USER_PROVIDERS)[keyof typeof PUBLIC_USER_PROVIDERS];
export type PublicUserProviderKey = keyof typeof PUBLIC_USER_PROVIDERS;