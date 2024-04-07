import express from 'express';
const router = express.Router();

import Booking from '../models/Schedules.js';
import { validateBooking, handleValidationErrors } from '../middleware/ValidateSchedules.js';

router.post("/api/bookings", validateBooking, handleValidationErrors, async (req, res) => {

    const { userId, date, slot } = req.body;

    try {

        const existingBooking = await Booking.findOne({ date, slot });

        if (existingBooking) {
            return res.status(400).json({ error: "Slot is already booked" });
        }

        const newBooking = new Booking({ userId, date, slot });

        await newBooking.save();
        res.json({ success: true, message: "Booking scheduled successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }

});

router.get("/api/bookings", async (req, res) => {

    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } 
    
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
    
});

export { router as Schedules };

