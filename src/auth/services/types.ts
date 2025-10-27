export type Role =
  | 'SUPER_ADMIN' | 'DC' | 'ADC' | 'SDO' | 'SDC'
  | 'BLOCK_OFFICER' | 'DEPARTMENT_OFFICER'
  | 'VILLAGE_HEAD' | 'SURVEY_OFFICER'
  | 'PUBLIC';

export type ContextBase = {
  type: 'base';
  label: Role;
  role: Role;
  scope_district_code: string | null;
  scope_block_code: string | null;
};

export type ContextDepartment = {
  type: 'department';
  label: string;
  role: Role;  // typically DEPARTMENT_OFFICER
  department_code: string;
  dept_role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  scope_district_code: string | null;
  scope_block_code: string | null;
};

export type ContextView = ContextBase | ContextDepartment;

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: Role | null;
  scope_district_code: string | null;
  scope_block_code: string | null;
  status?: string | null;
  meta?: any;
};
