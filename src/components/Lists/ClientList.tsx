'use client'
import React, { useEffect, useState } from 'react'
/* import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card' */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
/* import { NewEntityButton } from '@/components/CustomComponents/NewEntityButton'
import { RedirectType } from 'next/navigation' */
import { EditAndDeleButton } from '../CustomComponents/EditAndDeleButton'
import useTable from '@/components/Tables/Customer/customer-data-table'
import { Button } from '../ui/button'

interface Customer {
  id: string
  cnpj: string
  email: string
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)

  const table = useTable(customers as unknown as Array<[]>, customers)

  useEffect(() => {
    const fetchcustomers = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/customer')
        if (response.ok) {
          const data = await response.json()
          setCustomers(data.customers)
          setLoading(false)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchcustomers()
  }, [])

  return (
    /*     <Card className="w-full">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Lista dos clientes</CardDescription>
            <NewEntityButton path={'/clientes/form'} type={RedirectType.push} />
          </CardHeader>
          <CardContent>
    
          </CardContent>
        </Card> */
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CNPJ</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Carregando Dados...
              </TableCell>
            </TableRow>
          ) : customers?.length > 0 ? (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.cnpj}</TableCell>
                <TableCell>{customer?.email}</TableCell>
                <TableCell>
                  <EditAndDeleButton id={customer.id} path={'/clientes/form'} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div> 
*/

/* 
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando Dados...
                </TableCell>
              </TableRow>
            ) : customers?.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.cnpj}</TableCell>
                  <TableCell>{customer?.email}</TableCell>
                  <TableCell>
                    <EditAndDeleButton
                      id={customer.id}
                      path={'/clientes/form'}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table> */
