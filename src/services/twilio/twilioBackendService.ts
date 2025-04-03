
import { v4 as uuidv4 } from 'uuid';

// In a real application, this would be your deployed backend API URL
const BACKEND_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api/twilio' 
  : 'http://localhost:3001/api/twilio';

/**
 * Get a Twilio token from the backend server
 */
export const getTwilioTokenFromBackend = async (identity: string, roomName: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identity, roomName }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Twilio token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching Twilio token from backend:', error);
    
    // For development fallback - in production, you would want to handle this error differently
    console.warn("Using demo token because backend request failed");
    return `demo-token-${uuidv4()}`;
  }
};

/**
 * Join a room using backend-generated token
 */
export const getRoomAccessDetailsFromBackend = async (
  roomName: string, 
  identity = `user-${uuidv4().substring(0, 8)}`
) => {
  try {
    const token = await getTwilioTokenFromBackend(identity, roomName);
    
    return {
      token,
      identity,
      roomName
    };
  } catch (error) {
    console.error("Error getting room access details from backend:", error);
    throw new Error("Failed to access room through backend service");
  }
};
