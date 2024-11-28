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

const customers = [
  { id: 1, cnpj: '12345678000190', email: 'customer1@example.com' },
  { id: 2, cnpj: '98765432000121', email: 'customer2@example.com' },
  { id: 3, cnpj: '45678912000134', email: 'customer3@example.com' },
]

export function ClientList() {
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
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.cnpj}</TableCell>
                <TableCell>{customer.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
