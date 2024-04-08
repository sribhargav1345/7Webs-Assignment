import express from 'express';
const router = express.Router();

import Availability from '../models/Availability.js';
import { availabilityValidation, validateAvailability } from '../middleware/validateAvailability.js';

router.post("/availability", availabilityValidation, validateAvailability, async (req, res) => {

    try {
        const { day, slots } = req.body;

        let existingAvailability = await Availability.findOne({ day });                     // If that day is present, update the slots in that day, dont add again.

        if (existingAvailability) {

            existingAvailability.slots = slots;
            await existingAvailability.save();

            return res.json({ success: true, message: "Availability updated successfully" });
        } 
        else {

            const newAvailability = new Availability({ day, slots });
            await newAvailability.save();
            return res.json({ success: true, message: "Availability set successfully" });
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// I have made this, like if user gives specific date -> this will convert it into the week day and return it's slots
router.get("/availability/:required_date", async (req, res) => {

    try {
        const requestedDate = req.params.required_date;

        if (!requestedDate) {
            return res.status(400).json({ error: "Missing required parameter: date" });
        }

        const date = new Date(requestedDate);

        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const dayOfWeek = date.getDay(); 

        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

        const availabilities = await Availability.find({ day: weekday });

        res.json({ date, availabilities }); 
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
  

export { router as Availability };
