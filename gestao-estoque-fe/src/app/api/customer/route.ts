import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      include: {
        projects: true,
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar clientes', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar clientes', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
