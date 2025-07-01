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
import { useProjects } from '@/hooks/Projects'

type ProjectSelectorProps = {
  value: string
  onChange: (value: string) => void
}

export function ProjectSelector({ value, onChange }: ProjectSelectorProps) {
  const { data, isLoading } = useProjects()

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="z-50 w-full">
        <SelectValue
          placeholder={isLoading ? 'Carregando...' : 'Selecione um Projeto'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Projetos</SelectLabel>
          {data?.map((project) => (
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
