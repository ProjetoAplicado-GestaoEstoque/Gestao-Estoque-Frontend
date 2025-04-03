'use client'
import React, { useEffect, useState } from 'react'
import CustomerTable from '../Tables/Customer/customer-data-table'
import { ICustomer } from '../Tables/types'
import { columns } from '../Tables/Customer/columns'

export function CustomerList() {
  const [customers, setCustomers] = useState<ICustomer[]>([])

  useEffect(() => {
    const fetchcustomers = async () => {
      try {
        const response = await fetch('/api/customer')
        if (response.ok) {
          const data = await response.json()
          setCustomers(data.customers)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }

    fetchcustomers()
  }, [])

  console.log(customers)

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Aqui esta a sua lista de clientes cadastrados!
          </p>
        </div>
      </div>
      <CustomerTable data={customers} columns={columns} />
    </div>
  )
}
