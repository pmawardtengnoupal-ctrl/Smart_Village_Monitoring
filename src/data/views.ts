// src/data/views.ts
import { supabase } from '@data/supabaseClient';

/** Public snapshot KPI shape (district-wide rollup) */
export type BadgeKPI = {
  villages: number;
  completed: number;
  inprog: number;
  pipeline: number;
  avgGap: number;
};

export type VillageRow = {
  village_code: string;
  name: string;
  block_code: string | null;
  district_code: string | null;
  population: number | null;
  lat?: number | null;
  lng?: number | null;
};

export type SchemeListItem = {
  code: string;
  name: string;
  /** nullable in DB → keep nullable here to be accurate */
  updated_at: string | null;
};

export type SchemeCoverageRow = {
  scheme_code: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'APPLIED' | 'APPROVED' | string;
  beneficiaries_count: number | null;
  last_update_at: string | null;
};

export type SchemeDetail = {
  code: string;
  name: string;
  department_code: string | null;
  description_short: string | null;
  eligibility: any;           // JSON (object/array)
  documents_required: any;    // JSON (object/array)
  updated_at: string | null;
};

export const PublicData = {
  /** District snapshot KPIs (falls back gracefully if mv_kpi_district isn’t present). */
  async badges(): Promise<BadgeKPI> {
    try {
      const { data, error } = await supabase
        .from('mv_kpi_district')
        .select('villages,completed,inprog,pipeline,avg_gap')
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return { villages: 0, completed: 0, inprog: 0, pipeline: 0, avgGap: 0 };
      }
      return {
        villages: Number(data.villages ?? 0),
        completed: Number(data.completed ?? 0),
        inprog: Number(data.inprog ?? 0),
        pipeline: Number(data.pipeline ?? 0),
        avgGap: Number(data.avg_gap ?? 0),
      };
    } catch {
      return { villages: 0, completed: 0, inprog: 0, pipeline: 0, avgGap: 0 };
    }
  },

  /** Latest schemes visible to the public (schemes_registry). */
  async newPublicSchemes(limit = 6): Promise<SchemeListItem[]> {
    try {
      const { data, error } = await supabase
        .from('schemes_registry')
        .select('scheme_code,name,updated_at')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data.map((r: { scheme_code: string; name: string; updated_at: string | null }) => ({
        code: r.scheme_code,
        name: r.name,
        updated_at: r.updated_at ?? null,
      }));
    } catch {
      return [];
    }
  },

  /** Search/list villages (server-side filter by name if provided). */
  async listVillages(search = '', limit = 50): Promise<VillageRow[]> {
    try {
      let q = supabase
        .from('villages')
        .select('village_code,name,block_code,district_code,population,lat,lng')
        .limit(limit);

      if (search?.trim()) q = q.ilike('name', `%${search.trim()}%`);
      const { data, error } = await q;

      if (error || !data) return [];
      return data as VillageRow[];
    } catch {
      return [];
    }
  },

  /** A single village profile. */
  async villageProfile(village_code: string): Promise<VillageRow | null> {
    try {
      const { data, error } = await supabase
        .from('villages')
        .select('village_code,name,block_code,district_code,population,lat,lng')
        .eq('village_code', village_code)
        .maybeSingle();

      if (error) return null;
      return (data as VillageRow) ?? null;
    } catch {
      return null;
    }
  },

  /** Scheme coverage rows for a village. */
  async schemeCoverageByVillage(village_code: string): Promise<SchemeCoverageRow[]> {
    try {
      const { data, error } = await supabase
        .from('scheme_status_by_village')
        .select('scheme_code,status,beneficiaries_count,last_update_at')
        .eq('village_code', village_code)
        .order('last_update_at', { ascending: false });

      if (error || !data) return [];
      return data as SchemeCoverageRow[];
    } catch {
      return [];
    }
  },

  /** Full scheme detail for public view. */
  async schemeDetail(scheme_code: string): Promise<SchemeDetail | null> {
    try {
      const { data, error } = await supabase
        .from('schemes_registry')
        .select(
          'scheme_code,name,department_code,description_short,eligibility,documents_required,updated_at'
        )
        .eq('scheme_code', scheme_code)
        .maybeSingle();

      if (error || !data) return null;
      return {
        code: data.scheme_code as string,
        name: data.name as string,
        department_code: (data.department_code as string) ?? null,
        description_short: (data.description_short as string) ?? null,
        eligibility: data.eligibility ?? null,
        documents_required: data.documents_required ?? null,
        updated_at: (data.updated_at as string) ?? null,
      };
    } catch {
      return null;
    }
  },
};
