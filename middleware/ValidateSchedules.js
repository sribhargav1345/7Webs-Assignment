import { body, validationResult } from 'express-validator';

export const validateBooking = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('slot.start').notEmpty().withMessage('Slot start time is required'),
    body('slot.end').notEmpty().withMessage('Slot end time is required'),
];

export const handleValidationErrors = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
    
};

