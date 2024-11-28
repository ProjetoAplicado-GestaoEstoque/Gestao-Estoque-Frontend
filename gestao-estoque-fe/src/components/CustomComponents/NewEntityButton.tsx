'use client'
import { Button } from '@/components/ui/button'
import { RedirectType, useRouter } from 'next/navigation'

export function NewEntityButton({
  path,
  type,
}: {
  path: string
  type: RedirectType | undefined
}) {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        if (type === RedirectType.push) {
          router.push(path)
        } else if (type === RedirectType.replace) {
          router.replace(path)
        }
      }}
      className="bg-blue-500 text-white font-bold w-fit float-right"
    >
      + Novo
    </Button>
  )
}