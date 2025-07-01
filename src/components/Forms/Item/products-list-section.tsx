'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IItemsForm } from '@/types/types'
import { ProductItem } from './product-form-item'

interface ProductsListProps {
  items: IItemsForm[]
  onUpdateItem: (index: number, item: IItemsForm) => void
  onRemoveItem: (index: number) => void
  onAddItem: () => void
}

export function ProductsList({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: ProductsListProps) {
  const validItems = items.filter(
    (item) =>
      item.name &&
      item.storage &&
      item.description &&
      item.quantity > 0 &&
      item.precoUnitario > 0 &&
      item.project_id &&
      item.supplier_id,
  )

  const totalValue = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.precoUnitario || 0),
    0,
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle>Lista de Produtos</CardTitle>
            <Button onClick={onAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span>Total de itens: {items.length}</span>
              <div className="flex items-center space-x-2">
                <span>Válidos:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {validItems.length}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span>Incompletos:</span>
                <Badge variant="destructive">
                  {items.length - validItems.length}
                </Badge>
              </div>
            </div>
            <div className="text-base sm:text-lg font-semibold">
              Total: R$ {totalValue.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 sm:space-y-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum produto adicionado ainda
              </p>
              <Button onClick={onAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <ProductItem
              key={index}
              item={item}
              index={index}
              onUpdate={onUpdateItem}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>
    </div>
  )
}
