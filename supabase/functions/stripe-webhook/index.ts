
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0";
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
    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-08-16",
    });
    
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      console.error("Missing Stripe signature");
      return new Response(
        JSON.stringify({ error: "Missing Stripe signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    let event;
    try {
      // You'll need to set up a webhook secret in the Stripe dashboard and add it to your Edge Function secrets
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = "https://yxdxwfzkqyovznqjffcm.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the Stripe customer
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        
        // Get the user ID from the customer metadata
        const userId = customer.metadata.userId || 
                        (subscription.metadata && subscription.metadata.userId);
                        
        if (!userId) {
          console.error("No userId found in metadata");
          break;
        }
        
        // Get the subscription status
        const status = subscription.status;
        const planId = subscription.items.data[0].price.id;
        const subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Map to subscription plan based on the price ID
        let subscriptionPlan = "monthly";
        if (planId.includes("biannual")) {
          subscriptionPlan = "biannual";
        } else if (planId.includes("annual")) {
          subscriptionPlan = "annual";
        }
        
        // Update the user's profile with subscription info
        const { error } = await supabase
          .from("profiles")
          .update({
            subscriptionStatus: status === "active" ? "active" : "expired",
            subscriptionPlan: status === "active" ? subscriptionPlan : null,
            subscriptionEndDate: status === "active" ? subscriptionEndDate : null,
          })
          .eq("id", userId);
          
        if (error) {
          console.error("Error updating profile:", error);
        }
        break;
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedCustomerId = deletedSubscription.customer;
        
        // Get the customer
        const deletedCustomer = await stripe.customers.retrieve(deletedCustomerId);
        if (deletedCustomer.deleted) break;
        
        // Get user ID from metadata
        const deletedUserId = deletedCustomer.metadata.userId || 
                               (deletedSubscription.metadata && deletedSubscription.metadata.userId);
                               
        if (!deletedUserId) {
          console.error("No userId found in metadata for deleted subscription");
          break;
        }
        
        // Update the profile to remove subscription info
        const { error: deleteError } = await supabase
          .from("profiles")
          .update({
            subscriptionStatus: "expired",
            subscriptionPlan: null,
            subscriptionEndDate: null,
          })
          .eq("id", deletedUserId);
          
        if (deleteError) {
          console.error("Error updating profile after subscription deletion:", deleteError);
        }
        break;
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
