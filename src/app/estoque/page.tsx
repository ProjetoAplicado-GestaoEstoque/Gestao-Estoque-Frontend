'use client'

import { StockList } from '@/components/Lists/StockList'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/utils'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <StockList />
    </QueryClientProvider>
  )
}
