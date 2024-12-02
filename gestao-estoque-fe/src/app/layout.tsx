import type { Metadata } from 'next'
import './globals.css'
import SidebarManager from '@/components/Sidebar/SidebarManager'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Gestão Estoque',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>
        <SidebarManager>{children}</SidebarManager>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
