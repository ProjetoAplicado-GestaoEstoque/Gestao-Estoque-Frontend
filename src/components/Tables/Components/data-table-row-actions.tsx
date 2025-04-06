'use client'

import { Row, Table } from '@tanstack/react-table'
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
import DataTableDeleteAction from './data-table-delete-action'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  path: string
  table: Table<TData>
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
        <DataTableDeleteAction url={'/api/customer/'} id={row.getValue('id')} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
