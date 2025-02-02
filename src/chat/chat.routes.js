import express from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { chat } from './chat.controller.js';

const router = express.Router();

router.post('/chat', authenticate, chat);

export default router;