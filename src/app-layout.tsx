import { Link, Outlet } from '@tanstack/react-router'
import { Sidebar } from '@catpkgs/coffee-ui'
import ThemeToggle from './theme-toggle.tsx'
import { groups } from './navigation.tsx'

export default function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:gap-6 sm:px-6">
      <Sidebar
        groups={groups}
        header={<p className="px-2.5 py-1.5 text-sm font-semibold tracking-tight">Coffee UI</p>}
        footer={<ThemeToggle />}
        renderLink={(item, props) => <Link to={item.href} activeOptions={{ exact: true }} {...props} />}
        className="sm:sticky sm:top-4 sm:h-[calc(100dvh-2rem)] sm:w-60 sm:overflow-y-auto"
      />
      <main className="flex min-w-0 flex-1 flex-col py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}
