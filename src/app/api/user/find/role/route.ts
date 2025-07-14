import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')

    const whereClause = role
      ? { role: role as 'tech_responsible' | 'project_manager' }
      : {}

    const users = await db.user.findMany({
      where: {
        role: whereClause.role ?? undefined,
        deletedAt: null,
      },
      select: {
        id: true,
        full_name: true,
        role: true,
        email: true,
      },
    })

    return NextResponse.json({
      users,
      count: users.length,
      filter: role ? { role } : null,
    })
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
