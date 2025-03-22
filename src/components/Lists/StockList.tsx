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

export function StockList() {
  const [stockChanges, setStockChanges] = useState<
    {
      id: string
      quantity: string
      type: string
      item: { name: string }
      description: string
    }[]
  >([])
  const [loading, setLoading] = useState(true)

<<<<<<< HEAD:src/components/Lists/StockList.tsx
useEffect(() => {
  const fetchSupplier = async () => {
    try {
      const response = await fetch('/api/estoque')
      if (response.ok) {
        const data = await response.json()
        setStockChanges(data.estoque)
      } else {
        console.error('Erro ao buscar clientes:', response.statusText)
=======
  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/supplier')
        if (response.ok) {
          const data = await response.json()
          setStockChanges(data.supplier)
          setLoading(false)
        } else {
          console.error('Erro ao buscar clientes:', response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setLoading(false)
>>>>>>> 15d71db4 (fix: lint and loading erros):gestao-estoque-fe/src/components/Lists/StockList.tsx
      }
    }

    fetchSupplier()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estoque</CardTitle>
        <CardDescription>Lista de Movimentações de Estoque</CardDescription>
        <NewEntityButton path={'/estoque/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Tipo de Movimentação</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
<<<<<<< HEAD:src/components/Lists/StockList.tsx
            {stockChanges?.map((stockChange) => (
              <TableRow key={stockChange.id}>
                <TableCell>{stockChange.item.name}</TableCell>
                <TableCell className="font-medium">{stockChange.quantity}</TableCell>
                <TableCell>{stockChange.type}</TableCell>
                <TableCell>{stockChange.description}</TableCell>
              </TableRow>
            ))}
=======
            {loading
              ? 'Atribuindo dados'
              : stockChanges.map((stockChange) => (
                  <TableRow key={stockChange.id}>
                    <TableCell>{stockChange.item.name}</TableCell>
                    <TableCell className="font-medium">
                      {stockChange.quantity}
                    </TableCell>
                    <TableCell>{stockChange.type}</TableCell>
                    <TableCell>{stockChange.description}</TableCell>
                    <TableCell>
                      <EditAndDeleButton
                        id={stockChange.id}
                        path="/estoque/form"
                      />
                    </TableCell>
                  </TableRow>
                ))}
>>>>>>> 15d71db4 (fix: lint and loading erros):gestao-estoque-fe/src/components/Lists/StockList.tsx
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
