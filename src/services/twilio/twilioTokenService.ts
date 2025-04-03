
import { v4 as uuidv4 } from 'uuid';
import { twilioConfig } from '@/config/twilioConfig';
import { getTwilioTokenFromBackend } from './twilioBackendService';

/**
 * In a real production application, this token would be generated on the server
 * to keep your Twilio credentials secure. This file provides both client-side
 * and server-integrated implementations.
 */

// Environmental variables for Twilio credentials (using config for development)
const TWILIO_ACCOUNT_SID = twilioConfig.accountSid;
const TWILIO_API_KEY = twilioConfig.apiKey;
const TWILIO_API_SECRET = twilioConfig.apiSecret;

// Flag to determine if we should use the backend service
const USE_BACKEND_SERVICE = twilioConfig.useBackendService || false;

/**
 * Generate a Twilio access token
 * This will use the backend service if configured, otherwise it falls back to
 * the demo token for development purposes
 */
export const generateTwilioToken = async (identity: string, roomName: string): Promise<string> => {
  // If backend service is enabled, use it
  if (USE_BACKEND_SERVICE) {
    console.log("Using backend service for Twilio token generation");
    return getTwilioTokenFromBackend(identity, roomName);
  }
  
  // For development or demo mode without backend
  // Check if we have the credentials
  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET) {
    console.warn("Twilio credentials not found. Using mock token for demonstration.");
    return `demo-token-${uuidv4()}`;
  }

  try {
    // This would normally make an API call to a backend
    // Since we don't have a backend set up yet, we return a demo token
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
