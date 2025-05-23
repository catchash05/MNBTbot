# Setting Up Twilio for MNBT WhatsApp Bot

## Twilio WhatsApp API Setup Instructions

1. **Create a Twilio Account**
   - Go to [twilio.com](https://www.twilio.com/) and sign up for an account
   - Complete verification of your email and phone number
   - You will receive Account SID and Auth Token (save these for your `.env` file)

2. **Access the WhatsApp Sandbox**
   - In the Twilio Console, go to Messaging > Try it out > Send a WhatsApp message
   - You will see instructions to join your sandbox:
     - Send a specific message (like "join example-word") to the Twilio WhatsApp number
     - This connects your personal WhatsApp to your Twilio sandbox for testing

3. **Configure Your Webhook**
   - In the same WhatsApp Sandbox page, find "Sandbox Configuration"
   - Set "When a message comes in" to your server's webhook URL:
     ```
     https://your-server-url.com/webhook
     ```
   - Ensure the HTTP method is set to POST
   - Click Save

4. **Update Your Environment Variables**
   - Add these to your `.env` file:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid_from_twilio_console
     TWILIO_AUTH_TOKEN=your_auth_token_from_twilio_console
     TWILIO_PHONE_NUMBER=whatsapp:+14155238886  # Or your assigned Twilio WhatsApp number
     ```

5. **Testing Your Integration**
   - Send a message to your Twilio WhatsApp number
   - Your bot should receive the message and respond through the webhook

## Production WhatsApp Business API

For production use with high volume:

1. Apply for the WhatsApp Business API through Twilio or directly through Facebook/Meta
2. Follow their verification process for your business
3. Once approved, update your webhook settings in your production dashboard

## Troubleshooting

- **No Response**: Check your server logs and Twilio console for errors
- **Webhook Errors**: Verify your URL is accessible and your server is running
- **Authorization Issues**: Double-check your Twilio credentials in the `.env` file
