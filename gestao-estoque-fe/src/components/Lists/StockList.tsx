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
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {ItemSelector} from "@/components/SelectComponents/ItemSelector";

interface StockChange {
  id: string
  quantity: string
  type: string
  item: { name: string }
}

export function StockList() {
  const [stockChanges, setStockChanges] = useState<StockChange[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    itemId: '',
    type: '',
  })

  useEffect(() => {
    fetchStockChanges()
  }, [filters])

  const fetchStockChanges = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.itemId) queryParams.append('itemId', filters.itemId)
      if (filters.type) queryParams.append('type', filters.type)

      const response = await fetch(`/api/estoque/filter?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setStockChanges(data.estoque)
      } else {
        console.error(
          'Erro ao buscar movimentações de estoque:',
          response.statusText,
        )
      }
    } catch (error) {
      console.error('Erro ao buscar movimentações de estoque:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemChange = (value: string) => {
    setFilters((prev) => ({ ...prev, itemId: value }))
  }

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value }))
  }

  const clearFilters = () => {
    setFilters({
      itemId: '',
      type: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estoque</CardTitle>
        <CardDescription>Lista de Movimentações de Estoque</CardDescription>
        <NewEntityButton path={'/estoque/form'} type={RedirectType.push} />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemId">Produto</Label>
              <ItemSelector
                value={filters.itemId}
                onChange={handleItemChange}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo de Movimentação</Label>
              <Select value={filters.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={clearFilters} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Tipo de Movimentação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Carregando dados...
                </TableCell>
              </TableRow>
            ) : stockChanges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Nenhuma movimentação de estoque encontrada.
                </TableCell>
              </TableRow>
            ) : (
              stockChanges.map((stockChange) => (
                <TableRow key={stockChange.id}>
                  <TableCell>{stockChange.item.name}</TableCell>
                  <TableCell className="font-medium">
                    {stockChange.quantity}
                  </TableCell>
                  <TableCell>{stockChange.type}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
