import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SidebarComponent from '@/components/Sidebar/Sidebar'

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
        <SidebarProvider>
          <SidebarComponent />
          <main>
            <SidebarTrigger className="ml-4 mt-4" />
            <div className="p-12 py-6">{children}</div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}
