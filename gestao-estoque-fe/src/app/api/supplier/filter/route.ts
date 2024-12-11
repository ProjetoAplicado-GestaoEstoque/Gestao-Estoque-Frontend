import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const corporateName = searchParams.get('corporateName')
  const cnpj = searchParams.get('cnpj')
  const email = searchParams.get('email')

  try {
    const where: Prisma.SupplierWhereInput = {
      corporate_name: corporateName ? { contains: corporateName } : undefined,
      cnpj: cnpj ? { contains: cnpj } : undefined,
      email: email ? { contains: email } : undefined,
    }

    const suppliers = await db.supplier.findMany({
      where,
      select: {
        id: true,
        corporate_name: true,
        cnpj: true,
        phone: true,
        email: true,
        address: true,
      },
    })

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
