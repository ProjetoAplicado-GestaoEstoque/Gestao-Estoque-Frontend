'use client'

import { queryClient } from '@/lib/utils'
import Dashboard from '@/modules/dashboard/Dashboard'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}
