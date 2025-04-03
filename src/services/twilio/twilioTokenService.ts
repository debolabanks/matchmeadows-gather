import { v4 as uuidv4 } from 'uuid';
import { twilioConfig } from '@/config/twilioConfig';

/**
 * In a real production application, this token would be generated on the server
 * to keep your Twilio credentials secure. This is a client-side implementation
 * for demonstration purposes only.
 * 
 * SECURITY WARNING: Do not use this approach in production!
 * Instead, create a backend API endpoint that generates tokens.
 */

// Environmental variables for Twilio credentials (using config for development)
const TWILIO_ACCOUNT_SID = twilioConfig.accountSid;
const TWILIO_API_KEY = twilioConfig.apiKey;
const TWILIO_API_SECRET = twilioConfig.apiSecret;

/**
 * Generate a Twilio access token
 * In a real application, this function would make an API call to your backend
 */
export const generateTwilioToken = async (identity: string, roomName: string): Promise<string> => {
  // For demonstration, we're checking if we have the credentials
  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET) {
    console.warn("Twilio credentials not found. Using mock token for demonstration.");
    return `demo-token-${uuidv4()}`;
  }

  try {
    // In a real application, we would make an API call to our backend here
    // For example:
    // const response = await fetch('/api/twilio-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ identity, roomName })
    // });
    // const data = await response.json();
    // return data.token;
    
    // Since we don't have a backend set up yet, we'll return a demo token
    // This would be replaced with actual API call in production
    console.log(`[Demo] Generated token for ${identity} in room ${roomName}`);
    return `demo-token-${uuidv4()}`;
  } catch (error) {
    console.error("Error generating Twilio token:", error);
    throw new Error("Failed to generate Twilio access token");
  }
};

/**
 * Get room access details including token
 */
export const getRoomAccessDetails = async (
  roomName: string, 
  identity = `user-${uuidv4().substring(0, 8)}`
) => {
  const token = await generateTwilioToken(identity, roomName);
  
  return {
    token,
    identity,
    roomName
  };
};
