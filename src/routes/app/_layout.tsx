import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-4">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
