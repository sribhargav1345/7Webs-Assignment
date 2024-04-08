import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

// For decoding user details from his jwt-token, which is provided to him, after he logged in.
export const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findOne({ contact: decoded.user.contact });   // for the sake, i am taking user id as his contact.

        next();
    } 
    catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
