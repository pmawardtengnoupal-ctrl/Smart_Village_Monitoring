import { createClient } from '@supabase/supabase-js';
import type { Role, ContextView, ProfileRow } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

/* ---------- Auth ---------- */
export async function signInWithEmail(email: string, password: string, captcha?: string) {
  if (!email || !password) throw new Error('Email and password required');
  const { error } = await supabase.auth.signInWithPassword({
    email, password,
    options: { captchaToken: captcha },
  });
  if (error) throw error;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  captcha?: string,
  departmentCode?: string
) {
  if (!email || !password || !fullName) throw new Error('Full name, email and password are required');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        requested_department_code: departmentCode || null,
      },
      captchaToken: captcha,
      emailRedirectTo: typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined,
    },
  });
  if (error) throw error;

  // Optional: queue dept join request client-side (kept from your flow)
  if (departmentCode && data.user?.id) {
    await supabase.from('validation_queue').insert({
      entity: 'department_membership_request',
      status: 'PENDING',
      proposed_changes: { user_id: data.user.id, department_code: departmentCode },
      source: 'SELF_SIGNUP',
    }).throwOnError();
  }
}

export async function requestResetLink(email: string) {
  if (!email) throw new Error('Email required');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset` : undefined,
  });
  if (error) throw error;
}

export async function setNewPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/* ---------- Profile & Landing ---------- */
export async function getProfile(): Promise<ProfileRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return data as any;
}

export function landingForRole(role: Role): string {
  const map: Record<Role, string> = {
    SUPER_ADMIN: '/dashboard/super-admin/home',
    DC: '/dashboard/dc/home',
    ADC: '/dashboard/adc-sdo-sdc/home',
    SDO: '/dashboard/adc-sdo-sdc/home',
    SDC: '/dashboard/adc-sdo-sdc/home',
    BLOCK_OFFICER: '/dashboard/block/home',
    DEPARTMENT_OFFICER: '/dashboard/department-officer/home',
    VILLAGE_HEAD: '/dashboard/village-head/home',
    SURVEY_OFFICER: '/dashboard/survey-officer/tasks',
    PUBLIC: '/public',
  };
  return map[role] || '/public';
}

/* ---------- Context (dept memberships shown as options) ---------- */
export async function getAvailableContexts(): Promise<ContextView[]> {
  const p = await getProfile();
  const out: ContextView[] = [];
  if (p?.role) {
    out.push({
      type: 'base',
      label: p.role,
      role: p.role,
      scope_district_code: p.scope_district_code ?? null,
      scope_block_code: p.scope_block_code ?? null,
    });
  }
  const { data: dm } = await supabase
    .from('department_members')
    .select('department_code, dept_role, scope_district_code, scope_block_code')
    .eq('user_id', p?.id || '00000000-0000-0000-0000-000000000000');

  (dm || []).forEach((m) => {
    out.push({
      type: 'department',
      label: `Dept ${m.department_code} (${m.dept_role})`,
      role: 'DEPARTMENT_OFFICER',
      department_code: m.department_code,
      dept_role: m.dept_role,
      scope_district_code: m.scope_district_code,
      scope_block_code: m.scope_block_code,
    } as any);
  });

  return out;
}

export async function setActiveContext(ctx: ContextView): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('active_context', JSON.stringify(ctx));
  }
}
