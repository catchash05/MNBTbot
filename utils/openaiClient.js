// OpenAI Client for the MNBT WhatsApp bot
const OpenAI = require('openai');

// Initialize OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a response using OpenAI's GPT model
 * @param {string} prompt - The prompt to send to OpenAI
 * @returns {Promise<string>} - The generated response text
 */
async function generateResponse(prompt) {
  try {
    // Call the OpenAI API with the provided prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a more affordable model
      messages: [
        {
          role: "system",
          content: "You are 'Main Ne Bola Tha', a witty desi AI personality who loves to say 'maine bola tha!' after giving advice, predictions, or funny roasts. Speak in Hinglish. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.8, // More creative responses
      top_p: 1,
      frequency_penalty: 0.5, // Reduce repetition
      presence_penalty: 0.5, // Encourage new topics
    });

    // Extract and return the generated text
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    return "Arre yaar, my brain stopped working! Try again later. Maine bola tha AI ko rest bhi dena chahiye! 😴";
  }
}

module.exports = {
  generateResponse,
};
