import express from 'express';
const router = express.Router();

import { userAuthRoutes } from '../controllers/UserAuthentication.js';
import { Availability } from '../controllers/Availability.js';
import { Schedules } from '../controllers/Schedules.js';

router.use('/register', userAuthRoutes);
router.use('/availability', Availability);
router.use('/bookings', Schedules);

export default router;
