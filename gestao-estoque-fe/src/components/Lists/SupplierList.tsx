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

export function SupplierList() {
  const [suppliers, setSuppliers] = useState<
    {
      id: string
      corporate_name: string
      cnpj: string
      phone: string
      email: string
      address: string
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch('/api/supplier')
        setLoading(true)
        if (response.ok) {
          const data = await response.json()
          setSuppliers(data.supplier)
          setLoading(false)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [])

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
              <TableHead>Nome Corporativo</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Endereço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? 'Carregando...'
              : suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.corporate_name}
                    </TableCell>
                    <TableCell>{supplier.cnpj}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <EditAndDeleButton id={supplier.id} path="/fornecedor/form" />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
