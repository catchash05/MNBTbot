// Load environment variables
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
// Use Hugging Face client instead of OpenAI
const huggingfaceClient = require('./utils/huggingfaceClient');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));

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
  const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty predictions. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
  
  The user is asking for a prediction about: "${message}"
  
  Give a creative, slightly exaggerated but funny prediction. Keep it under 200 characters if possible, and use emojis.`;
  
  return await huggingfaceClient.generateResponse(prompt);
}

// Handle advice requests
async function handleAdviceRequest(message) {
  const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty advice. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
  
  The user is asking for advice about: "${message}"
  
  Give a creative, slightly exaggerated but funny advice. Keep it under 200 characters if possible, and use emojis.`;
  
  return await huggingfaceClient.generateResponse(prompt);
}

// Handle roast requests
async function handleRoastRequest(message) {
  const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after giving witty roasts. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Always end with your signature line "Maine bola tha!".
  
  The user wants to be roasted about: "${message}"
  
  Give a creative, funny roast that's not mean-spirited. Keep it under 200 characters if possible, and use emojis.`;
  
  return await huggingfaceClient.generateResponse(prompt);
}

// Handle general conversation
async function handleGeneralConversation(message) {
  const prompt = `You are "Main Ne Bola Tha", a desi AI personality who loves to say "maine bola tha!" after chatting with users. Speak in Hinglish with some English mixed in. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend. Try to include your signature line "Maine bola tha!" when appropriate.
  
  The user said: "${message}"
  
  Respond in a conversational, friendly way. Keep it under 200 characters if possible, and use emojis when appropriate.`;
  
  return await huggingfaceClient.generateResponse(prompt);
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`MNBT WhatsApp bot server is running on port ${PORT}`);
  console.log('Maine bola tha it will work! 😎');
});

// Diagnostic endpoint to check environment variables (TOKEN PRESENCE ONLY, NOT VALUE)
app.get('/env-check', (req, res) => {
  // Create a response object with environment variable status (true/false only, not actual values)
  const envStatus = {
    huggingface_token: !!process.env.HUGGINGFACE_API_TOKEN,
    twilio_account_sid: !!process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: !!process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: !!process.env.TWILIO_PHONE_NUMBER,
    port: process.env.PORT || 3000
  };
  
  // Send the status (never the actual values for security)
  res.json({
    message: 'Environment Variable Status (true = set, false = not set)',
    status: envStatus,
    timestamp: new Date().toISOString()
  });
});
