'use client'

import type React from 'react'

import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

interface XmlUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onRemoveFile: () => void
}

export function XmlUpload({
  onFileSelect,
  selectedFile,
  onRemoveFile,
}: XmlUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSelectFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file) {
      validateAndSelectFile(file)
    }
  }

  const validateAndSelectFile = (file: File) => {
    if (file.type !== 'text/xml' && !file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: 'Arquivo inválido',
        description: 'Por favor, selecione apenas arquivos XML.',
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

    onFileSelect(file)
    toast({
      title: 'Arquivo carregado',
      description: 'XML da nota fiscal carregado com sucesso.',
    })
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-colors min-h-[120px] sm:min-h-[160px] ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-medium">
                Upload do XML da Nota Fiscal
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Arraste e solte o arquivo XML aqui ou clique para selecionar
              </p>
              <p className="text-xs sm:hidden text-muted-foreground">
                (Arraste e solte é mais rápido!)
              </p>
            </div>
            <Button
              className="mt-3 sm:mt-4 w-full sm:w-auto"
              onClick={() => document.getElementById('xml-input')?.click()}
            >
              Selecionar Arquivo XML
            </Button>
            <input
              id="xml-input"
              type="file"
              accept=".xml,text/xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveFile}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
