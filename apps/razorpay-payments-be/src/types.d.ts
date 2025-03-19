declare namespace Express {
  interface Request {
    user: {
      role: string;
      sub: string;
      name: string;
      email: string;
      picture: string;
      exp: number;
    };
  }
}
