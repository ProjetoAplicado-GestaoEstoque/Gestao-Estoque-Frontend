'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CancelFormButton() {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <Button onClick={handleCancel} className="bg-gray-500 text-white mr-4">
      Cancelar
    </Button>
  )
}
