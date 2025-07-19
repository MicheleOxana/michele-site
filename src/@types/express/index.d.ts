import 'cookie-session';

declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      user?: {
        id: string;
        display_name: string;
        email?: string;
      };
    };
  }
}