import { supabase } from '@data/supabaseClient'

export type DeptInfo = {
  code: string
  name: string
  level: 'STATE' | 'DISTRICT' | 'BLOCK'
}

/** Lookup department meta by code (PWD, HEALTH, etc.) */
export async function lookupDepartmentByCode(code: string): Promise<DeptInfo | null> {
  const c = (code || '').trim().toUpperCase()
  if (!c) return null
  const { data, error } = await supabase
    .from('departments')
    .select('code,name,level')
    .eq('code', c)
    .maybeSingle()
  if (error) throw error
  return data as DeptInfo | null
}

/**
 * Create a pending department membership request.
 * This inserts a validation_queue item with entity = 'department_membership_request'.
 * DC / Dept Admin will approve and the handler will add a row to department_members.
 */
export async function createDeptJoinRequest(payload: {
  department_code?: string | null
  requested_role: 'DEPARTMENT_OFFICER' | 'BLOCK_OFFICER' | 'SURVEY_OFFICER' | 'VILLAGE_HEAD'
  scope_district_code?: string | null
  scope_block_code?: string | null
}) {
  const { data: ures, error: uerr } = await supabase.auth.getUser()
  if (uerr) throw uerr
  const user = ures?.user
  if (!user) throw new Error('Not authenticated')

  const proposed = {
    user_id: user.id,
    department_code: payload.department_code ?? null,
    requested_role: payload.requested_role,
    scope_district_code: payload.scope_district_code ?? null,
    scope_block_code: payload.scope_block_code ?? null,
    source: 'SELF_SIGNUP'
  }

  const { error } = await supabase.from('validation_queue').insert({
    entity: 'department_membership_request',
    proposed_changes: proposed,
    status: 'PENDING',
    scope_district_code: payload.scope_district_code ?? null,
    scope_block_code: payload.scope_block_code ?? null,
    submitted_by: user.id
  })
  if (error) throw error
  return true
}
