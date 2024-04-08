import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const slotSchema = new mongoose.Schema({
    start: {                                        // I have stored only start, since I am allocating 15 mins slot for everyone.
        type: String,
        required: true,
        match: /^(0[0-9]|1[0-9]|2[0-3]):(15|30|45|00)$/         // User can only book the slots in phase of 15 mins. -> User can book from 10 am but not from 10:12 like that.. again he can book from 10:15. Each slot -> 15 mins
    },
});

const bookedSlotSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: [slotSchema]
});

const Booking = mongoose.model('Booking', bookedSlotSchema);

export default Booking;
