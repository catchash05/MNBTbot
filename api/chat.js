// Import the Hugging Face client
const huggingfaceClient = require('../utils/huggingfaceClient');

// Chat API endpoint for web interface
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get the message from the request body
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Received message from web interface: ${message}`);
    
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
    
    // Send the response
    res.status(200).json({ message: responseText });
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      message: 'Arre yaar, something went wrong! Maine bola tha server maintenance karna chahiye! 😅' 
    });
  }
};

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
