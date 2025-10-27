// src/features/ai/intents/applyScheme.ts
import { supabase } from '@data/supabaseClient';

export async function applySchemeForHousehold(household_id: string, scheme_code: string, payload?: any) {
  // Example write to staging or direct (depending on your pipeline)
  const { error } = await supabase
    .from('staging_changes')
    .insert({
      entity_type: 'household_scheme_benefits',
      payload: {
        household_id,
        scheme_code,
        ...payload
      },
      source: 'AI_INTENT'
    });
  if (error) throw error;
  return { ok: true };
}
