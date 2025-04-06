'use client'

import { CustomerList } from '@/components/Lists/CustomerList'
import { Card } from '@/components/ui/card'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full p-6">
        <Card>
          <CustomerList />
        </Card>
      </div>
    </QueryClientProvider>
  )
}
