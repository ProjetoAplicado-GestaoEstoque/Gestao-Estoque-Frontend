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
import { NewEntityButton } from '../CustomComponents/NewEntityButton'
import { RedirectType } from 'next/navigation'
import { Item } from '@/types/types'

export function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.storage}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    {item.Projects?.map((project) => project.name)}
                  </TableCell>
                  <TableCell>
                    {item.Supplier.map((supplier) => supplier.corporate_name)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
