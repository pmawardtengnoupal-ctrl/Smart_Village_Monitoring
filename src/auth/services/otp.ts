import { supabase } from '@data/supabaseClient'

// send OTP to email (returns true if sent)
export async function sendEmailOtp(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: undefined }
  })
  if (error) throw error
  return true
}

// verify OTP; type 'email' works for sign up verification too
export async function verifyEmailOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ type: 'email', email, token })
  if (error) throw error
  return data
}
