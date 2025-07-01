import { NextResponse } from 'next/server'
import { PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { S3 } from '@/services/aws/s3'

export async function POST(req: Request) {
  try {
    const { file, fileName, contentType } = await req.json()

    if (!file || !fileName || !contentType) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 },
      )
    }

    const base64Data = file.replace(/^data:.*;base64,/, '')

    const buffer = Buffer.from(base64Data, 'base64')

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    })

    await S3.send(command)
    return NextResponse.json({ message: 'Upload feito com sucesso!' })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_BUCKET,
    })
    const { Contents } = await S3.send(command)
    return NextResponse.json({ files: Contents })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Erro ao listar arquivos' },
      { status: 500 },
    )
  }
}
