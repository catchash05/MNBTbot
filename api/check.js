// Simple serverless function for environment check
module.exports = (req, res) => {
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
};
