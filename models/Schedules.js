import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookedSlotSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    }
});

const Booking = mongoose.model('Booking', bookedSlotSchema);

export default Booking;
