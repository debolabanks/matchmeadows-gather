
import { Session } from "@supabase/supabase-js";

/**
 * Validates a Supabase session
 * @param session The session object to validate
 * @returns True if the session is valid, false otherwise
 */
export const validateSession = (session: Session | null): boolean => {
  if (!session) return false;
  
  // Check if session has expired
  const now = new Date();
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
  
  if (expiresAt && now > expiresAt) {
    console.warn("Session has expired");
    return false;
  }
  
  // Check if session has required properties
  if (!session.user || !session.access_token) {
    console.warn("Invalid session structure");
    return false;
  }
  
  return true;
};

/**
 * Redirect user to login page with an optional message
 */
export const redirectToLogin = (message?: string) => {
  if (message) {
    sessionStorage.setItem("auth_error_message", message);
  }
  window.location.href = "/sign-in";
};

/**
 * Logs out user and cleans up session data
 */
export const logoutUser = async () => {
  try {
    // Clean up local storage items
    localStorage.removeItem("matchmeadows_user");
    
    // We're not calling supabase.auth.signOut() here since that
    // will be handled by the auth provider when redirecting
    
    console.info("User logged out due to invalid session");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
