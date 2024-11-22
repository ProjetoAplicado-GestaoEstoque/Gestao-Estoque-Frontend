import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const user = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const username = await user.user.findUnique({
    where: {
      id: id as string,
    },
  })
  return NextResponse.json({ message: `${username?.full_name}` })
}
