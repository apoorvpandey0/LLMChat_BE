import { generateResponse } from '../services/gemini.js';

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