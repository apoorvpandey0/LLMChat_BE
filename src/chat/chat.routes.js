import express from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { createChat, sendMessage } from './chat.controller.js';

const router = express.Router();

router.post('/create', authenticate, createChat);
router.post('/:id', authenticate, sendMessage);

export default router;