# Main Ne Bola Tha (MNBT) WhatsApp Bot

A fun, witty WhatsApp bot powered by OpenAI's GPT and Twilio's WhatsApp API. The bot responds in Hinglish with a signature catchphrase "Maine bola tha!" (I told you so!).

## Features

- 🔮 **Predictions**: Ask for predictions about anything
- 💡 **Advice**: Get witty advice from your desi AI friend
- 🔥 **Roasts**: Get friendly roasts with the signature MNBT style
- 💬 **General Conversation**: Chat about anything with MNBT personality

## Prerequisites

- Node.js (v14+)
- OpenAI API key
- Twilio account with WhatsApp API access
- ngrok or similar for local testing (optional)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MNBTbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the sample .env file and add your API keys:

   ```bash
   cp .env.sample .env
   ```

   Edit the `.env` file with your actual API keys and configuration.

4. **Start the server**

   For development with automatic restart:
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

5. **Connect to Twilio**

   - If testing locally, use ngrok to expose your local server:
     ```bash
     ngrok http 3000
     ```
   - In your Twilio WhatsApp Sandbox settings, set the webhook URL to:
     ```
     https://your-ngrok-url.ngrok.io/webhook
     ```

## Usage

Once set up, users can interact with the bot on WhatsApp by sending messages to your Twilio WhatsApp number:

- **Predictions**: "Bhai, mera aaj ka prediction kya hai?"
- **Advice**: "Should I message my crush?"
- **Roasts**: "Roast me please!"
- **General Chat**: Any other message will be treated as general conversation

## Deployment

For production deployment, you can use services like:

- Heroku
- Render
- Vercel
- AWS EC2
- DigitalOcean

## License

MIT

## Acknowledgements

- OpenAI for the GPT API
- Twilio for the WhatsApp API
- All the desi friends who inspired the "Maine bola tha!" personality
