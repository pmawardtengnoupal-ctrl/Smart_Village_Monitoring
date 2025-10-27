import Router from '@router/index';

export default function Page() {
  // /public (no slug) → Home
  return <Router params={{ all: ['public'] }} />;
}
