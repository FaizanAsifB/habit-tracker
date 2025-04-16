import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/progress-analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_layout/progress-analytics"!</div>
}
