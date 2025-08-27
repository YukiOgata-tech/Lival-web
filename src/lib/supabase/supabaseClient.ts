// src/lib/supabase/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'
// import app from '@/lib/firebase'
import {auth} from '@/lib/firebase'
import { onIdTokenChanged } from 'firebase/auth'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


// Create a singleton Supabase client for the browser
// ⬇️ “accessToken” に Firebase IDトークンを渡す（正式手順）
export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
  accessToken: async () => {
    const u = auth.currentUser
    return u ? await u.getIdToken(/* forceRefresh */ false) : null
  },
  global: { headers: { 'x-client-info': 'study-web' } },
})

// Realtime を使う場合はトークン更新時に再バインド
onIdTokenChanged(auth, async (u) => {
  const token = u ? await u.getIdToken(false) : null
  await supabase.realtime.setAuth(token ?? '')
})