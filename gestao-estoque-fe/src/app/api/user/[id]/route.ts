import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

/* Get one user by ID */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await db.user
    .findUnique({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não informado' })
  }

  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' })
  }

  return NextResponse.json({ message: `${user?.full_name}` })
}
