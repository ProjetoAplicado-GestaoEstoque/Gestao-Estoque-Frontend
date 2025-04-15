'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import SidebarComponent from './Sidebar'
import { useUser } from '@/hooks/use-user'
import { useToken } from '@/hooks/use-token'
import Cookies from 'js-cookie'

type SideBarProp = {
  children: React.ReactNode
}

export default function SidebarManager({ children }: SideBarProp) {
  const pathname = usePathname()
  const { user, clearUser } = useUser()
  const { clearToken } = useToken()

  const isAuthRoute = pathname.startsWith('/auth')
  if (isAuthRoute) return <>{children}</>

  const logout = () => {
    clearToken()
    clearUser()
    Cookies.remove('token')
    return window.location.reload()
  }

  return (
    <SidebarProvider>
      <SidebarComponent fullName={user.full_name} logout={logout} />
      <main className="w-full h-screen">
        <SidebarTrigger className="ml-4 mt-4" />
        {children}
      </main>
    </SidebarProvider>
  )
}
