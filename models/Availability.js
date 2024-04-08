import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    start: { 
        type: String,
        required: true,
        match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
    },
    end: { 
        type: String, 
        required: true,
        match: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/
    },
    maxCapacity: { 
        type: Number, 
        required: true,
        min: 1
    },
    currentCapacity: { 
        type: Number,
        default: 0
    }
});

const availabilitySchema = new mongoose.Schema({
    day: { 
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'] 
    },
    slots: [slotSchema]
});

// This function ensures that the start time of every slot should be less than end time of that slot
availabilitySchema.pre('save', function (next) {

    const availability = this; 

    for (const slot of availability.slots) {

        const startHour = parseInt(slot.start.split(':')[0], 10);
        const startMinute = parseInt(slot.start.split(':')[1], 10);

        const endHour = parseInt(slot.end.split(':')[0], 10);
        const endMinute = parseInt(slot.end.split(':')[1], 10);

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        if (startTimeInMinutes >= endTimeInMinutes) {
            return next(new Error('Start time must be less than end time')); 
        }
    }
    next(); 
});


const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;
