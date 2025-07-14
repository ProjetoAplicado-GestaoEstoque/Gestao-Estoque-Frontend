'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../Components/data-table-column-header'
import type { IStock } from '../../../types/types'
import { StockTableRowActions } from './stock-table-row-actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, ExternalLink, Download, Eye } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// Helper function to get file extension and type
const getFileInfo = (url: string) => {
  if (!url) return { extension: '', type: 'unknown' }

  const extension = url.split('.').pop()?.toLowerCase() || ''

  const typeMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'DOC',
    docx: 'DOCX',
    jpg: 'Imagem',
    jpeg: 'Imagem',
    png: 'Imagem',
    gif: 'Imagem',
    xlsx: 'Excel',
    xls: 'Excel',
    txt: 'Texto',
  }

  return {
    extension,
    type: typeMap[extension] || 'Arquivo',
  }
}

// Helper function to handle document click
const handleDocumentClick = async (documentUrl: string) => {
  try {
    // Se a URL já é um endpoint da nossa API, fazer a requisição para obter a URL presignada
    if (documentUrl.startsWith('/api/aws/s3/')) {
      const response = await fetch(documentUrl)
      const data = await response.json()
      
      if (data.url) {
        // Abrir a URL presignada em nova aba
        window.open(data.url, '_blank', 'noopener,noreferrer')
      } else {
        throw new Error('URL não encontrada')
      }
    } else {
      // URL direta - abrir normalmente
      window.open(documentUrl, '_blank', 'noopener,noreferrer')
    }

    toast({
      title: 'Documento aberto',
      description: 'O documento foi aberto em uma nova aba.',
    })
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Não foi possível abrir o documento.',
      variant: 'destructive',
    })
  }
}

// Helper function to handle download
const handleDocumentDownload = async (
  documentUrl: string,
  fileName?: string,
) => {
  try {
    let downloadUrl = documentUrl

    // Se a URL é um endpoint da nossa API, obter a URL presignada primeiro
    if (documentUrl.startsWith('/api/aws/s3/')) {
      const response = await fetch(documentUrl)
      const data = await response.json()
      
      if (data.url) {
        downloadUrl = data.url
        fileName = fileName || data.fileName
      } else {
        throw new Error('URL não encontrada')
      }
    }

    const response = await fetch(downloadUrl)
    const blob = await response.blob()

    // Create download link
    const downloadLink = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadLink
    link.download = fileName || 'documento'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadLink)

    toast({
      title: 'Download iniciado',
      description: 'O download do documento foi iniciado.',
    })
  } catch (error) {
    toast({
      title: 'Erro no download',
      description: 'Não foi possível fazer o download do documento.',
      variant: 'destructive',
    })
  }
}

export const columns: ColumnDef<IStock>[] = [
  {
    accessorKey: 'id',
    enableHiding: true,
  },
  {
    accessorFn: (row) => row.item.name,
    id: 'item.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Item" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('item.name')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('quantity')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('type')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'documentUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documento" />
    ),
    cell: ({ row }) => {
      const documentUrl = row.getValue('documentUrl') as string
      const documentName = row.original.documentName // Assumindo que existe este campo

      if (!documentUrl) {
        return (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Sem documento
            </Badge>
          </div>
        )
      }

      const fileInfo = getFileInfo(documentUrl)

      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4 text-blue-600" />
            <Badge variant="outline" className="text-xs">
              {fileInfo.type}
            </Badge>
          </div>

          <div className="flex items-center space-x-1">
            {/* View/Open Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDocumentClick(documentUrl)}
              title="Visualizar documento"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* External Link Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDocumentClick(documentUrl)}
              title="Abrir em nova aba"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            {/* Download Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDocumentDownload(documentUrl, documentName)}
              title="Fazer download"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <StockTableRowActions row={row} />,
  },
]
