export const PUBLIC_USER_ROLES = {
    TENANT: 'tenant',
    PROPERTY_OWNER: 'propertyOwner'
} as const;

export type PublicUserRole = (typeof PUBLIC_USER_ROLES)[keyof typeof PUBLIC_USER_ROLES];
export type PublicUserRoleKey = keyof typeof PUBLIC_USER_ROLES;