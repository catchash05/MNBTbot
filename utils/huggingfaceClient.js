// Direct Hugging Face API Client for the MNBT WhatsApp bot
const axios = require('axios');

// Initialize API token from environment
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '';

// Response cache to avoid repetitive fallback responses
const MAX_CACHE_SIZE = 10;
let responseCache = [];

/**
 * Add a response to the cache to avoid repetition
 */
function addToCache(response) {
  responseCache.unshift(response);
  if (responseCache.length > MAX_CACHE_SIZE) {
    responseCache.pop();
  }
}

/**
 * Check if a response is in the recent cache
 */
function isInCache(response) {
  return responseCache.includes(response);
}

/**
 * Get a unique response from an array of options
 */
function getUniqueResponse(responses) {
  const availableResponses = [...responses];
  const uniqueResponses = availableResponses.filter(r => !isInCache(r));
  
  if (uniqueResponses.length > 0) {
    const selectedResponse = uniqueResponses[Math.floor(Math.random() * uniqueResponses.length)];
    addToCache(selectedResponse);
    return selectedResponse;
  }
  
  const selectedResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
  addToCache(selectedResponse);
  return selectedResponse;
}

/**
 * Generate a response using Hugging Face's API directly
 * @param {string} prompt - The prompt to send to the model
 * @returns {Promise<string>} - The generated response text
 */
async function generateResponse(prompt) {
  const startTime = Date.now(); // Track response time
  let responseSource = 'unknown';
  
  try {
    // Define system message and prepare full prompt
    const systemMessage = "You are 'Main Ne Bola Tha', a witty desi AI personality who loves to say 'maine bola tha!' after giving advice, predictions, or funny roasts. Speak in Hinglish. Your tone is humorous, cheeky, yet loveable like an elder sibling or best friend.";
    
    const fullPrompt = `${systemMessage}\n\nUser: ${prompt}\n\nResponse:`;
    
    // First try: Use Hugging Face text-generation models
    try {
      // Using a more appropriate model for this task
      const response = await axios({
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        data: {
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true
          }
        },
        timeout: 10000 // 10 second timeout
      });

      // If we get a successful response
      if (response.data && response.data[0] && response.data[0].generated_text) {
        let generatedText = response.data[0].generated_text;
        
        // Remove the prompt from the response if it's included
        if (generatedText.includes('Response:')) {
          generatedText = generatedText.split('Response:')[1].trim();
        }
        
        // If the response doesn't include "Maine bola tha", add it
        if (!generatedText.toLowerCase().includes('maine bola tha') && 
            !generatedText.toLowerCase().includes('main ne bola tha')) {
          generatedText += " Maine bola tha! 😎";
        }
        
        responseSource = 'API_MODEL_1';
        console.log(`[RESPONSE SOURCE] ✅ Primary API response (Zephyr) - Time: ${Date.now() - startTime}ms`);
        return generatedText.trim();
      }
    } catch (apiError) {
      console.log('First API attempt failed, trying secondary model:', apiError.message);
      
      // Second try: Use a different model if the first one fails
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api-inference.huggingface.co/models/google/flan-t5-xl',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          data: {
            inputs: fullPrompt,
            parameters: {
              max_length: 150,
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true
            }
          },
          timeout: 10000 // 10 second timeout
        });
        
        if (response.data && response.data[0] && response.data[0].generated_text) {
          let generatedText = response.data[0].generated_text;
          
          // Clean up and format the response
          if (generatedText.includes('Response:')) {
            generatedText = generatedText.split('Response:')[1].trim();
          }
          
          if (!generatedText.toLowerCase().includes('maine bola tha') && 
              !generatedText.toLowerCase().includes('main ne bola tha')) {
            generatedText += " Maine bola tha! 😎";
          }
          
          return generatedText.trim();      }
    } catch (secondApiError) {
      console.log('Second API attempt also failed:', secondApiError.message);
      
      // Third try: Use a smaller, more reliable model as last resort
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api-inference.huggingface.co/models/google/flan-t5-base',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          data: {
            inputs: fullPrompt,
            parameters: {
              max_length: 100,
              temperature: 0.8,
              top_p: 0.95,
              do_sample: true
            }
          },
          timeout: 8000 // 8 second timeout
        });
        
        if (response.data && response.data[0] && response.data[0].generated_text) {
          let generatedText = response.data[0].generated_text;
          
          // Clean up and format the response
          if (generatedText.includes('Response:')) {
            generatedText = generatedText.split('Response:')[1].trim();
          }
          
          if (!generatedText.toLowerCase().includes('maine bola tha') && 
              !generatedText.toLowerCase().includes('main ne bola tha')) {
            generatedText += " Maine bola tha! 😎";
          }
          
          return generatedText.trim();
        }
      } catch (thirdApiError) {
        console.log('Third API attempt also failed:', thirdApiError.message);
        // All API calls failed, continue to fallback responses
      }
      // Both API calls failed, continue to fallback responses
      }
    }
    
    // If we reach here, both API attempts failed
    // Use fallback responses based on message type
    throw new Error('API calls failed, using fallback responses');
    
  } catch (error) {
    console.error('Error generating Hugging Face response:', error.message);
    const responseTime = Date.now() - startTime;
    console.log(`[RESPONSE SOURCE] ⚠️ Fallback response (API calls failed) - Time: ${responseTime}ms`);
    responseSource = 'FALLBACK';
    
    // Custom fallback responses based on message type
    if (prompt.toLowerCase().includes('prediction') || prompt.toLowerCase().includes('predict')) {
      const predictions = [
        "Aaj toh baarish hogi... ya nahi hogi! Depends on Weather Department ka mood. Maine bola tha na, weather app download karlo! 😂",
        "Kal lottery lagegi... sapne mein! Reality mein bus fare badhne wala hai. Maine bola tha na, e-wallet use karo! 💸",
        "Tumhara crush tumhe message karega... lekin galti se, wrong number samajh ke! Maine bola tha display picture update karo! 📱",
        "Aane wale time mein tumhari life ekdum blockbuster movie jaisi hogi - interval ke baad! Maine bola tha patience rakho! 🎬",
        "Stars kehte hain... actually stars kuch nahi kehte, bas jalte rehte hain. Maine bola tha astronomy class join karo! ✨",
        "Future mein tum famous hoge... apne ghar mein! Maine bola tha realistic expectations rakho! 🏆",
        "Tumhari kismat chamkegi... jab tum phone ka brightness badhaaoge! Maine bola tha technical skills improve karo! 📱",
        "Next week tumhe ek surprise milega... electricity bill ka! Maine bola tha AC ka use kam karo! 💡"
      ];
      return getUniqueResponse(predictions);
    } 
    else if (prompt.toLowerCase().includes('advice') || prompt.toLowerCase().includes('suggest')) {
      const advice = [
        "Tension mat lo yaar! Life is like a momos ki plate - kabhi meetha chutney, kabhi teekha! Maine bola tha! 🥟",
        "Subah jaldi utho, sab theek ho jayega... ya phir so jao, problem hi gayab! Maine bola tha time management seekho! ⏰",
        "Relationship mein communication zaroori hai... par kabhi kabhi chup rehna bhi. Maine bola tha psychology padho! 💑",
        "Money save karo, lekin life experiences ke liye spend bhi karo. Maine bola tha balance important hai! 💰",
        "Kabhi kabhi ice cream khana zaroori hai, diet plan se zyada. Maine bola tha happiness priority hai! 🍦",
        "Office mein kaam karo, ghar pe aaram karo. Maine bola tha work-life balance zaroori hai! 💼",
        "Naye logon se milo, purane doston ko yaad rakho. Maine bola tha social circle diverse rakho! 👨‍👩‍👧‍👦",
        "Har weekend kuch naya try karo, routine se bahar niklo. Maine bola tha comfort zone se bahar aao! 🧗"
      ];
      return getUniqueResponse(advice);
    } 
    else if (prompt.toLowerCase().includes('roast') || prompt.toLowerCase().includes('burn')) {
      const roasts = [
        "Tumhare jokes itne purane hain ki dinosaur bhi bolta hai 'ok boomer'! Maine bola tha humor upgrade karo! 🔥",
        "Tumhari personality itni bland hai ki vanilla ice cream bhi bolta hai 'thoda flavor add karo'! Maine bola tha hobbies develop karo! 😜",
        "Tumhare style sense ke baare mein kya kahun... fashion police ne warrant nikal diya hai! Maine bola tha Instagram follow karo! 👔",
        "Tumhare cooking skills aise hain ki Maggi bhi tumse bach ke bhaagti hai! Maine bola tha YouTube tutorials dekho! 🍳",
        "Tumhari fitness journey aise chal rahi hai jaise Delhi metro during lockdown! Maine bola tha consistency important hai! 💪",
        "Tumhare selfies aise hain ki phone ka front camera resign kar dena chahta hai! Maine bola tha lighting pe dhyaan do! 📸",
        "Tumhare dance moves dekh ke Govinda bhi confused ho jata hai! Maine bola tha practice zaroori hai! 💃",
        "Tumhare singing skills itne kamaal ke hain ki birds apna migration early start kar dete hain! Maine bola tha auto-tune try karo! 🎤"
      ];
      return getUniqueResponse(roasts);
    } 
    else {
      const general = [
        "Arrey yaar! Abhi busy hoon, thodi der baad baat karte hain. Maine bola tha na, AI ko bhi kabhi kabhi coffee break chahiye! ☕",
        "Kya chal raha hai? Life thik hai? Meri taraf se sab first class hai! Maine bola tha positive rehne ka! 😎",
        "Namaste ji! Aaj ka din kaisa ja raha hai? Maine bola tha har din ko celebrate karo! 🎉",
        "Kya baat kar rahe ho? Main toh bas chillin' like a villain! Maine bola tha life ko light lo! 🥤",
        "Aur batao, kya haal chaal? Maine toh abhi sirf time pass kar raha hoon! Maine bola tha kabhi kabhi relaxation bhi zaroori hai! 🛋️",
        "Hello ji! Kaise ho aap? Main ekdum mast mood mein hoon aaj! Maine bola tha positivity contagious hoti hai! 🌈",
        "Kya scene hai? Maine socha aaj thoda timepass karein. Maine bola tha break lena bhi important hai! 🍿",
        "Arre wah! Aap vapas aa gaye. Mujhe laga aap bhool gaye the! Maine bola tha yaadein important hoti hain! 💭"
      ];
      return getUniqueResponse(general);
    }
  }
}

module.exports = {
  generateResponse,
};
