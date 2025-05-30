
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with the auth context of the request
    const supabaseUrl = "https://yxdxwfzkqyovznqjffcm.supabase.co";
    const supabaseKey = req.headers.get("apikey") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          error: "Missing authorization header",
          isSubscribed: false, 
          plan: null, 
          expiresAt: null,
          inFreeTrial: false,
          freeTrialEndDate: null 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized", 
          isSubscribed: false, 
          plan: null, 
          expiresAt: null,
          inFreeTrial: false,
          freeTrialEndDate: null 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("User authenticated:", user.id);
    
    // Get user profile to check for free trial
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('trialStartDate')
      .eq('id', user.id)
      .single();
    
    let inFreeTrial = false;
    let freeTrialEndDate = null;
    
    if (profile?.trialStartDate) {
      const trialStartDate = new Date(profile.trialStartDate);
      const trialEndDate = new Date(trialStartDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const now = new Date();
      
      if (now < trialEndDate) {
        inFreeTrial = true;
        freeTrialEndDate = trialEndDate.toISOString();
      }
    }
    
    // Query the database to check subscription status
    // TODO: Replace this with actual subscription checking logic
    // For now, just return a mock response including free trial info
    
    return new Response(
      JSON.stringify({
        isSubscribed: false, 
        plan: null, 
        expiresAt: null,
        inFreeTrial,
        freeTrialEndDate
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Check subscription error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isSubscribed: false, 
        plan: null, 
        expiresAt: null,
        inFreeTrial: false,
        freeTrialEndDate: null 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
