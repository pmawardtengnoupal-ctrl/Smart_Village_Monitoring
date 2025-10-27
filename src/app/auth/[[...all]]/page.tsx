import Router from '@router/index';
import type { RouteParams } from '@router/types';

export default function Page({ params }: { params: RouteParams }) {
  // e.g. /auth/login, /auth/signup, /auth/forgot
  return <Router params={{ all: ['auth', ...(params.all ?? [])] }} />;
}
