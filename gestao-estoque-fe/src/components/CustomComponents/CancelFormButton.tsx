'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CancelFormButton() {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.back()
      }}
      className="bg-gray-500 text-white mr-4"
    >
      Cancelar
    </Button>
  )
}
