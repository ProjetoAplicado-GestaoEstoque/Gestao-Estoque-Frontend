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
import { EditAndDeleButton } from '../CustomComponents/EditAndDeleButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Customer {
  id: string
  cnpj: string
  email: string
}

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    cnpj: '',
    email: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [filters])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.cnpj) queryParams.append('cnpj', filters.cnpj)
      if (filters.email) queryParams.append('email', filters.email)

      const response = await fetch(`/api/customer/filter?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
      } else {
        console.error('Erro ao buscar clientes:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({
      cnpj: '',
      email: '',
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>Lista dos clientes</CardDescription>
        <NewEntityButton path={'/clientes/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">CNPJ do Cliente</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={filters.cnpj}
                onChange={handleFilterChange}
                placeholder="Filtrar por cnpj"
              />
            </div>
            <div>
              <Label htmlFor="email">Email do Cliente</Label>
              <Input
                id="email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Filtrar por email"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={clearFilters} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </div>
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
                <TableCell colSpan={4} className="text-center">
                  Carregando Dados...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.cnpj}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <EditAndDeleButton
                      id={customer.id}
                      deletPath={'/clientes/form'}
                      editPath={'/clientes/form'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
