'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@data/supabaseClient'

export function useRoleGuard(roles: string[]) {
  const router = useRouter()
  useEffect(()=>{
    let active = true
    ;(async ()=>{
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      if (!user) { router.push('/public/home'); return }
      // Fetch profile.role
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const role = prof?.role ?? 'PUBLIC'
      if (!roles.includes(role)) router.push('/public/home')
    })()
    return ()=>{ active=false }
  },[router, roles.join('|')])
}
