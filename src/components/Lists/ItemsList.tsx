'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import ItemsTable from '../Tables/Items/items-data-table'
import { useItems } from '@/hooks/Items'
import { columns } from '../Tables/Items/columns'

export function ItemsList() {
  const { data, isLoading } = useItems()

  return (
    <div className="w-full p-6 max-sm:p-4">
      <Card>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Items</h2>
              <p className="text-muted-foreground">
                Aqui esta a sua lista de Items!
              </p>
            </div>
          </div>
          <ItemsTable data={data || []} loading={isLoading} columns={columns} />
        </div>
      </Card>
    </div>
  )
}
