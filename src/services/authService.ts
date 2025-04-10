import { supabase } from "@/integrations/supabase/client";
import { User, UserProfile } from "@/contexts/authTypes";

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error("Error signing in:", error);
    
    // Handle specific error codes
    if (error.message === "Email not confirmed") {
      throw new Error("Please check your email to confirm your account before signing in.");
    }
    
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error("No user returned from Supabase");
  }
  
  // Get user profile data
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  // Check if the user is the test premium user
  const isPremiumTestUser = email.toLowerCase() === "adebolabanjoko@gmail.com";
  
  // Convert Supabase user to our app's User format
  return {
    id: data.user.id,
    name: profileData?.full_name || data.user.user_metadata?.full_name || "",
    email: data.user.email || "",
    provider: "email",
    profile: {
      bio: profileData?.bio,
      location: profileData?.location,
      // Set premium status for the test user
      subscriptionStatus: isPremiumTestUser ? "active" : profileData?.subscriptionStatus || "none",
      // Map other profile fields as needed
    }
  };
};

export const signUpWithEmailAndPassword = async (email: string, password: string, name: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });
  
  if (error) {
    console.error("Error signing up:", error);
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error("No user returned from Supabase");
  }
  
  // Convert Supabase user to our app's User format
  return {
    id: data.user.id,
    name: name,
    email: data.user.email || "",
    provider: "email",
    profile: {
      // Default profile values for new users
    }
  };
};

export const resetPassword = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) {
    console.error("Error resetting password:", error);
    throw new Error(error.message);
  }
};

export const confirmPasswordReset = async (email: string, newPassword: string): Promise<void> => {
  // Note: In Supabase, password reset confirmation happens on the client side
  // The user receives a link with a token, and we use that token to update the password
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    console.error("Error confirming password reset:", error);
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<User> => {
  // First update the profile in Supabase
  const { error } = await supabase
    .from('profiles')
    .update({
      bio: profileData.bio,
      location: profileData.location,
      updated_at: new Date().toISOString(),
      // Map other profile fields as needed
    })
    .eq('id', userId);
  
  if (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.message);
  }
  
  // Get the updated user data
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Error fetching updated user:", userError);
    throw new Error(userError?.message || "Failed to fetch updated user");
  }
  
  // Get the updated profile
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  // Return the updated user in our app's User format
  return {
    id: userData.user.id,
    name: updatedProfile?.full_name || userData.user.user_metadata?.full_name || "",
    email: userData.user.email || "",
    provider: "email",
    profile: {
      ...profileData,
      // Include other existing profile data that wasn't updated
    }
  };
};

export const requestVerification = async (userId: string): Promise<User> => {
  // In a real app, this would handle custom verification logic
  // For now, we'll just update the profile to indicate verification is pending
  const { error } = await supabase
    .from('profiles')
    .update({
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error("Error requesting verification:", error);
    throw new Error(error.message);
  }
  
  // Get the user data
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "Failed to fetch user");
  }
  
  // Get the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  // Return the user in our app's User format
  return {
    id: userData.user.id,
    name: profile?.full_name || userData.user.user_metadata?.full_name || "",
    email: userData.user.email || "",
    provider: "email",
    profile: {
      verificationStatus: "pending",
      // Include other existing profile data
    }
  };
};
