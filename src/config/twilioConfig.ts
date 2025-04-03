
// This file contains Twilio configuration settings
// In production, these values should be handled server-side

export const twilioConfig = {
  // Twilio account credentials (replace with your actual credentials)
  accountSid: "YOUR_TWILIO_ACCOUNT_SID", // Replace with your actual Twilio Account SID
  apiKey: "YOUR_TWILIO_API_KEY", // Replace with your actual Twilio API Key
  apiSecret: "YOUR_TWILIO_API_SECRET", // Replace with your actual Twilio API Secret
  
  // Backend service configuration
  useBackendService: true, // Set to true to use the backend service for token generation
  backendUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com/api/twilio' 
    : 'http://localhost:3001/api/twilio'
};
