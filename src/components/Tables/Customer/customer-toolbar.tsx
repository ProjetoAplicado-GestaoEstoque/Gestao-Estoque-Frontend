'use client'

import { NewEntityButton } from '@/components/CustomComponents/NewEntityButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { RedirectType } from 'next/navigation'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtre pelo cnpj..."
          value={(table.getColumn('cnpj')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('cnpj')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <X />
          </Button>
        )}
      </div>
      <div className="w-full flex flex-row">
        <NewEntityButton path={'/clientes/form'} type={RedirectType.push} />
      </div>
    </div>
  )
}
