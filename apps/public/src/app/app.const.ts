export const APP_PREFIX = 'api/public';
export const APP_ENV = {
  DEV: 'dev',
  PROD: 'prod',
} as const;
export const getAppBaseUrl = (
  env: string = APP_ENV.DEV,
  { port }: Record<string, any> = { port: 3000 }
) => {
  if (env === APP_ENV.DEV) {
    return `http://localhost:${port}/${APP_PREFIX}`;
  }
  // TODO: deploy on AWS, add prod url
  return `http://localhost:${port}/${APP_PREFIX}`;
};
