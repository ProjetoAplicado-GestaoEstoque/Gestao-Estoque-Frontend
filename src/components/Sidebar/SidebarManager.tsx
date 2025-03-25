'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import SidebarComponent from './Sidebar'
import { useUser } from '@/hooks/use-user'

type SideBarProp = {
  children: React.ReactNode
}
export default function SidebarManager({ children }: SideBarProp) {
  const pathname = usePathname()
  const { user } = useUser()

  const isAuthRoute = pathname.startsWith('/auth')
  if (isAuthRoute) return null

  console.log(user?.userID)

  return (
    <SidebarProvider>
      <SidebarComponent userID={user.userID} />
      <main className="w-full h-screen">
        <SidebarTrigger className="ml-4 mt-4" />
        {children}
      </main>
    </SidebarProvider>
  )
}
