import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get('itemId')
  const type = searchParams.get('type')

  try {
    const where: Prisma.StockChangesWhereInput = {
      item: itemId ? { id: { contains: itemId } } : undefined,
      type: type ? { equals: type } : undefined,
    }

    const stockChanges = await db.stockChanges.findMany({
      where,
      select: {
        id: true,
        quantity: true,
        type: true,
        item: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ estoque: stockChanges })
  } catch (error) {
    console.error('Error fetching stock changes:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
