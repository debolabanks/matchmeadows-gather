import { supabase } from "@/integrations/supabase/client";
import { User, UserProfile } from "@/types/user";

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
  
  console.log("Successful auth from Supabase:", data);
  
  // Get user profile data - handle with try/catch to avoid type errors
  let profileData = null;
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      console.log("Profile data retrieved:", profile);
      profileData = profile;
    }
  } catch (err) {
    console.error("Exception fetching profile:", err);
  }
  
  // If profile is null, let's try to create it
  if (!profileData) {
    try {
      console.log("No profile found, attempting to create one for user:", data.user.id);
      
      // Create a minimal profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || '',
            username: data.user.email?.split('@')[0] || ''
          }
        ])
        .select('*')
        .maybeSingle();
      
      if (insertError) {
        console.error("Failed to create profile:", insertError);
      } else {
        console.log("Created new profile:", newProfile);
        profileData = newProfile;
      }
    } catch (createErr) {
      console.error("Exception creating profile:", createErr);
    }
  }
  
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
      subscriptionStatus: isPremiumTestUser ? "active" : (profileData as any)?.subscriptionStatus || "none",
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
  // Try to update profile in Supabase, but handle errors gracefully
  let updatedProfile = null;
  
  try {
    // Create update object with only the fields we know are in the profiles table
    const updateObj: any = {
      updated_at: new Date().toISOString()
    };
    
    // Only add fields that are definitely in the table
    if (profileData.bio !== undefined) updateObj.bio = profileData.bio;
    if (profileData.location !== undefined) updateObj.location = profileData.location;
    
    await supabase
      .from('profiles')
      .update(updateObj)
      .eq('id', userId);
    
    // Get the updated profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    updatedProfile = profile;
  } catch (err) {
    console.error("Error updating profile:", err);
    // Continue with what we have - don't break the app flow
  }
  
  // Get the user data
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Error fetching updated user:", userError);
    throw new Error(userError?.message || "Failed to fetch updated user");
  }
  
  // Return the updated user with our app's User format
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
  // Try to update profile in Supabase
  try {
    await supabase
      .from('profiles')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
  } catch (err) {
    console.error("Error requesting verification:", err);
    // Continue without breaking the flow
  }
  
  // Get the user data
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Error fetching user:", userError);
    throw new Error(userError?.message || "Failed to fetch user");
  }
  
  // Get the profile - handle gracefully if it fails
  let profile = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    profile = data;
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
  
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
