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

const suppliers = [
  {
    id: 1,
    corporateName: 'Supplier A Inc.',
    cnpj: '12345678000190',
    phone: '1234567890',
  },
  {
    id: 2,
    corporateName: 'Supplier B Ltd.',
    cnpj: '98765432000121',
    phone: '9876543210',
  },
  {
    id: 3,
    corporateName: 'Supplier C Co.',
    cnpj: '45678912000134',
    phone: '5678901234',
  },
]

export function SupplierList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fornecedor</CardTitle>
        <CardDescription>Lista de Fornecedores.</CardDescription>
        <NewEntityButton path={'/fornecedor/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Corporate Name</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">
                  {supplier.corporateName}
                </TableCell>
                <TableCell>{supplier.cnpj}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
