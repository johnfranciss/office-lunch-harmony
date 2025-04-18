
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://puxogdlmyvuhncnfypjz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eG9nZGxteXZ1aG5jbmZ5cGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTYzMjcsImV4cCI6MjA2MDQ5MjMyN30.qOE9CcAjqQeMrWtUY7tWRvO5fXVJHnd3sZoPMb9qrSE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
