import { ColumnDef } from '@tanstack/react-table'
import { ICustomer } from '../types'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import { CustomerTableRowActions } from './customer-table-row-actions'
import { formatCNPJ } from '@/lib/format-cnpj'

export const columns: ColumnDef<ICustomer>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorKey: 'cnpj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNPJ" />
    ),
    cell: ({ row }) => {
      const cnpjMask = formatCNPJ(row.getValue('cnpj') as string)

      return (
        <div className="flex space-x-2 pl-4 ">
          <span className="max-w-[500px] truncate font-medium">{cnpjMask}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('email')}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <CustomerTableRowActions row={row} />,
  },
]
