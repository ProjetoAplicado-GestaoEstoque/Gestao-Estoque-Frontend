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
    }[]
  >([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items')
        if (response.ok) {
          const data = await response.json()
          setItems(data.items)
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Local Armazenado</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Descrição</TableHead>
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
      </CardContent>
    </Card>
  )
}
