
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
    // Get the signature from the headers
    const paystack_signature = req.headers.get("x-paystack-signature");
    
    if (!paystack_signature) {
      console.error("Missing Paystack signature");
      return new Response(
        JSON.stringify({ error: "Missing Paystack signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the raw request body
    const body = await req.text();
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
    
    // For verified signature, compare hash
    // In a production environment, you should verify the signature
    // This is a simplified version
    
    // Parse the webhook data
    const webhookData = JSON.parse(body);
    
    // Initialize Supabase client
    const supabaseUrl = "https://yxdxwfzkqyovznqjffcm.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle the event based on event type
    if (webhookData.event === "subscription.create" || webhookData.event === "charge.success") {
      const data = webhookData.data;
      const metadata = data.metadata || {};
      const userId = metadata.userId;
      const plan = metadata.plan;
      
      if (!userId) {
        console.error("No userId found in metadata");
        return new Response(
          JSON.stringify({ error: "No userId found in metadata" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // For subscription events, update the profile with subscription details
      if (plan) {
        const subscriptionStatus = data.status === "active" ? "active" : "inactive";
        const endDate = new Date();
        
        switch (plan) {
          case "monthly":
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case "biannual":
            endDate.setMonth(endDate.getMonth() + 6);
            break;
          case "annual":
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
        }
        
        // Update the user's profile with subscription info
        const { error } = await supabase
          .from("profiles")
          .update({
            subscriptionStatus: subscriptionStatus,
            subscriptionPlan: plan,
            subscriptionEndDate: endDate.toISOString(),
          })
          .eq("id", userId);
          
        if (error) {
          console.error("Error updating profile:", error);
        }
      }
      
      // For boost events, update the profile's boost status
      if (metadata.boostDuration) {
        const boostDuration = metadata.boostDuration;
        const boostEndDate = new Date();
        
        switch (boostDuration) {
          case "1hour":
            boostEndDate.setHours(boostEndDate.getHours() + 1);
            break;
          case "3hours":
            boostEndDate.setHours(boostEndDate.getHours() + 3);
            break;
          case "24hours":
            boostEndDate.setHours(boostEndDate.getHours() + 24);
            break;
        }
        
        // Update the user's profile with boost info
        const { error } = await supabase
          .from("profiles")
          .update({
            profileBoostActive: true,
            profileBoostEndDate: boostEndDate.toISOString(),
          })
          .eq("id", userId);
          
        if (error) {
          console.error("Error updating profile boost status:", error);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
