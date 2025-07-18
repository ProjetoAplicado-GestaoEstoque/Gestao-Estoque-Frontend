import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import { ItemsTableRowActions } from './items-table-row-actions'
import { formatCNPJ } from '@/lib/format-cnpj'
import type { IItems } from '../../../types/types'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const columns: ColumnDef<IItems>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] flex-row justify-center space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('name')}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'storage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Local do Estoque" />
    ),
    cell: ({ row }) => {
      const cnpjMask = formatCNPJ(row.getValue('storage') as string)
      return (
        <div className="flex w-[100px] flex-row justify-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">{cnpjMask}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.project.name,
    id: 'project.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Projeto" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('project.name')}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.supplier.corporate_name,
    id: 'supplier.corporate_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('supplier.corporate_name')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-row justify-center w-[100px] space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('quantity')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'precoUnitario',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço Unitário" />
    ),
    cell: ({ row }) => {
      const price = row.getValue('precoUnitario') as number
      return (
        <div className="flex flex-row justify-center w-[120px] space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(price)}
          </span>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ItemsTableRowActions row={row} />,
  },
]
