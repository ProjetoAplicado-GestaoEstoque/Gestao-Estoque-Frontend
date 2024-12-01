'use client'
import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

export function ProjectSelector() {
  const [projects, setProjects] = useState<
    { id: string; name: string; instituition: string }[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <Select>
      <SelectTrigger>
        <SelectValue
          placeholder={loading ? 'Carregando...' : 'Selecione um Cliente'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Clientes</SelectLabel>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <b>Nome: </b>
              {project.name} <b>- Instituição: </b>
              {project.instituition}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
