'use client'

import { CustomerList } from '@/components/Lists/CustomerList'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerList />
    </QueryClientProvider>
  )
}
