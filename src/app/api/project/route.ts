import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const projects = await db.projects.findMany({
      include: {
        customer: true,
        project_manager: true,
        tech_responsible: true,
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar projetos:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar projetos', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar projetos:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar projetos', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
