import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password, userType) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType // 'tourist' or 'guide'
      }
    }
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    // If no session found, don't treat as an error, just return null user
    if (error && error.name === 'AuthSessionMissingError') {
      return { data: { user: null }, error: null };
    }
    
    return { data, error };
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return { data: { user: null }, error: err };
  }
};

// Database functions
export const fetchTouristSpots = async () => {
  const { data, error } = await supabase
    .from('tourist_spots')
    .select('*')
    .limit(10);
  return { data, error };
};

export const fetchHotels = async () => {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .limit(10);
  return { data, error };
};

export const fetchRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .limit(10);
  return { data, error };
};

export const fetchTourGuides = async () => {
  const { data, error } = await supabase
    .from('tour_guides')
    .select('*')
    .eq('verified', true);
  return { data, error };
};

export const createTourGuideProfile = async (profile) => {
  const { data, error } = await supabase
    .from('tour_guides')
    .insert([profile]);
  return { data, error };
};

export const uploadImage = async (bucket, filePath, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);
  return { data, error };
};
