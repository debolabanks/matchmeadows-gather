
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
    const { planCode, plan, redirectUrl } = await req.json();
    
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
    
    // Initialize Paystack API request
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key is not configured");
    }
    
    // Prepare the response URL
    const successUrl = `${redirectUrl || req.headers.get("origin")}/subscription?success=true&plan=${plan}`;
    const cancelUrl = `${redirectUrl || req.headers.get("origin")}/subscription?canceled=true`;
    
    // Create initialization request to Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: getAmountForPlan(plan), // Amount in kobo (smallest currency unit)
        plan: planCode,
        callback_url: successUrl,
        metadata: {
          userId: user.id,
          plan: plan,
          cancel_url: cancelUrl,
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
    console.error("Paystack checkout error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to get amount for plan
function getAmountForPlan(planId: string): number {
  switch (planId) {
    case "monthly":
      return 99900; // 999 * 100 (convert to kobo)
    case "biannual":
      return 559900; // 5599 * 100
    case "annual":
      return 1000000; // 10000 * 100
    default:
      return 99900;
  }
}
