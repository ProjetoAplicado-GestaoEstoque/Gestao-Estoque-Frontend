'use client'

import { useState } from 'react'
import { Trash2, Edit, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { IItemsForm } from '@/types/types'
import { useProjects } from '@/hooks/Projects/index'
import { useSupplier } from '@/hooks/Supplier/index'

interface ProductItemProps {
  item: IItemsForm
  index: number
  onUpdate: (index: number, item: IItemsForm) => void
  onRemove: (index: number) => void
}

export function ProductItem({
  item,
  index,
  onUpdate,
  onRemove,
}: ProductItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editItem, setEditItem] = useState<IItemsForm>(item)

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects()
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useSupplier()

  const handleSave = () => {
    onUpdate(index, editItem)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditItem(item)
    setIsEditing(false)
  }

  const isValid =
    item.name &&
    item.storage &&
    item.description &&
    item.quantity > 0 &&
    item.precoUnitario > 0 &&
    item.project_id &&
    item.supplier_id

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 space-y-0 pb-2">
          <h3 className="text-base sm:text-lg font-medium">
            Editando Produto #{index + 1}
          </h3>
          <div className="flex flex-row gap-1 sm:gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {(projectsError || suppliersError) && (
            <Alert variant="destructive">
              <AlertDescription>
                Erro ao carregar dados:{' '}
                {projectsError?.message || suppliersError?.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`} className="text-sm font-medium">
                Nome do Produto *
              </Label>
              <Input
                id={`name-${index}`}
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor={`storage-${index}`}
                className="text-sm font-medium"
              >
                Armazenamento *
              </Label>
              <Input
                id={`storage-${index}`}
                value={editItem.storage}
                onChange={(e) =>
                  setEditItem({ ...editItem, storage: e.target.value })
                }
                placeholder="Local de armazenamento"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`description-${index}`}
              className="text-sm font-medium"
            >
              Descrição *
            </Label>
            <Textarea
              id={`description-${index}`}
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label
                htmlFor={`quantity-${index}`}
                className="text-sm font-medium"
              >
                Quantidade *
              </Label>
              <Input
                id={`quantity-${index}`}
                type="number"
                min="1"
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
                placeholder="Quantidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`price-${index}`} className="text-sm font-medium">
                Preço Unitário *
              </Label>
              <Input
                id={`price-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={editItem.precoUnitario}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    precoUnitario: Number(e.target.value),
                  })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Projeto *</Label>
              <Select
                value={editItem.project_id || ''}
                onValueChange={(value) => {
                  const project = projects.find((p) => p.id === value)
                  setEditItem({ ...editItem, project_id: project?.id })
                }}
                disabled={projectsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      projectsLoading ? 'Carregando...' : 'Selecione um projeto'
                    }
                  />
                  {projectsLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {project.name} - {project.instituition}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Código: {project.id}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fornecedor *</Label>
              <Select
                value={editItem.supplier_id || ''}
                onValueChange={(value) => {
                  const supplier = suppliers.find((s) => s.id === value)
                  setEditItem({ ...editItem, supplier_id: supplier?.id })
                }}
                disabled={suppliersLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      suppliersLoading
                        ? 'Carregando...'
                        : 'Selecione um fornecedor'
                    }
                  />
                  {suppliersLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {supplier.corporate_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          CNPJ: {supplier.cnpj}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${!isValid ? 'border-destructive' : ''}`}>
      <CardHeader className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Produto #{index + 1}</h3>
          {isValid ? (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 text-xs sm:text-sm"
            >
              Válido
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs sm:text-sm">
              Incompleto
            </Badge>
          )}
        </div>
        <div className="flex flex-row gap-1 sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Nome:</p>
            <p>{item.name || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Armazenamento:</p>
            <p>{item.storage || 'Não informado'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="font-medium text-muted-foreground">Descrição:</p>
            <p className="break-words">{item.description || 'Não informado'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Quantidade:</p>
            <p>{item.quantity || 0}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Preço Unitário:</p>
            <p>R$ {item.precoUnitario?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Projeto:</p>
            <p>
              {item.project_id
                ? (() => {
                    const project = projects.find(
                      (p) => p.id === item.project_id,
                    )
                    return project
                      ? `${project.name} - ${project.instituition} (ID: ${item.project_id})`
                      : 'Projeto não encontrado'
                  })()
                : 'Não selecionado'}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Fornecedor:</p>
            <p>
              {item.supplier_id
                ? (() => {
                    const supplier = suppliers.find(
                      (s) => s.id === item.supplier_id,
                    )
                    return supplier
                      ? `${supplier.corporate_name} (${supplier.cnpj})`
                      : 'Fornecedor não encontrado'
                  })()
                : 'Não selecionado'}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium text-sm">
            Total: R${' '}
            {((item.quantity || 0) * (item.precoUnitario || 0)).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
