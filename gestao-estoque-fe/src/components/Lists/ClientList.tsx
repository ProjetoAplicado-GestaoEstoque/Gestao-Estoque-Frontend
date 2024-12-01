'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { NewEntityButton } from '@/components/CustomComponents/NewEntityButton'
import { RedirectType } from 'next/navigation'

export function ClientList() {
  const [customers, setCustomers] = useState<
    { id: string; cnpj: string; email: string }[]
  >([])
  const [loading, setLoading] = useState(false)

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
    <Card className="w-100">
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>Lista dos clientes</CardDescription>
        <NewEntityButton path={'/clientes/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableCell>Carregando Dados...</TableCell>
            ) : (
              customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.cnpj}</TableCell>
                  <TableCell>{customer?.email}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
