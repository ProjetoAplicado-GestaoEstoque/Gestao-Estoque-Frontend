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

export function ItemsList() {
  const [items, setItems] = useState<
    {
      id: string
      name: string
      storage: string
      quantity: string
      description: string
      supplier: { corporate_name: string }
      project: { name: string }
    }[]
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/items')
        if (response.ok) {
          const data = await response.json()
          setItems(data.items)
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

    fetchItems()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <CardDescription>Lista dos produtos.</CardDescription>
        <NewEntityButton path={'/produtos/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
<<<<<<< HEAD:src/components/Lists/ItemsList.tsx
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Local Armazenado</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Fornecedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.storage}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.project?.name}</TableCell>
                <TableCell>{item.supplier.corporate_name}</TableCell>
=======
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Local Armazenado</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Descrição</TableHead>
>>>>>>> 15d71db4 (fix: lint and loading erros):gestao-estoque-fe/src/components/Lists/ItemsList.tsx
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.storage}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
