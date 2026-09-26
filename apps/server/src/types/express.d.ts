declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        state: string;
      };
    }
  }
}

export {};