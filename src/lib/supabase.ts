import { createClient } from '@supabase/supabase-js';

// URL validation helper to ensure only valid HTTP or HTTPS URLs are initiated
function isValidHttpUrl(stringVal: string) {
  try {
    const url = new URL(stringVal);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Get target environment configuration keys with standard Vite syntax
// Vite's build process relies on static replacement of import.meta.env property references
const getSupabaseKeys = () => {
  let url = ((import.meta as any).env?.VITE_SUPABASE_URL || '').toString().trim();
  let key = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '').toString().trim();

  // If URL is invalid, or looks like placeholder, use fallback
  if (!url || url === 'undefined' || url === 'null' || url.includes('your-project-id') || !isValidHttpUrl(url)) {
    url = 'https://lxkjafioaupbqyyayryh.supabase.co';
  }

  // If Key is invalid, or looks like placeholder, use fallback
  if (!key || key === 'undefined' || key === 'null' || key.includes('your-supabase') || key.length < 20) {
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a2phZmlvYXVwYnF5eWF5cnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NjksImV4cCI6MjA5NjMxOTU2OX0.Kug_CdteApNBKvwTop2tkfD7WZWvkdwso2pMydYVYsU';
  }

  // Sanitize the URL to remove /rest/v1/ if appended, since createClient expects the base URL to route Auth properly
  url = url.replace(/\/rest\/v1\/?$/, '').trim();

  return { supabaseUrl: url, supabaseAnonKey: key };
};

const { supabaseUrl, supabaseAnonKey } = getSupabaseKeys();

console.log('[Seaflows Diagnostics] Initializing Supabase Connection with URL:', supabaseUrl);


// Check if variables are missing and warn in the UI instead of crashing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing! ' +
    'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.'
  );
}

// Initialize Supabase Client with persistent session handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// High-level Auth action helpers
export const supabaseAuth = {
  signUp: async (email: string, passwordHash: string, fullName: string, role: string = 'customer') => {
    return await supabase.auth.signUp({
      email,
      password: passwordHash,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
  },

  signIn: async (email: string, passwordHash: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password: passwordHash,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Retrieve corresponding role-based profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { ...user, profile };
  },
};
