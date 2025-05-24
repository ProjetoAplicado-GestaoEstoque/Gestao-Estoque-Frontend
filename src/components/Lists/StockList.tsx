'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import StockTable from '../Tables/Stock/stock-data-table'
import { useStock } from '@/hooks/Stock'
import { columns } from '../Tables/Stock/columns'

export function StockList() {
  const { data, isLoading } = useStock()
  return (
    <div className="w-full p-6 max-sm:p-4">
      <Card>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Registro de Estoque
              </h2>
              <p className="text-muted-foreground">
                Aqui esta a sua lista do estoque!
              </p>
            </div>
          </div>
          <StockTable data={data || []} loading={isLoading} columns={columns} />
        </div>
      </Card>
    </div>
  )
}
