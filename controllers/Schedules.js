import express from 'express';
const router = express.Router();

import Booking from '../models/Schedules.js';
import { validateBooking, handleValidationErrors } from '../middleware/ValidateSchedules.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; 


router.post("/bookings", authMiddleware, validateBooking, handleValidationErrors, async (req, res) => {

    const userId = req.user._contact; 
    const { date, slot } = req.body;

    try {

        const dayOfWeek = new Date(date).getDay(); 
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

        const selectedDayAvailability = await Availability.findOne({ day: weekday });

        if (!selectedDayAvailability) {
            return res.status(400).json({ error: "No availability for the selected day" });
        }

        const selectedSlot = selectedDayAvailability.slots.find(s => s.start === slot);

        if (!selectedSlot) {
            return res.status(400).json({ error: "Invalid slot" });
        }

        if (selectedSlot.currentCapacity >= selectedSlot.maxCapacity) {
            return res.status(400).json({ error: "Slot is already full" });
        }

        const newBooking = new Booking({ userId, date, slot });
        selectedSlot.currentCapacity++;
        
        await newBooking.save();
        await selectedDayAvailability.save();

        res.json({ success: true, message: "Booking scheduled successfully" });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.delete("/bookings/:id", authMiddleware, async (req, res) => {

    const userId = req.user._contact;
    const bookingId = req.params.id;

    try {

        const booking = await Booking.findById(bookingId);

        if (!booking || booking.userId !== userId) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const dayOfWeek = new Date(booking.date).getDay();
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

        const selectedDayAvailability = await Availability.findOne({ day: weekday });

        if (!selectedDayAvailability) {
            return res.status(400).json({ error: "No availability for the selected day" });
        }

        const selectedSlot = selectedDayAvailability.slots.find(s => s.start === booking.slot);

        if (!selectedSlot) {
            return res.status(400).json({ error: "Invalid slot" });
        }

        selectedSlot.currentCapacity--;

        await booking.remove();
        await selectedDayAvailability.save();

        res.json({ success: true, message: "Booking deleted successfully" });
    } 

    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/bookings", async (req, res) => {

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
