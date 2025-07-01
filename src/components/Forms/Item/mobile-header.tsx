'use client'

import type React from 'react'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  actions?: React.ReactNode
}

export function MobileHeader({
  title,
  showBack = false,
  actions,
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 bg-background border-b lg:hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
  )
}
