import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3 } from '@/services/aws/s3'

export async function GET(
  request: NextRequest,
  { params }: { params: { fileName: string } },
) {
  try {
    const { fileName } = params

    if (!fileName) {
      return NextResponse.json(
        { error: 'Nome do arquivo é obrigatório' },
        { status: 400 },
      )
    }

    // Decodificar o nome do arquivo (caso tenha caracteres especiais)
    const decodedFileName = decodeURIComponent(fileName)

    // Criar comando para obter o objeto
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET,
      Key: decodedFileName,
    })

    // Gerar URL presignada válida por 1 hora
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })

    return NextResponse.json({
      url: signedUrl,
      fileName: decodedFileName,
    })
  } catch (error) {
    console.error('Erro ao gerar URL presignada:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar URL de acesso ao documento' },
      { status: 500 },
    )
  }
}
