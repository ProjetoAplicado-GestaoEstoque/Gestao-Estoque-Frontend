import React from 'react'
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

// This is sample data. In a real application, you would fetch this from an API or database.
const projects = [
  {
    id: 1,
    name: 'Project Alpha',
    institution: 'Acme Corp',
    manager: 'John Doe',
  },
  { id: 2, name: 'Project Beta', institution: 'TechCo', manager: 'Jane Smith' },
  {
    id: 3,
    name: 'Project Gamma',
    institution: 'Innovate Inc',
    manager: 'Bob Johnson',
  },
]

export function ProjectsList() {
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
              <TableHead>Name</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Manager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.institution}</TableCell>
                <TableCell>{project.manager}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
