'use client'

import { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  path: string
}

export function DataTableRowActions<TData>({
  row,
  path,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const id = row.getValue('id')

  const handleOnClickEdit = () => {
    if (id) return router.push(`${path}${id}`)
  }

  const handleOnClickDelete = () => {
    try {
      fetch(`/api/customer/${id}`, {
        method: 'DELETE',
      }).then((resp) => {
        if (resp.status === 200) return router.refresh()
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleOnClickEdit}>Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleOnClickDelete}>
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
