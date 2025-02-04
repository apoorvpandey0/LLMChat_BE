import mongoose from 'mongoose';
import dotenv from 'dotenv';

class Initializer {
    static instance = null;
    isInitialized = false;

    constructor() {
        if (Initializer.instance) {
            return Initializer.instance;
        }
        Initializer.instance = this;
    }

    async initialize() {
        if (this.isInitialized) {
            console.log('System already initialized, skipping initialization');
            return;
        }

        console.log('Starting system initialization...');
        
        try {
            // Load environment variables
            dotenv.config();
            console.log('Environment variables loaded');

            // Initialize MongoDB connection
            await this.initializeMongoDB();

            // Add any other initialization steps here
            // e.g., Redis, external services, etc.

            this.isInitialized = true;
            console.log('System initialization completed successfully');
        } catch (error) {
            console.error('System initialization failed:', error);
            throw error;
        }
    }

    async initializeMongoDB() {
        try {
            if (!mongoose.connection.readyState) {
                console.log('Connecting to MongoDB...');
                await mongoose.connect(process.env.MONGO_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log('MongoDB connected successfully');
            } else {
                console.log('MongoDB already connected');
            }
        } catch (error) {
            console.error('MongoDB connection failed:', error);
            throw error;
        }
    }

    // Add other initialization methods as needed
}

// Export a singleton instance
export const initializer = new Initializer();
