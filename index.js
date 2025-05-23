// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MessagingResponse } = require('twilio').twiml;
const aiClient = require('./utils/huggingfaceClient'); // Using Hugging Face instead of OpenAI

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML chat interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for web chat interface
app.post('/api/chat', async (req, res) => {
  try {
    const message = req.body.message || '';
    
    console.log(`Received web message: ${message}`);
    
    // Process the message based on commands or default to conversation
    let responseText = '';
    
    // Check for command keywords
    const lowerCaseMessage = message.toLowerCase().trim();
    
    if (lowerCaseMessage.includes('prediction') || lowerCaseMessage.includes('predict')) {
      responseText = await handlePredictionRequest(message);
    } else if (lowerCaseMessage.includes('advice') || lowerCaseMessage.includes('suggest')) {
      responseText = await handleAdviceRequest(message);
    } else if (lowerCaseMessage.includes('roast') || lowerCaseMessage.includes('burn')) {
      responseText = await handleRoastRequest(message);
    } else {
      // Default conversation
      responseText = await handleGeneralConversation(message);
    }
    
    res.json({ message: responseText });
    
  } catch (error) {
    console.error('Error processing web message:', error);
    res.status(500).json({ 
      message: 'Arre yaar, something went wrong! Maine bola tha server maintenance karna chahiye! 😅' 
    });
  }
});

// Route for receiving WhatsApp messages via Twilio
app.post('/webhook', async (req, res) => {
  try {
    // Get the message sent by the user
    const incomingMessage = req.body.Body || '';
    const senderNumber = req.body.From || '';
    
    console.log(`Received message from ${senderNumber}: ${incomingMessage}`);
    
    // Process the message based on commands or default to conversation
    let responseText = '';
    
    // Check for command keywords
    const lowerCaseMessage = incomingMessage.toLowerCase().trim();
    
    if (lowerCaseMessage.includes('prediction') || lowerCaseMessage.includes('predict')) {
      responseText = await handlePredictionRequest(incomingMessage);
    } else if (lowerCaseMessage.includes('advice') || lowerCaseMessage.includes('suggest')) {
      responseText = await handleAdviceRequest(incomingMessage);
    } else if (lowerCaseMessage.includes('roast') || lowerCaseMessage.includes('burn')) {
      responseText = await handleRoastRequest(incomingMessage);
    } else {
      // Default conversation
      responseText = await handleGeneralConversation(incomingMessage);
    }
    
    // Create a response using Twilio's MessagingResponse
    const twiml = new MessagingResponse();
    twiml.message(responseText);
    
    // Send the response back to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Return a friendly error message
    const twiml = new MessagingResponse();
    twiml.message('Arre yaar, something went wrong! Try again later. Maine bola tha server ko update karne ke liye! 😅');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

// Handle prediction requests
async function handlePredictionRequest(message) {
  try {
    const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty predictions. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
    
    The user is asking for a prediction about: "${message}"
    
    Give a creative, slightly exaggerated but funny prediction. Keep it under 200 characters if possible, and use emojis.`;
    
    return await aiClient.generateResponse(prompt);
  } catch (error) {
    console.error('Error in prediction handler:', error);
    return 'Prediction system down! Maine bola tha backup system bhi rakhna chahiye! 😅';
  }
}

// Handle advice requests
async function handleAdviceRequest(message) {
  try {
    const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty advice. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
    
    The user is asking for advice about: "${message}"
    
    Give a creative, slightly exaggerated but funny advice. Keep it under 200 characters if possible, and use emojis.`;
    
    return await aiClient.generateResponse(prompt);
  } catch (error) {
    console.error('Error in advice handler:', error);
    return 'Advice system mein glitch hai! Maine bola tha technology pe itna depend mat karo! 😜';
  }
}

// Handle roast requests
async function handleRoastRequest(message) {
  try {
    const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty roasts. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
    
    The user wants to be roasted about: "${message}"
    
    Give a creative, funny roast that's not mean-spirited. Keep it under 200 characters if possible, and use emojis.`;
    
    return await aiClient.generateResponse(prompt);
  } catch (error) {
    console.error('Error in roast handler:', error);
    return 'Roast system offline! Maine bola tha jokes backup mein bhi rakhne chahiye the! 🔥';
  }
}

// Handle general conversation
async function handleGeneralConversation(message) {
  try {
    const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after chatting with users. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Try to include your signature line "Maine bola tha!" when appropriate.
    
    The user said: "${message}"
    
    Respond in a conversational, friendly way. Keep it under 200 characters if possible, and use emojis when appropriate.`;
    
    return await aiClient.generateResponse(prompt);
  } catch (error) {
    console.error('Error in conversation handler:', error);
    return 'Chat system needs a break! Maine bola tha AI ko bhi kabhi kabhi rest chahiye! 😴';
  }
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`MNBT bot server is running on port ${PORT}`);
  console.log(`Web interface: http://localhost:${PORT}`);
  console.log(`WhatsApp webhook: http://localhost:${PORT}/webhook`);
  console.log('Maine bola tha it will work! 😎');
});
