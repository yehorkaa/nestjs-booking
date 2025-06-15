export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    NON_BINARY: 'non-binary',
    OTHER: 'other',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];