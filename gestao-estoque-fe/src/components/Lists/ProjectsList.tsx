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
import { Project } from '@/types/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SupplierSelector } from '@/components/SelectComponents/SupplierSelector'
import { CustomerSelector } from '@/components/SelectComponents/CustomerSelector'

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    instituition: '',
    customerId: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [filters])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.name) queryParams.append('name', filters.name)
      if (filters.instituition)
        queryParams.append('instituition', filters.instituition)
      if (filters.customerId)
        queryParams.append('customerId', filters.customerId)

      const response = await fetch(`/api/project/filter?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      } else {
        console.error('Erro ao buscar projetos:', response.statusText)
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value }
      return newFilters
    })
  }

  const handleCustomerChange = (value: string) => {
    setFilters((prev) => ({ ...prev, customerId: value }))
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      instituition: '',
      customerId: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projetos</CardTitle>
        <CardDescription>Lista dos Projetos.</CardDescription>
        <NewEntityButton path={'/projetos/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filtrar por nome"
              />
            </div>
            <div>
              <Label htmlFor="instituition">Instituição</Label>
              <Input
                id="instituition"
                name="instituition"
                value={filters.instituition}
                onChange={handleFilterChange}
                placeholder="Filtrar por instituição"
              />
            </div>
            <div>
              <Label htmlFor="supplierId">Cliente</Label>
              <CustomerSelector
                value={filters.customerId}
                onChange={handleCustomerChange}
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
              <TableHead>Instituição</TableHead>
              <TableHead>Gerente do Projeto</TableHead>
              <TableHead>Responsável Técnico</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum projeto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.instituition}</TableCell>
                  <TableCell>{project.project_manager.full_name}</TableCell>
                  <TableCell>{project.tech_responsible.full_name}</TableCell>
                  <TableCell>{project.customer.cnpj}</TableCell>
                  <TableCell>
                    <EditAndDeleButton
                      id={project.id}
                      deletPath={'/project'}
                      editPath={'/projetos/form'}
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
