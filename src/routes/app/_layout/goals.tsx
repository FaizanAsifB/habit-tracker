import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout/goals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_layout/goals"!</div>
}
