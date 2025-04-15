'use client'
import { ProjectsList } from '@/components/Lists/ProjectsList'
import { queryClient } from '@/lib/utils'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full p-6">
        <ProjectsList />
      </div>
    </QueryClientProvider>
  )
}
