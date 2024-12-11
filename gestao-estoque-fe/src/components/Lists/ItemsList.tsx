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
import { NewEntityButton } from '../CustomComponents/NewEntityButton'
import { RedirectType } from 'next/navigation'
import { Item } from '@/types/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ProjectSelector } from '@/components/SelectComponents/ProjectSelector'
import { SupplierSelector } from '@/components/SelectComponents/SupplierSelector'

export function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    projectId: '',
    supplierId: '',
  })

  useEffect(() => {
    fetchItems()
  }, [filters])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.name) queryParams.append('name', filters.name)
      if (filters.projectId) queryParams.append('projectId', filters.projectId)
      if (filters.supplierId)
        queryParams.append('supplierId', filters.supplierId)

      const response = await fetch(`/api/items/filter?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data.items)
      } else {
        console.error('Erro ao buscar itens:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleProjectChange = (value: string) => {
    setFilters((prev) => ({ ...prev, projectId: value }))
  }

  const handleSupplierChange = (value: string) => {
    setFilters((prev) => ({ ...prev, supplierId: value }))
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      projectId: '',
      supplierId: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <CardDescription>Lista dos produtos.</CardDescription>
        <NewEntityButton path={'/produtos/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filtrar por nome"
              />
            </div>
            <div>
              <Label htmlFor="projectId">Projeto</Label>
              <ProjectSelector
                value={filters.projectId}
                onChange={handleProjectChange}
              />
            </div>
            <div>
              <Label htmlFor="supplierId">Fornecedor</Label>
              <SupplierSelector
                value={filters.supplierId}
                onChange={handleSupplierChange}
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
              <TableHead>Nome</TableHead>
              <TableHead>Local Armazenado</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Fornecedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.storage}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.Projects?.map((project) => project.name).join(', ')}
                  </TableCell>
                  <TableCell>
                    {item.Supplier?.map(
                      (supplier) => supplier.corporate_name,
                    ).join(', ')}
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
