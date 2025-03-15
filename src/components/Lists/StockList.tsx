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

export function StockList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estoque</CardTitle>
        <CardDescription>Lista de Estoque</CardDescription>
        <NewEntityButton path={'/estoque/form'} type={RedirectType.push} />
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
