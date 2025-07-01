/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, X, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/axios/api'
import type { IItems } from '@/types/types'
import { useItemQueryById } from '@/hooks/Items'
import { useProjects } from '@/hooks/useProjects'
import { useSupplier, useSupplierQueryById } from '@/hooks/Supplier'
import { useProjectsQueryById } from '@/hooks/Projects'

interface UpdateItemModalProps {
  itemId: string
  open: boolean
  setIsOpen: (open: boolean) => void
}

export default function UpdateItemModal({
  itemId,
  open,
  setIsOpen,
}: UpdateItemModalProps) {
  const { handleSubmit, register, setValue, control, watch, reset } =
    useForm<IItems>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [existingDocument, setExistingDocument] = useState<string | null>(null)

  // Query client para invalidar cache
  const queryClient = useQueryClient()

  // Hook para buscar o item específico
  const {
    data: itemData,
    isLoading: itemLoading,
    error: itemError,
  } = useItemQueryById(itemId, {
    enabled: !!itemId && open, // Só executa se tiver itemId e modal estiver aberto
  })

  // Hooks para buscar listas completas (para os selects)
  const { data: allProjects = [], isLoading: allProjectsLoading } =
    useProjects()
  const { data: allSuppliers = [], isLoading: allSuppliersLoading } =
    useSupplier()

  // Hooks para buscar o supplier e project específicos do item atual
  const { data: currentSupplier, isLoading: currentSupplierLoading } =
    useSupplierQueryById(itemData?.supplier?.id || '', {
      enabled: !!itemData?.supplier?.id, // Só executa se tiver ID do supplier
    })

  const { data: currentProject, isLoading: currentProjectLoading } =
    useProjectsQueryById(itemData?.project?.id || '', {
      enabled: !!itemData?.project?.id, // Só executa se tiver ID do project
    })

  // Watch form values for validation
  const watchedValues = watch()

  // Effect para popular o form quando os dados do item chegarem
  useEffect(() => {
    if (itemData && !itemLoading) {
      setValue('name', itemData.name)
      setValue('storage', itemData.storage)
      setValue('description', itemData.description || '')
      setValue('quantity', itemData.quantity || 0)
      setValue('precoUnitario', itemData.precoUnitario || 0)

      // Set existing document if available
      // setExistingDocument(itemData.documentUrl || null)
    }
  }, [itemData, itemLoading, setValue])

  // Effect para setar o supplier no form quando os dados chegarem
  useEffect(() => {
    if (currentSupplier && !currentSupplierLoading) {
      currentSupplier?.supplier?.map((supplier) => {
        return setValue('supplier', supplier)
      })
    }
  }, [currentSupplier, currentSupplierLoading, setValue])

  // Effect para setar o project no form quando os dados chegarem
  useEffect(() => {
    if (currentProject && !currentProjectLoading) {
      setValue('project', currentProject)
    }
  }, [currentProject, currentProjectLoading, setValue])

  // Effect para mostrar erro se houver
  useEffect(() => {
    if (itemError) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do produto.',
        variant: 'destructive',
      })
    }
  }, [itemError])

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type (optional)
      const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf('.'))

      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: 'Arquivo inválido',
          description:
            'Por favor, selecione um arquivo PDF, DOC, DOCX ou imagem.',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 10MB.',
          variant: 'destructive',
        })
        return
      }

      setDocumentFile(file)
    }
  }

  const removeDocument = () => {
    setDocumentFile(null)
    // Reset file input
    const fileInput = document.getElementById(
      'document-input',
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const onSubmit = async (data: IItems) => {
    setIsSubmitting(true)

    try {
      // Prepare form data if there's a document to upload
      let requestData = data

      if (documentFile) {
        const formData = new FormData()
        formData.append('document', documentFile)

        // Add other form fields
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, value.toString())
            }
          }
        })

        requestData = formData as any
      }

      const response = await axiosInstance.put(
        `/api/items/${itemId}`,
        requestData,
        {
          headers: documentFile
            ? { 'Content-Type': 'multipart/form-data' }
            : undefined,
        },
      )

      if (response.status === 200) {
        toast({
          title: 'Sucesso!',
          description: 'Produto atualizado com sucesso.',
        })

        // Invalidar e revalidar caches para atualizar a tabela
        await Promise.all([
          // Invalidar lista de items (para atualizar a tabela)
          queryClient.invalidateQueries({ queryKey: ['items'] }),
          // Invalidar o item específico
          queryClient.invalidateQueries({ queryKey: ['itemID', itemId] }),
          // Refetch imediato da lista para garantir atualização
          queryClient.refetchQueries({ queryKey: ['items'] }),
        ])

        handleClose()
      } else {
        throw new Error('Erro ao atualizar o produto')
      }
    } catch (error: any) {
      console.error('Erro ao atualizar o produto:', error)
      toast({
        title: 'Erro',
        description:
          error?.response?.data?.message || 'Erro ao atualizar o produto.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    reset()
    setDocumentFile(null)
    setExistingDocument(null)
  }

  // Validation
  const isFormValid =
    watchedValues.name &&
    watchedValues.storage &&
    watchedValues.description &&
    watchedValues.quantity > 0 &&
    watchedValues.precoUnitario > 0 &&
    watchedValues.project &&
    watchedValues.supplier

  // Loading state para os dados específicos
  const isDataLoading =
    itemLoading || currentSupplierLoading || currentProjectLoading

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça alterações no produto selecionado. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>

        {isDataLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Carregando dados do produto...</span>
          </div>
        ) : itemError ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <p className="text-destructive">Erro ao carregar o produto</p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ['itemID', itemId] })
              }
            >
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome do Produto"
                  {...register('name', { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Local de Armazenamento *</Label>
                <Input
                  id="storage"
                  placeholder="Digite o local"
                  {...register('storage', { required: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Digite uma descrição"
                rows={3}
                {...register('description', { required: true })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Digite a quantidade"
                  {...register('quantity', {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoUnitario">Preço Unitário *</Label>
                <Input
                  id="precoUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...register('precoUnitario', {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Projeto *</Label>
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.id || ''}
                      onValueChange={(value) => {
                        const project = allProjects.find((p) => p.id === value)
                        field.onChange(project || null)
                      }}
                      disabled={allProjectsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            allProjectsLoading
                              ? 'Carregando...'
                              : 'Selecione um projeto'
                          }
                        >
                          {field.value && (
                            <div className="flex flex-col text-left">
                              <span className="font-medium">
                                {field.value.name} - {field.value.instituition}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Código: {field.value.id}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {allProjects.map((project) => (
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
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Fornecedor *</Label>
                <Controller
                  name="supplier"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value?.id || ''}
                      onValueChange={(value) => {
                        const supplier = allSuppliers.find(
                          (s) => s.id === value,
                        )
                        field.onChange(supplier || null)
                      }}
                      disabled={allSuppliersLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            allSuppliersLoading
                              ? 'Carregando...'
                              : 'Selecione um fornecedor'
                          }
                        >
                          {field.value && (
                            <div className="flex flex-col text-left">
                              <span className="font-medium">
                                {field.value.corporate_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                CNPJ: {field.value.cnpj}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {allSuppliers.map((supplier) => (
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
                  )}
                />
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-2">
              <Label>Documento Anexo</Label>
              <Card>
                <CardContent className="p-4">
                  {!documentFile && !existingDocument ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Clique para selecionar um documento
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('document-input')?.click()
                        }
                      >
                        Selecionar Arquivo
                      </Button>
                      <input
                        id="document-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documentFile && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">
                                {documentFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(documentFile.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeDocument}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {existingDocument && !documentFile && (
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">
                                Documento existente
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                Anexado anteriormente
                              </Badge>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById('document-input')?.click()
                            }
                          >
                            Substituir
                          </Button>
                        </div>
                      )}

                      <input
                        id="document-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleDocumentChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
