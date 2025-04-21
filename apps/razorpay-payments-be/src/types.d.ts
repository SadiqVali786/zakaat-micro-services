declare namespace Express {
  interface Request {
    user: {
      role: string;
      id: string;
      name: string;
      email: string;
      image: string;
      exp: number;
      iat: number;
    };
  }
}
