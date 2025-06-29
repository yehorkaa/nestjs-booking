export const ensureLeadingPrefix = (
  key: string,
  prefix: string = '/'
): string => {
  return key.startsWith(prefix) ? key : `${prefix}${key}`;
};