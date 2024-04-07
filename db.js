import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoDB = async () => {

    const USERNAME = process.env.DB_USERNAME;
    const PASSWORD = process.env.DB_PASSWORD;

    const mongoURL = `mongodb+srv://${USERNAME}:${PASSWORD}@saloon-booking-system.mcn3ec1.mongodb.net/?retryWrites=true&w=majority&appName=Saloon-Booking-System`;

    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    }
    catch (error) {
      console.error('MongoDB connection error:', error);
    }
};

export default mongoDB;

