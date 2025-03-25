/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const projects = await db.projects.findMany({
      include: {
        customer: true,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      instituition,
      project_manager_id,
      tech_responsible_id,
      customer_id,
    } = body

    if (
      !name ||
      !instituition ||
      !project_manager_id ||
      !tech_responsible_id ||
      !customer_id
    ) {
      return NextResponse.json(
        { message: 'Os campos obrigatórios devem ser preenchidos' },
        { status: 400 },
      )
    }

    const newProject = await db.projects.create({
      data: {
        name,
        instituition,
        project_manager_id,
        tech_responsible_id,
        customer: {
          connect: {
            id: customer_id,
          },
        },
      },
    })

    return NextResponse.json(
      { message: 'Projeto criado com sucesso', project: newProject },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar Projeto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Projeto', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao criar Projeto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Projeto', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
