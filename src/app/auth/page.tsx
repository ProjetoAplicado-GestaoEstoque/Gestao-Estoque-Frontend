import { queryClient } from '@/lib/utils'
import AuthComponent from '@/modules/auth/components/AuthComponent'
import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

function page() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthComponent />
    </QueryClientProvider>
  )
}

export default page
