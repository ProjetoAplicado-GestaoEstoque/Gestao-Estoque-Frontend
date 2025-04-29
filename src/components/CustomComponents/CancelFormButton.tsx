'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CancelFormButton({ path }: { path: string }) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/${path}`)}
      className="bg-gray-500 text-white mr-4"
    >
      Cancelar
    </Button>
  )
}
