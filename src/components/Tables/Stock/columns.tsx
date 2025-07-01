import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import { IStock } from '../../../types/types'
import { StockTableRowActions } from './stock-table-row-actions'

export const columns: ColumnDef<IStock>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2 pl-4 ">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('description')}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('quantity')}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.item.name,
    id: 'item.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Item" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('item.name')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('type')}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <StockTableRowActions row={row} />,
  },
]
