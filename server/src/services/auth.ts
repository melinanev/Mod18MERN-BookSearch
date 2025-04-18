import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// Define the structure of the JWT payload
export interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// Don't need to redeclare Request interface - we'll just use type casting

// Interface already declared above

// Updated to verify token from GraphQL context
export const authMiddleware = ({ req }: { req: Request }) => {
  // Get the token from the request headers or query parameters
  let token = req.headers.authorization || '';

  // Remove "Bearer" from the token string if it exists
  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  if (!token) {
    return req;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as { data: JwtPayload };
    (req as any).user = decoded.data;
  } catch (err) {
    console.log('Invalid token');
  }

  return req;
};

// Legacy middleware for REST routes if still needed
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      (req as any).user = (user as any).data;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '1h' });
};
