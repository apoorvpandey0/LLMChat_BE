import express from 'express';
import authRoutes from './auth/auth.routes.js';
import chatRoutes from './chat/chat.routes.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { initializer } from './config/init.js';

const app = express();
app.use(express.json());

// Request logger middleware
app.use(requestLogger);

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Initialize all services
        await initializer.initialize();

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();