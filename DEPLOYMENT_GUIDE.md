# MNBT WhatsApp Bot Deployment Guide

This guide covers how to deploy your "Main Ne Bola Tha" WhatsApp bot to a production environment.

## 1. Server Deployment Options

### Render Deployment

1. Create an account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository or upload the code
4. Configure your service:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add your environment variables from `.env`
   - Select an appropriate plan

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   cd /path/to/MNBTbot
   vercel
   ```

3. Follow the prompts and add your environment variables

### AWS EC2 Deployment

1. Create an EC2 instance
2. SSH into your instance
3. Clone your repository
4. Install Node.js and dependencies
5. Set up a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name mnbt-bot
   pm2 save
   ```

## 2. Domain Setup (Optional but Recommended)

1. Purchase a domain from a provider like Namecheap, GoDaddy, or Google Domains
2. Configure DNS settings to point to your deployed server
3. Consider using HTTPS for secure connections:
   - Set up SSL with Let's Encrypt
   - Many deployment platforms offer automatic HTTPS

## 3. Environment Variables

Ensure these environment variables are set in your production environment:

```
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886
PORT=3000
```

## 4. Monitoring and Maintenance

1. Set up logging:
   - Use a service like Logtail, Papertrail or LogDNA
   - Or implement Winston or Pino for local logging

2. Performance monitoring:
   - Consider New Relic, Datadog, or PM2 monitoring

3. Error handling:
   - Set up error notifications via email or Slack

## 5. Scaling Considerations

1. For high traffic:
   - Consider implementing a queue system with Redis or RabbitMQ
   - Look into horizontal scaling options

2. Cost management:
   - Monitor your OpenAI API usage
   - Set up billing alerts

## 6. Security Best Practices

1. Keep dependencies updated:
   ```bash
   npm audit
   npm update
   ```

2. Rate limiting:
   - Implement rate limiting to prevent abuse

3. Input validation:
   - Sanitize all user inputs

## 7. Backup Strategy

1. Regularly backup your codebase
2. If using a database, set up automated backups

## 8. Legal Considerations

1. Terms of Service and Privacy Policy:
   - Create documents outlining how user data is handled
   - Be compliant with relevant regulations (GDPR, CCPA)

2. Content moderation:
   - Consider implementing content filters for inappropriate requests
