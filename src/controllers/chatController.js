// const { generateGPTResponse } = require('../services/openaiService');
// const { saveChatHistory } = require('../utils/supabaseClient');

// exports.handleChat = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required.' });
//   }

//   try {
//     const reply = await generateGPTResponse(message);

//     // Save chat history to Supabase
//     await saveChatHistory({ message, role: 'user' });
//     await saveChatHistory({ message: reply, role: 'gpt' });

//     res.json({ reply });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to process chat.' });
//   }
// };
