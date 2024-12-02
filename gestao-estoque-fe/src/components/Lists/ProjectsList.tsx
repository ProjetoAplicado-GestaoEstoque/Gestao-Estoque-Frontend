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

export function ProjectsList() {
  const [projects, setProjects] = useState<
    {
      id: string
      name: string
      instituition: string
      project_manager: { full_name: string }
      tech_responsible: { full_name: string }
      customer: { cnpj: string }
      description: string
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/project')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects)
          setLoading(false)
        } else {
          console.error('Erro ao buscar projetos:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar projetos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projetos</CardTitle>
        <CardDescription>Lista dos Projetos.</CardDescription>
        <NewEntityButton path={'/projetos/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>Gerente do Projeto</TableHead>
              <TableHead>Responsável Técnico</TableHead>
              <TableHead>Cliente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? 'Carregando dados...'
              : projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{project.instituition}</TableCell>
                    <TableCell>{project.project_manager.full_name}</TableCell>
                    <TableCell>{project.tech_responsible.full_name}</TableCell>
                    <TableCell>{project.customer.cnpj}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
