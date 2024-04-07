import express from 'express';
const router = express.Router();

import User from '../models/User.js';

import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtExpiration = '1h';                                                                 // JWT Token will be valid for 1 hour

router.post("/register", [
    body('email', 'Email Format is not correct').isEmail().custom(value => {                    
        if (!value.endsWith('@gmail.com')) {    
            throw new Error('Email must be of @gmail.com domain');
        }
        return true;
    }),
    body('name').isLength({ min: 4 }),                                                         
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),           
    body('contact',' Contact number length should be of 10').isLength({ max: 10, min: 10})   

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const existingUser = await User.findOne({ email: req.body.email });
        const existingnumber = await User.findOne({ contact: req.body.contact });
        
        if (existingUser) {
            console.log("Email already Registered");
            return res.status(400).json({ success: false, error: "Email Already Registered" });
        }

        if (existingnumber) {
            console.log("Phone Number aldready used");
            return res.status(400).json({ success: false, error: "Phone Number aldready Registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);                              // Hashed the password

        await User.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
            contact: req.body.contact,
        });

        res.json({ success: true });

    }
    
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        const passwordCompare = await bcrypt.compare(password, userData.password);                      // Checking password, after bcrypt
        if (!passwordCompare) {
            return res.status(400).json({ error: "Incorrect Password" });
        }

        const tokenPayload = { user: { id: userData.id, email: userData.email } };
        const authToken = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration });

        return res.json({ success: true, authToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

router.post("/logout", (req, res) => {
    res.json({ success: true, message: "User logged out successfully" });
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

export { router as userAuthRoutes };
