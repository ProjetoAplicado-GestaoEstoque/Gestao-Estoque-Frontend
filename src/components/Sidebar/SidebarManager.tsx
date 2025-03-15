'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import SidebarComponent from './Sidebar'

type SideBarProp = {
  children: React.ReactNode
}
export default function SidebarManager({ children }: SideBarProp) {
  const pathname = usePathname()

  const isAuthRoute = pathname.startsWith('/auth')
  if (isAuthRoute) return null

  return (
    <SidebarProvider>
      <SidebarComponent />
      <main className="w-full h-screen">
        <SidebarTrigger className="ml-4 mt-4" />
        {children}
      </main>
    </SidebarProvider>
  )
}
