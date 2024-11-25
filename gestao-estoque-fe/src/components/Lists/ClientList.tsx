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

// This is sample data. In a real application, you would fetch this from an API or database.
const customers = [
  { id: 1, cnpj: '12345678000190', email: 'customer1@example.com' },
  { id: 2, cnpj: '98765432000121', email: 'customer2@example.com' },
  { id: 3, cnpj: '45678912000134', email: 'customer3@example.com' },
]

export function ClientList() {
  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          A list of all customers in the system.
        </CardDescription>
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
