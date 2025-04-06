
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export interface PaystackSubscriptionPlan {
  id: string;
  name: string;
  planCode: string;
  amount: number;
  interval: "monthly" | "biannual" | "annually";
  features: string[];
}

// Paystack plans (replace planCodes with your actual Paystack plan codes)
export const PAYSTACK_PLANS: PaystackSubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    planCode: "PLN_monthly", // Replace with your actual Paystack plan code
    amount: 300000, // 3000 Naira (in kobo)
    interval: "monthly",
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
    planCode: "PLN_biannual", // Replace with your actual Paystack plan code
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
    planCode: "PLN_annual", // Replace with your actual Paystack plan code
    amount: 3500000, // 35,000 Naira (in kobo)
    interval: "annually",
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
  amount: number;
  duration: string;
  description: string;
}

export const BOOST_OPTIONS: BoostOption[] = [
  {
    id: "1hour",
    name: "Quick Boost",
    duration: "1 hour",
    amount: 300,
    description: "Increase your profile visibility for 1 hour"
  },
  {
    id: "3hours",
    name: "Super Boost",
    duration: "3 hours",
    amount: 500,
    description: "Increase your profile visibility for 3 hours"
  },
  {
    id: "24hours",
    name: "Mega Boost",
    duration: "24 hours",
    amount: 700,
    description: "Increase your profile visibility for 24 hours"
  }
];

// Create a subscription checkout session
export const createSubscriptionCheckout = async (planId: string, redirectUrl?: string) => {
  const plan = PAYSTACK_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error("Invalid plan selected");
  }

  const { data, error } = await supabase.functions.invoke("paystack-checkout", {
    body: { planCode: plan.planCode, plan: planId, redirectUrl }
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
