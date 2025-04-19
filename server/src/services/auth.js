import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Don't need to redeclare Request interface - we'll just use type casting
// Interface already declared above
// Updated to verify token from GraphQL context
export const authMiddleware = ({ req }) => {
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
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.data;
    }
    catch (err) {
        console.log('Invalid token');
    }
    return req;
};
// Legacy middleware for REST routes if still needed
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET_KEY || '';
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user.data;
            return next();
        });
    }
    else {
        res.sendStatus(401); // Unauthorized
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '1h' });
};
