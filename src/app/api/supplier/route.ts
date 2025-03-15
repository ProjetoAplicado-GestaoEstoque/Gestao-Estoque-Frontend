import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const supplier = await db.supplier.findMany()

    return NextResponse.json({ supplier })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar fornecedor:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar fornecedor', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar fornecedor:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar fornecedor', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
