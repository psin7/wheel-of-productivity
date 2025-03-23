import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings -> API
const supabaseUrl = 'https://wyezgznwlaxzzylddgqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5ZXpnem53bGF4enp5bGRkZ3FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NjExNDQsImV4cCI6MjA1ODMzNzE0NH0.DU2dGh_czPMXdynWhfF2kZK8eLhvjDEn2l07-5PUf-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// IMPORTANT: Replace the above URL and key with your actual Supabase project credentials
// from the Supabase dashboard -> Settings -> API
