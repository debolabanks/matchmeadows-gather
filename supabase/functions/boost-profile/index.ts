
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
    // Get boost details from request
    const { boostDuration } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = "https://yxdxwfzkqyovznqjffcm.supabase.co";
    const supabaseKey = req.headers.get("apikey") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Extract the JWT token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Paystack
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key is not configured");
    }
    
    // Get amount based on boost duration
    const amount = getAmountForBoost(boostDuration);
    const duration = getDurationLabel(boostDuration);
    
    // Create initialization request to Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        callback_url: `${req.headers.get("origin")}/profile?boost_success=true&duration=${duration}`,
        metadata: {
          userId: user.id,
          boostDuration: boostDuration,
          cancel_url: `${req.headers.get("origin")}/profile?boost_canceled=true`
        },
      }),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Paystack API error:", responseData);
      throw new Error(responseData.message || "Failed to initialize Paystack transaction");
    }
    
    return new Response(
      JSON.stringify({ 
        authorizationUrl: responseData.data.authorization_url,
        reference: responseData.data.reference
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Boost profile error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to get amount for boost in kobo (smallest currency unit)
function getAmountForBoost(boostDuration: string): number {
  switch (boostDuration) {
    case "1hour":
      return 30000; // 300 * 100
    case "3hours":
      return 50000; // 500 * 100
    case "24hours":
      return 70000; // 700 * 100
    default:
      return 30000;
  }
}

// Helper function to get human-readable duration
function getDurationLabel(boostDuration: string): string {
  switch (boostDuration) {
    case "1hour":
      return "1 hour";
    case "3hours":
      return "3 hours";
    case "24hours":
      return "24 hours";
    default:
      return "1 hour";
  }
}
