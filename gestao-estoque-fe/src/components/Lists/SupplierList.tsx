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

interface Supplier {
  id: string
  corporate_name: string
  cnpj: string
  phone: string
  email: string
  address: string
}

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    corporateName: '',
    cnpj: '',
    email: '',
  })

  useEffect(() => {
    fetchSuppliers()
  }, [filters])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.corporateName)
        queryParams.append('corporateName', filters.corporateName)
      if (filters.cnpj) queryParams.append('cnpj', filters.cnpj)
      if (filters.email) queryParams.append('email', filters.email)

      const response = await fetch(`/api/supplier/filter?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data.suppliers)
      } else {
        console.error('Erro ao buscar fornecedores:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
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
      corporateName: '',
      cnpj: '',
      email: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fornecedor</CardTitle>
        <CardDescription>Lista de Fornecedores.</CardDescription>
        <NewEntityButton path={'/fornecedor/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="corporateName">Nome Corporativo</Label>
              <Input
                id="corporateName"
                name="corporateName"
                value={filters.corporateName}
                onChange={handleFilterChange}
                placeholder="Filtrar por nome corporativo"
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={filters.cnpj}
                onChange={handleFilterChange}
                placeholder="Filtrar por CNPJ"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
              <TableHead>Nome Corporativo</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : suppliers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              suppliers?.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">
                    {supplier.corporate_name}
                  </TableCell>
                  <TableCell>{supplier.cnpj}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <EditAndDeleButton
                      id={supplier.id}
                      deletPath="/supplier/"
                      editPath={'/fornecedor/form'}
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
