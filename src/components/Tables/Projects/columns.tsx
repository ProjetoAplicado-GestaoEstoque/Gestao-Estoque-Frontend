import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import { IProjects } from '@/types/types'
import { ProjectTableRowActions } from './projects-table-row-actions'
import { formatCNPJ } from '@/lib/format-cnpj'

export const columns: ColumnDef<IProjects>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2 pl-4 ">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('name')}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'instituition',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Instituição" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('instituition')}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.project_manager.full_name,
    id: 'project_manager.full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gerente do Projeto" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('project_manager.full_name')}
        </span>
      </div>
    ),
  },
  {
    id: 'tech_responsible.full_name',
    accessorFn: (row) => row.tech_responsible.full_name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Responsável Técnico" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('tech_responsible.full_name')}
        </span>
      </div>
    ),
  },
  {
    accessorFn: (row) => row.customer?.email,
    id: 'customer.email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const rawCNPJ = row.getValue('customer.email')
      const cnpjFormatted = formatCNPJ(rawCNPJ as string)
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {cnpjFormatted}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProjectTableRowActions row={row} />,
  },
]
