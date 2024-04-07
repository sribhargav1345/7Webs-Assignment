import { body, validationResult } from 'express-validator';

export const availabilityValidation = [
    body('availability.*.day').isString().withMessage('Day is required'),
    body('availability.*.slots').isArray().withMessage('Slots must be an array'),

    body('availability.*.slots.*.start').isString().withMessage('Start time is required'),
    body('availability.*.slots.*.start').matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/).withMessage('Invalid start time format (HH:MM)'),

    body('availability.*.slots.*.end').isString().withMessage('End time is required'),
    body('availability.*.slots.*.end').matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/).withMessage('Invalid end time format (HH:MM)'),

    body('availability.*.slots.*.maxCapacity').isInt({ min: 1 }).withMessage('Max capacity must be at least 1'),
];


export const validateAvailability = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
