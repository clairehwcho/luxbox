import 'dotenv/config';
import mongoose from 'mongoose';

const dbName = process.env.DB_NAME;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${dbName}`);
        console.log(`Successfully connected to ${dbName}`);
    } catch (error) {
        console.log('Failed to connect to MongoDB: ', error);
    }
};

export const getConnection = async () => {
    if (!mongoose.connection.readyState) {
        await connectToDatabase();
    }
    return mongoose.connection;
};