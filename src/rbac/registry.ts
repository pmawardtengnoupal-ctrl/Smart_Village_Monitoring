// src/rbac/registry.ts
export type Role =
  | 'PUBLIC' | 'SUPER_ADMIN' | 'DC' | 'ADC' | 'SDO' | 'SDC'
  | 'BLOCK_OFFICER' | 'DEPARTMENT_OFFICER' | 'VILLAGE_HEAD' | 'SURVEY_OFFICER';

export const menuByRole: Record<Role, Array<{ label: string; href: string }>> = {
  PUBLIC: [
    { label: 'Home', href: '/public/home' },
    { label: 'Villages', href: '/public/villages' },
    { label: 'Schemes', href: '/public/schemes' },
    { label: 'Grievances', href: '/public/grievances/new' },
  ],
  SUPER_ADMIN: [
    { label: 'Home', href: '/dashboard/super-admin/home' },
    { label: 'Users', href: '/dashboard/super-admin/users' },
    { label: 'Imports', href: '/dashboard/super-admin/imports' },
    { label: 'Validation', href: '/dashboard/super-admin/validation' },
  ],
  DC: [
    { label: 'Home', href: '/dashboard/dc/home' },
    { label: 'Validation', href: '/dashboard/dc/validation-queue' },
    { label: 'Schemes', href: '/dashboard/dc/schemes' },
    { label: 'Villages', href: '/dashboard/dc/villages' },
  ],
  ADC: [{ label: 'Home', href: '/dashboard/adc-sdo-sdc/home' }],
  SDO: [{ label: 'Home', href: '/dashboard/adc-sdo-sdc/home' }],
  SDC: [{ label: 'Home', href: '/dashboard/adc-sdo-sdc/home' }],
  BLOCK_OFFICER: [{ label: 'Home', href: '/dashboard/block/home' }],
  DEPARTMENT_OFFICER: [{ label: 'Home', href: '/dashboard/department-officer/home' }],
  VILLAGE_HEAD: [{ label: 'Home', href: '/dashboard/village-head/home' }],
  SURVEY_OFFICER: [{ label: 'Tasks', href: '/dashboard/survey-officer/tasks' }],
};
