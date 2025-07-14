'use client'

import type React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, X } from 'lucide-react'
import { CancelFormButton } from '../CustomComponents/CancelFormButton'
import { ItemSelector } from '../SelectComponents/ItemSelector'
import { StockChangeSelector } from '../SelectComponents/StockChangeSelector'
import { axiosInstance } from '@/axios/api'

const stockSchema = z.object({
  quantity: z.coerce.number().int().positive({
    message: 'Quantidade deve ser um número positivo.',
  }),
  item_id: z.string().uuid({ message: 'Item inválido.' }),
  type: z.string(),
  description: z.string(),
})

export function StockForm() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      item_id: '',
      quantity: 0,
      type: '',
      description: '',
    },
  })

  const watchedType = form.watch('type')
  const showFileUpload = watchedType === 'entrada'

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/estoque/${id}`)
          if (!response.ok) throw new Error('Erro ao buscar Estoque.')
          const itemData = await response.json()
          form.reset(itemData)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [id, form])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/xml',
      'text/xml',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use PDF, XML, Excel ou CSV.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB.')
      return
    }

    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const uploadFileToS3 = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const response = await axiosInstance.post('/api/aws/s3', {
        file: base64,
        fileName: file.name,
        contentType: file.type,
      })

      if (response.status === 500) {
        throw new Error('Erro ao fazer upload do arquivo')
      }

      setUploadProgress(100)
      return file.name
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload do arquivo')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof stockSchema>) => {
    setIsLoading(true)
    try {
      let fileUrl = null

      if (selectedFile && showFileUpload) {
        fileUrl = await uploadFileToS3(selectedFile)
        if (!fileUrl) throw new Error('Falha no upload do arquivo')
      }

      const submitData = {
        ...values,
        ...(fileUrl && { fileUrl }),
      }

      const response = await fetch(id ? `/api/items/${id}` : '/api/estoque', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar dados.')
      }

      router.back()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar dados')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="item_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produto</FormLabel>
              <FormControl>
                <ItemSelector value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite a quantidade"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value))
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Movimentação</FormLabel>
              <FormControl>
                <StockChangeSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showFileUpload && (
          <div className="space-y-4">
            <FormLabel>Anexar Documento</FormLabel>
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                {!selectedFile ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Clique para selecionar ou arraste um arquivo
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, XML, Excel, CSV (máx. 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.xml,.xlsx,.xls,.csv"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading || isUploading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Fazendo upload... {uploadProgress}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite a descrição"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <CancelFormButton path={'/estoque'} />
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
