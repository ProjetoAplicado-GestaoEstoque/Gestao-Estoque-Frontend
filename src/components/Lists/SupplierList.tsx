'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { useSupplier } from '@/hooks/Supplier'
import { columns } from '../Tables/Supplier/columns'
import SupplierTable from '../Tables/Supplier/supplier-data-table'

export function SupplierList() {
  const { data, isLoading } = useSupplier()

  return (
    <div className="w-full p-6 max-sm:p-4">
      <Card>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Fornecedores
              </h2>
              <p className="text-muted-foreground">
                Aqui esta a sua lista de fornecedores!
              </p>
            </div>
          </div>
          <SupplierTable
            data={data || []}
            loading={isLoading}
            columns={columns}
          />
        </div>
      </Card>
    </div>
  )
}
