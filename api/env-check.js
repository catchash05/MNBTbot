// Standalone API route for checking environment variables on Vercel
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Create a response object with environment variable status (true/false only, not actual values)
  const envStatus = {
    huggingface_token: !!process.env.HUGGINGFACE_API_TOKEN,
    twilio_account_sid: !!process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: !!process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: !!process.env.TWILIO_PHONE_NUMBER,
    node_env: process.env.NODE_ENV || 'not set',
    vercel_env: process.env.VERCEL_ENV || 'not set'
  };
  
  // Send the status (never the actual values for security)
  res.status(200).json({
    message: 'Environment Variable Status (true = set, false = not set)',
    status: envStatus,
    timestamp: new Date().toISOString()
  });
};
