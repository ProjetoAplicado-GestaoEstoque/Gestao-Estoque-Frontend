import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const projectId = searchParams.get('projectId')
  const supplierId = searchParams.get('supplierId')

  try {
    const where: Prisma.ItemWhereInput = {
      name: name ? { contains: name } : undefined,
      Projects: projectId ? { some: { id: projectId } } : undefined,
      Supplier: supplierId ? { some: { id: supplierId } } : undefined,
    }

    const items = await db.item.findMany({
      where,
      include: {
        Projects: true,
        Supplier: true,
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
