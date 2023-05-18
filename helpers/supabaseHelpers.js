// bunch of helper methods to deal with supabase

// creates supabase client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// to refresh user session to prevent being logged out on reload
// also returns user
async function refreshSession(supabase){
  let refresh_token = localStorage.refreshToken;
  const { data, error } = await supabase.auth.refreshSession({refresh_token });
  if(data.user){
    localStorage.refreshToken = data.session.refresh_token;
  }
  const {user} = data;
  return user;
}

// Function to pull from supabase user profile
async function getUserProfileData(supabase){
  const {data, error} = await supabase.from('profiles')
                                  .select("*"); //With RLS should only get user own data
  return(data[0]);
};
export {supabase, refreshSession, getUserProfileData};