
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export interface StripeSubscriptionPlan {
  id: string;
  name: string;
  priceId: string;
  amount: number;
  interval: "month" | "biannual" | "year";
  features: string[];
}

// Stripe product and price IDs (replace these with your actual Stripe product and price IDs)
export const STRIPE_PLANS: StripeSubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    priceId: "price_monthly", // Replace with your actual Stripe price ID
    amount: 300000, // 3,000 Naira (in kobo)
    interval: "month",
    features: [
      "Go Live Streaming",
      "Ad-free browsing",
      "Priority matching",
      "Exclusive features"
    ]
  },
  {
    id: "biannual",
    name: "Bi-Annual",
    priceId: "price_biannual", // Replace with your actual Stripe price ID
    amount: 1750000, // 17,500 Naira (in kobo)
    interval: "biannual",
    features: [
      "Go Live Streaming",
      "Ad-free browsing",
      "Priority matching",
      "Exclusive features",
      "Profile highlighting"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    priceId: "price_annual", // Replace with your actual Stripe price ID
    amount: 3500000, // 35,000 Naira (in kobo)
    interval: "year",
    features: [
      "Go Live Streaming",
      "Ad-free browsing",
      "Priority matching",
      "Exclusive features",
      "Profile highlighting",
      "Advanced analytics"
    ]
  }
];

export interface BoostOption {
  id: string;
  name: string;
  priceId: string;
  duration: string;
  amount: number;
  description: string;
}

export const BOOST_OPTIONS: BoostOption[] = [
  {
    id: "1hour",
    name: "Quick Boost",
    priceId: "price_boost_1hour", // Replace with your actual Stripe price ID
    duration: "1 hour",
    amount: 299,
    description: "Increase your profile visibility for 1 hour"
  },
  {
    id: "3hours",
    name: "Super Boost",
    priceId: "price_boost_3hours", // Replace with your actual Stripe price ID
    duration: "3 hours",
    amount: 499,
    description: "Increase your profile visibility for 3 hours"
  },
  {
    id: "24hours",
    name: "Mega Boost",
    priceId: "price_boost_24hours", // Replace with your actual Stripe price ID
    duration: "24 hours",
    amount: 999,
    description: "Increase your profile visibility for 24 hours"
  }
];

// Create a subscription checkout session
export const createSubscriptionCheckout = async (planId: string, redirectUrl?: string) => {
  const plan = STRIPE_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error("Invalid plan selected");
  }

  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: { priceId: plan.priceId, plan: planId, redirectUrl }
  });

  if (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }

  return data;
};

// Create a boost checkout session
export const createBoostCheckout = async (boostDuration: string) => {
  const { data, error } = await supabase.functions.invoke("boost-profile", {
    body: { boostDuration }
  });

  if (error) {
    console.error("Error creating boost checkout session:", error);
    throw error;
  }

  return data;
};

// Check subscription status
export const checkSubscription = async (): Promise<SubscriptionStatus> => {
  const { data, error } = await supabase.functions.invoke("check-subscription");

  if (error) {
    console.error("Error checking subscription:", error);
    return { isSubscribed: false, plan: null, expiresAt: null };
  }

  return data as SubscriptionStatus;
};
