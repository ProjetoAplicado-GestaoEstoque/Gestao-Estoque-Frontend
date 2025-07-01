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
import { axiosInstance } from '@/axios/api'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/utils'
import UpdateItemModal from '@/components/Forms/Item/update-item-modal'
import { useState } from 'react'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function ItemsTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const id = String(row.getValue('id'))

  const handleOnClickEdit = () => {
    setIsModalOpen(true)
  }

  const handleOnClickDelete = () => {
    return axiosInstance.delete(`/api/items/${id}`)
  }

  const customerDeleteMutation = useMutation({
    mutationFn: handleOnClickDelete,
    mutationKey: ['items'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
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
        <DropdownMenuItem onClick={() => customerDeleteMutation.mutate()}>
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isModalOpen && (
        <UpdateItemModal
          itemId={id}
          open={isModalOpen}
          setIsOpen={() => setIsModalOpen(false)}
        />
      )}
    </DropdownMenu>
  )
}
