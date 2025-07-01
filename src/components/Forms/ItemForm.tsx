'use client'

import { useState } from 'react'
import { Save, FileCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { XmlUpload } from '@/components/Forms/Item/file-upload-section'
import { ProductsList } from '@/components/Forms/Item/products-list-section'
import type { IItemsForm, Items } from '@/types/types'
import { MobileHeader } from '@/components/Forms/Item/mobile-header'
import { axiosInstance } from '@/axios/api'
import { SaveProgressItem, SaveStatus } from './Item/save-progress'

export default function InvoiceProductsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [items, setItems] = useState<IItemsForm[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [saveProgress, setSaveProgress] = useState<SaveProgressItem[]>([])
  const [showProgress, setShowProgress] = useState(false)

  const createEmptyItem = (): IItemsForm => ({
    name: '',
    storage: '',
    description: '',
    quantity: 0,
    precoUnitario: 0,
    project_id: "",
    supplier_id: "",
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    // Aqui você pode processar o XML e extrair os produtos
    // Por enquanto, vamos adicionar alguns itens de exemplo
    const exampleItems: IItemsForm[] = [
      {
        name: 'Produto extraído do XML',
        storage: 'Estoque A',
        description: 'Descrição extraída do XML da nota fiscal',
        quantity: 10,
        precoUnitario: 25.5,
        project_id: "",
        supplier_id: "",
      },
    ]
    setItems(exampleItems)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setItems([])
  }

  const handleAddItem = () => {
    setItems([...items, createEmptyItem()])
  }

  const handleUpdateItem = (index: number, updatedItem: IItemsForm) => {
    const newItems = [...items]
    newItems[index] = updatedItem
    setItems(newItems)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const validateItems = (): boolean => {
    return items.every(
      (item) =>
        item.name &&
        item.storage &&
        item.description &&
        item.quantity > 0 &&
        item.precoUnitario > 0 &&
        item.project_id &&
        item.supplier_id,
    )
  }

  const handleSave = async () => {
    if (items.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos um produto antes de salvar.',
        variant: 'destructive',
      })
      return
    }

    if (!validateItems()) {
      toast({
        title: 'Erro de validação',
        description:
          'Todos os produtos devem ter todos os campos obrigatórios preenchidos.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setShowProgress(true)

    // Inicializar progresso
    const initialProgress: SaveProgressItem[] = items.map((item, index) => ({
      index,
      name: item.name,
      status: 'pending' as SaveStatus,
    }))
    setSaveProgress(initialProgress)

    let successCount = 0
    let errorCount = 0

    try {
      // Processar itens sequencialmente
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // Atualizar status para "saving"
        setSaveProgress((prev) =>
          prev.map((p) =>
            p.index === i ? { ...p, status: 'saving' as SaveStatus } : p,
          ),
        )

        try {
          const itemToSave = {
            name: item.name,
            storage: item.storage,
            description: item.description,
            quantity: item.quantity,
            precoUnitario: item.precoUnitario,
            project_id: item.project_id!,
            supplier_id: item.supplier_id!,
          }

          await axiosInstance.post('/api/items', itemToSave)

          setSaveProgress((prev) =>
            prev.map((p) =>
              p.index === i ? { ...p, status: 'success' as SaveStatus } : p,
            ),
          )

          successCount++
        } catch (error) {
          const errorMessage =
            (error instanceof Error && error.message) ||
            (typeof error === 'string' && error) ||
            'Erro desconhecido'

          setSaveProgress((prev) =>
            prev.map((p) =>
              p.index === i
                ? {
                  ...p,
                  status: 'error' as SaveStatus,
                  error: errorMessage,
                }
                : p,
            ),
          )

          errorCount++

          console.error(`Erro ao salvar item ${i + 1}:`, error)
        }

        if (i < items.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      if (errorCount === 0) {
        toast({
          title: 'Sucesso!',
          description: `Todos os ${successCount} produtos foram salvos com sucesso.`,
        })

        setItems([])
        setSelectedFile(null)

        setTimeout(() => {
          setShowProgress(false)
          setSaveProgress([])
        }, 3000)
      } else if (successCount > 0) {
        toast({
          title: 'Parcialmente concluído',
          description: `${successCount} produtos salvos com sucesso, ${errorCount} falharam.`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description:
            'Nenhum produto foi salvo. Verifique os erros e tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado durante o salvamento.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validItemsCount = items.filter(
    (item) =>
      item.name &&
      item.storage &&
      item.description &&
      item.quantity > 0 &&
      item.precoUnitario > 0 &&
      item.project_id &&
      item.supplier_id,
  ).length

  const hasInvalidItems = items.length > 0 && validItemsCount < items.length

  return (
    <>
      <MobileHeader
        title="Produtos NF"
        showBack={true}
        actions={
          <Button
            onClick={handleSave}
            disabled={items.length === 0 || !validateItems() || isLoading}
            size="sm"
            className="text-xs"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        }
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 hidden lg:flex">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Produtos da Nota Fiscal
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Faça upload do XML da nota fiscal e gerencie os produtos
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {items.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {validItemsCount}/{items.length} produtos válidos
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={items.length === 0 || !validateItems() || isLoading}
              size="default"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Produtos
                </>
              )}
            </Button>
          </div>
        </div>

        {hasInvalidItems && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Alguns produtos estão incompletos. Preencha todos os campos
              obrigatórios antes de salvar.
            </AlertDescription>
          </Alert>
        )}

        <XmlUpload
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onRemoveFile={handleRemoveFile}
        />

        <ProductsList
          items={items}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
        />

        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Arquivo Processado
              </CardTitle>
              <CardDescription>
                XML da nota fiscal carregado e processado com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Arquivo:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>Tamanho:</strong>{' '}
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <p>
                  <strong>Produtos encontrados:</strong> {items.length}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
