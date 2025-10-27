import AppRouter from '@router/index'

export default function DashboardCatchAll({ params }: { params: { all?: string[] } }) {
  const slug = params.all && params.all.length ? params.all : ['dc','home']
  return <AppRouter section="dashboard" slug={slug} />
}
