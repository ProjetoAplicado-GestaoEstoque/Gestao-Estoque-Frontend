import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const db = new PrismaClient()

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const instituition = searchParams.get('instituition')
  const customerId = searchParams.get('customerId')

  try {
    const where: Prisma.ProjectsWhereInput = {
      name: name ? { contains: name } : undefined,
      instituition: instituition ? { contains: instituition } : undefined,
      customer: customerId ? { id: { contains: customerId } } : undefined,
    }

    const projects = await db.projects.findMany({
      where,
      include: {
        project_manager: true,
        tech_responsible: true,
        customer: true,
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
