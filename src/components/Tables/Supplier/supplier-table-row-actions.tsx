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
import { axiosInstance } from '@/axios/api'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/utils'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function SupplierTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const id = row.getValue('id')

  const handleOnClickEdit = () => {
    if (id) return router.push(`/fornecedor/form/${id}`)
  }

  const handleOnClickDelete = () => {
    return axiosInstance.delete(`/api/supplier/${id}`)
  }

  const supplierDeleteMutation = useMutation({
    mutationFn: handleOnClickDelete,
    mutationKey: ['supplier'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier'] })
    },
    onError(error) {
      console.log(error)
    },
  })

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
        <DropdownMenuItem onClick={() => supplierDeleteMutation.mutate()}>
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
