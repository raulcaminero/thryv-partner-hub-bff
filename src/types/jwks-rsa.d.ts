// Local type shim for jwks-rsa used by jwt.strategy.ts
declare module 'jwks-rsa' {
  type PassportJwtSecretFunction = (
    req: any,
    token: any,
    done: (err: any, secret?: string | Buffer | undefined) => void
  ) => void;

  export function passportJwtSecret(options: {
    cache?: boolean;
    rateLimit?: boolean;
    jwksRequestsPerMinute?: number;
    jwksUri?: string;
  }): PassportJwtSecretFunction;

  const _default: { passportJwtSecret: typeof passportJwtSecret };
  export default _default;
}
