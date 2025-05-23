// Simple test script to check if responses are from API or fallback
require('dotenv').config();
const aiClient = require('./utils/huggingfaceClient');

async function test() {
  console.log('===== MNBT Response Source Test =====');
  
  const prompts = [
    "Give me a prediction about my future",
    "I need advice about my career",
    "Roast me about my cooking skills",
    "Hello, how are you today?"
  ];
  
  for (const prompt of prompts) {
    console.log(`\n>> Testing prompt: "${prompt}"`);
    try {
      const response = await aiClient.generateResponse(prompt);
      console.log(`<< Response: "${response}"`);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  console.log('\n===== Test Complete =====');
}

test()
  .then(() => console.log('All tests completed'))
  .catch(err => console.error('Test failed:', err));
