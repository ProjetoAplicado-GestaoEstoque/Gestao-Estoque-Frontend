import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const items = await db.item.findMany()

    return NextResponse.json({ items })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar items:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar items', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar items:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar items', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
