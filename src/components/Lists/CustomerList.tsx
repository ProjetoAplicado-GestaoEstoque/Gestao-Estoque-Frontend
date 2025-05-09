'use client'
import React from 'react'
import CustomerTable from '../Tables/Customer/customer-data-table'
import { columns } from '../Tables/Customer/columns'
import { useCustomer } from '@/hooks/Customer'
import { Card } from '../ui/card'

export function CustomerList() {
  const { data } = useCustomer()

  return (
    <div className="w-full p-6 max-sm:p-4">
      <Card>
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
              <p className="text-muted-foreground">
                Aqui esta a sua lista de clientes cadastrados!
              </p>
            </div>
          </div>
          <CustomerTable data={data || []} columns={columns} />
        </div>
      </Card>
    </div>
  )
}
