import { body, validationResult } from 'express-validator';

export const validateBooking = [
    body('date').notEmpty().withMessage('Date is required'),
    body('slot.start').notEmpty().withMessage('Slot start time is required'),
];

export const handleValidationErrors = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
};

