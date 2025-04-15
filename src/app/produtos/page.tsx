'use client'
import { ItemsList } from '@/components/Lists/ItemsList'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/utils'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemsList />
    </QueryClientProvider>
  )
}
