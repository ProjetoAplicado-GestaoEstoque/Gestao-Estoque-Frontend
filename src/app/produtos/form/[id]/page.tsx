'use client'
import { MultiProductForm } from '@/components/Forms/ItemForm'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <MultiProductForm />
      </div>
    </QueryClientProvider>
  )
}
