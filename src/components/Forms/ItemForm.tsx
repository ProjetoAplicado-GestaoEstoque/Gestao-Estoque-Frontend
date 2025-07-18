/* eslint-disable @typescript-eslint/no-unused-vars */
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
import type { IItemsForm } from '@/types/types'
import { MobileHeader } from '@/components/Forms/Item/mobile-header'
import { axiosInstance } from '@/axios/api'
import { SaveProgressItem, SaveStatus } from './Item/save-progress'
import { useRouter } from 'next/navigation'

export default function InvoiceProductsPage() {
  const router = useRouter()
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
    project_id: '',
    supplier_id: '',
    operationType: 'entrada', // Padrão para entrada
  })

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const xmlText = reader.result as string
        const parser = new DOMParser()
        const xml = parser.parseFromString(xmlText, 'application/xml')

        // Determinar se é entrada ou saída baseado no tpNF (tipo da NF)
        // 0 = Entrada, 1 = Saída
        const tpNF = xml.querySelector('ide > tpNF')?.textContent
        const operationType = tpNF === '0' ? 'entrada' : 'saída'

        const produtos = Array.from(xml.getElementsByTagName('det'))

        const parsedItems: IItemsForm[] = produtos.map((det, index) => {
          const prod = det.getElementsByTagName('prod')[0]

          const name = prod?.getElementsByTagName('xProd')[0]?.textContent || ''
          const quantity = parseFloat(
            prod?.getElementsByTagName('qCom')[0]?.textContent || '0',
          )
          const precoUnitario = parseFloat(
            prod?.getElementsByTagName('vUnCom')[0]?.textContent || '0',
          )
          const total = parseFloat(
            prod?.getElementsByTagName('vProd')[0]?.textContent || '0',
          )

          const defaultStorage = 'almoxarifado'
          const defaultDescription = `${operationType === 'entrada' ? 'Entrada' : 'Saída'} via NF - ${name}`

          const item: IItemsForm = {
            name,
            quantity,
            precoUnitario,
            storage: defaultStorage,
            description: defaultDescription,
            project_id: '', // pode ser preenchido pelo usuário depois
            supplier_id: '', // idem
            operationType, // Adicionando o tipo de operação
          }

          return item
        })

        setItems(parsedItems)

        toast({
          title: 'Sucesso!',
          description: `${parsedItems.length} produtos extraídos da NFe (${operationType}).`,
        })
      } catch (error) {
        console.error(error)
        toast({
          title: 'Erro',
          description: 'Falha ao processar o XML da nota fiscal.',
          variant: 'destructive',
        })
      }
    }

    reader.readAsText(file)
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

  const uploadXmlToS3 = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async () => {
        try {
          const base64Data = reader.result

          const res = await fetch('/api/aws/s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64Data,
              fileName: file.name,
              contentType: file.type,
            }),
          })

          if (!res.ok) {
            const json = await res.json()
            throw new Error(json.error || 'Erro ao salvar na S3')
          }

          toast({
            title: 'Nota fiscal salva na nuvem',
            description: `${file.name} enviada com sucesso.`,
          })

          resolve()
        } catch (err) {
          toast({
            title: 'Erro ao salvar XML na S3',
            description: (err as Error).message,
            variant: 'destructive',
          })
          reject(err)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  const createStockMovement = async (
    itemId: string,
    quantity: number,
    itemName: string,
    operationType: 'entrada' | 'saída',
    documentName?: string,
  ) => {
    try {
      const stockData = {
        item_id: itemId,
        quantity,
        type: operationType,
        description: `${operationType === 'entrada' ? 'Entrada' : 'Saída'} automática de ${itemName} via importação de NF`,
        documentUrl: documentName
          ? `/api/aws/s3/${encodeURIComponent(documentName)}`
          : undefined,
        documentName,
      }

      await axiosInstance.post('/api/estoque', stockData)
      return true
    } catch (error) {
      console.error(
        `Erro ao criar movimentação de estoque para item ${itemName}:`,
        error,
      )
      return false
    }
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
    const savedItemIds: {
      id: string
      name: string
      quantity: number
      operationType: 'entrada' | 'saída'
    }[] = []

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

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

          const response = await axiosInstance.post('/api/items', itemToSave)

          if (response.data && response.data?.item.id) {
            savedItemIds.push({
              id: response.data?.item.id,
              name: item.name,
              quantity: item.quantity,
              operationType: item.operationType,
            })
          }

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

      if (errorCount === 0 && selectedFile) {
        try {
          await uploadXmlToS3(selectedFile)
        } catch (error) {
          console.error('Erro ao salvar XML na S3:', error)
          // Não interrompe o processo se o S3 falhar
        }
      }

      // Fase 3: Criar movimentações de estoque para os itens salvos com sucesso
      if (savedItemIds.length > 0) {
        // Determinar os tipos de operação
        const entradas = savedItemIds.filter(
          (item) => item.operationType === 'entrada',
        ).length
        const saidas = savedItemIds.filter(
          (item) => item.operationType === 'saída',
        ).length

        let operationText = ''
        if (entradas > 0 && saidas > 0) {
          operationText = `${entradas} entradas e ${saidas} saídas`
        } else if (entradas > 0) {
          operationText = `${entradas} entradas`
        } else {
          operationText = `${saidas} saídas`
        }

        toast({
          title: 'Criando movimentações de estoque...',
          description: `Registrando ${operationText} de estoque para os produtos salvos.`,
        })

        let stockSuccessCount = 0
        for (const savedItem of savedItemIds) {
          const stockSuccess = await createStockMovement(
            savedItem.id,
            savedItem.quantity,
            savedItem.name,
            savedItem.operationType,
            selectedFile?.name, // Passando o nome do arquivo XML
          )
          if (stockSuccess) {
            stockSuccessCount++
          }
          // Pequeno delay entre as operações
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        if (stockSuccessCount < savedItemIds.length) {
          toast({
            title: 'Atenção',
            description: `${stockSuccessCount}/${savedItemIds.length} movimentações de estoque criadas com sucesso.`,
            variant: 'destructive',
          })
        }
      }

      if (errorCount === 0) {
        const entradas = savedItemIds.filter(
          (item) => item.operationType === 'entrada',
        ).length
        const saidas = savedItemIds.filter(
          (item) => item.operationType === 'saída',
        ).length

        let movementText = ''
        if (entradas > 0 && saidas > 0) {
          movementText = `(${entradas} entradas e ${saidas} saídas)`
        } else if (entradas > 0) {
          movementText = `(${entradas} entradas)`
        } else if (saidas > 0) {
          movementText = `(${saidas} saídas)`
        }

        toast({
          title: 'Sucesso!',
          description: `Todos os ${successCount} produtos foram salvos com sucesso e as movimentações de estoque ${movementText} foram registradas.`,
        })

        setItems([])
        setSelectedFile(null)

        setTimeout(() => {
          setShowProgress(false)
          setSaveProgress([])
          // Redirecionar para a página de produtos
          router.push('/produtos')
        }, 2000)
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
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0 lg:flex">
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
