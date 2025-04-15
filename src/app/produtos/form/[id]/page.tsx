'use client'
import { ItemForm } from '@/components/Forms/ItemForm'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <ItemForm />
      </div>
    </QueryClientProvider>
  )
}
