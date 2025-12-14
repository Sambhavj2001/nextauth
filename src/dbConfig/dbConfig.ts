import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();    
mongoose.set('strictQuery', false);

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {  
    try {       
        await mongoose.connect(MONGO_URI);

        const db = mongoose.connection; 
        db.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        db.on('error', (error) => {
            console.error('MongoDB connection error:', error);
            process.exit(); 
        });


        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }   
};