'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ItemsTable from '../Tables/Items/items-data-table'
import { useItems } from '@/hooks/Items'
import { columns } from '../Tables/Items/columns'
import { IItems } from '@/types/types'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ItemsList() {
  const { data, isLoading } = useItems()

  const summaryStats = React.useMemo(() => {
    if (!data || isLoading) {
      return {
        totalItems: 0,
        totalValue: 0,
        totalQuantity: 0,
      }
    }

    const items = data as IItems[]

    return {
      totalItems: items.length,
      totalValue: items.reduce(
        (sum, item) => sum + item.quantity * item.precoUnitario,
        0,
      ),
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    }
  }, [data, isLoading])

  return (
    <div className="w-full p-6 max-sm:p-4">
      <Card>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Items</h2>
              <p className="text-muted-foreground">
                Aqui está a sua lista de Items!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Total em Estoque
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-lg font-semibold">
                    {isLoading ? '...' : summaryStats.totalQuantity}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    unidades
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : formatCurrency(summaryStats.totalValue)}
                </p>
              </div>
            </div>
          </div>
          <ItemsTable data={data || []} loading={isLoading} columns={columns} />
        </div>
      </Card>
    </div>
  )
}
