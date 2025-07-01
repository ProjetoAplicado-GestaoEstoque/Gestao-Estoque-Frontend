'use client'

import React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Pagination from '../Components/pagination'
import { DataTableToolbar } from '../Components/data-table-toolbar'
import type { IItems } from '../../../types/types'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ItemsTable<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
    })
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Calculate total value from all products
  const calculateTotalValue = React.useMemo(() => {
    if (!data || loading) return 0

    return (data as IItems[]).reduce((total, item) => {
      const itemTotal = (item.quantity || 0) * (item.precoUnitario || 0)
      return total + itemTotal
    }, 0)
  }, [data, loading])

  const calculateFilteredTotalValue = React.useMemo(() => {
    const filteredRows = table.getFilteredRowModel().rows

    return filteredRows.reduce((total, row) => {
      const item = row.original as IItems
      const itemTotal = (item.quantity || 0) * (item.precoUnitario || 0)
      return total + itemTotal
    }, 0)
  }, [table.getFilteredRowModel().rows])

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        buttonPath="/produtos/form"
        getColumn="name"
        filterPlaceholder="Filte pelo Nome do Produto..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total de Produtos
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-lg font-bold">
                  {loading ? '...' : (data as IItems[])?.length || 0}
                </Badge>
                <span className="text-sm text-muted-foreground">itens</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Valor Total (Todos)
              </p>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : formatCurrency(calculateTotalValue)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Valor Total (Filtrados)
              </p>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '...' : formatCurrency(calculateFilteredTotalValue)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Buscando Dados...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with totals */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium">
            Total da página: {formatCurrency(calculateFilteredTotalValue)}
          </div>
        </div>
      </div>

      <Pagination table={table} />
    </div>
  )
}

export default ItemsTable
