import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import { SupplierTableRowActions } from './supplier-table-row-actions'
import { Supplier } from '../../../types/types'

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorKey: 'corporate_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Corporate Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2 pl-4 ">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('corporate_name')}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'cnpj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="cnpj" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('cnpj')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="phone" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('phone')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="email" />
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
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="address" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('address')}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <SupplierTableRowActions row={row} />,
  },
]
