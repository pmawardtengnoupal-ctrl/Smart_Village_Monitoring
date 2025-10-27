import type { RouteMatch } from './types';
import Login from '@auth/screens/login/index';
import Forgot from '@auth/screens/forgot/index';
import Signup from '@auth/screens/signup/index';

const AUTH: Record<string, any> = {
  'login': Login,
  'forgot': Forgot,
  'signup': Signup,
};

export function matchAuth(slug: string[]): RouteMatch {
  const key = (slug[0] || 'login').toLowerCase();
  if (AUTH[key]) return { Comp: AUTH[key] };
  return { Comp: Login };
}
