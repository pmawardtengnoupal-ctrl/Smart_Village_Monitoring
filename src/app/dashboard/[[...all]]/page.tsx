import Router from '@router/index';
import type { RouteParams } from '@router/types';

export default function Page({ params }: { params: RouteParams }) {
  // e.g. /dashboard/dc/home
  return <Router params={{ all: ['dashboard', ...(params.all ?? [])] }} />;
}
