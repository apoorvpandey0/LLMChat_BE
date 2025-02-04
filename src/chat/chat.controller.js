import { generateResponse } from '../services/gemini.js';
import { Chat } from './chat.model.js';

export const chat = async (req, res) => {
  const { message } = req.body;
  try {
    const result = await generateResponse(message);
    res.json({ response: result });
  } catch (error) {
    res.status(500).send('Error generating response');
    console.log(error);
    
  }
};

export const createChat = async (req, res) => {
console.log(req.user);
 
  try {
    const chat = new Chat({
      userId: req.user.userId,
      messages: []
    });
    console.log(chat);

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Error creating chat' });
  }
};

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  const { id } = req.params;

  try {
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });
    console.log(message);

    // Generate AI response
    const aiResponse = await generateResponse(message);
    
    // Add AI response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chat.save();
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
};