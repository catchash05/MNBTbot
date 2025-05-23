// Simple API route for the root endpoint
module.exports = (req, res) => {
  res.status(200).json({
    message: 'MNBT WhatsApp Bot API is running!',
    endpoints: {
      '/api/env-check': 'Check environment variable status',
      '/api/chat': 'Send messages to the bot (POST only)',
      '/webhook': 'Twilio WhatsApp webhook (POST only)'
    },
    timestamp: new Date().toISOString()
  });
};
