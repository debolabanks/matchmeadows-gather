
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yxdxwfzkqyovznqjffcm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4ZHh3ZnprcXlvdnpucWpmZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAyOTQsImV4cCI6MjA1OTI5NjI5NH0.sjSfb1r83h7jN-gXfQCOamYmLI5Gxuf3iP6pLaedT-4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true
  }
});
