import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Supabase Schema Recommendation:

Table: videos
- id: uuid (primary key)
- topic: text
- hook: text
- script: jsonb (scenes: {start, end, text, keywords, assets: []}[])
- metadata: jsonb (titles, description, hashtags)
- created_at: timestamp with time zone (default: now())
*/
