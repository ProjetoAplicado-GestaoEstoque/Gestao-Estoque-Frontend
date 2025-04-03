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
      variant={'outline'}
      onClick={() => {
        if (type === RedirectType.push) {
          router.push(path)
        } else if (type === RedirectType.replace) {
          router.replace(path)
        }
      }}
      className="border-dashed font-medium w-fit h-8 border-black"
    >
      + Novo
    </Button>
  )
}
