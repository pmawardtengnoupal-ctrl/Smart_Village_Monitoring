import type { RouteMatch } from './types';

import SAHome from '@dashboard/super-admin/screens/home/index';
import SAUsers from '@dashboard/super-admin/screens/users/index';
import DCHome from '@dashboard/dc/screens/home/index';
import TrioHome from '@dashboard/adc-sdo-sdc/screens/home/index';
import BlockHome from '@dashboard/block/screens/home/index';
import DeptHome from '@dashboard/department-officer/screens/home/index';
import VHHome from '@dashboard/village-head/screens/home/index';
import SurveyTasks from '@dashboard/survey-officer/screens/tasks/index';
import SAImports from '@dashboard/super-admin/screens/imports'; // stub allowed

const DASH: Record<string, any> = {
  'super-admin/home': SAHome,
  'super-admin/users': SAUsers,
  'super-admin/imports': SAImports,
  'dc/home': DCHome,
  'adc-sdo-sdc/home': TrioHome,
  'block/home': BlockHome,
  'department-officer/home': DeptHome,
  'village-head/home': VHHome,
  'survey-officer/tasks': SurveyTasks,
};

export function matchDashboard(slug: string[]): RouteMatch {
  const key = (slug.length ? slug : ['dc','home']).join('/').toLowerCase();
  if (DASH[key]) return { Comp: DASH[key] };
  return { Comp: DCHome };
}
