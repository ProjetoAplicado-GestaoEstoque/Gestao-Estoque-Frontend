import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cnpj = searchParams.get('cnpj')
  const email = searchParams.get('email')

  try {
    const where: Prisma.CustomerWhereInput = {
      cnpj: cnpj ? { contains: cnpj } : undefined,
      email: email ? { contains: email } : undefined,
    }

    const customers = await db.customer.findMany({
      where,
      select: {
        id: true,
        cnpj: true,
        email: true,
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
