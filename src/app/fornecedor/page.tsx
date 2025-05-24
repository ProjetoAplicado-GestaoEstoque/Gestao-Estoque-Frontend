'use client'
import { SupplierList } from '@/components/Lists/SupplierList'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupplierList />
    </QueryClientProvider>
  )
}
