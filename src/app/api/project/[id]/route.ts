/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = await db.projects
    .findUnique({
      where: {
        id: params.id,
      },
      include: {
        customer: true,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' })
  }

  if (!project) {
    return NextResponse.json({ message: 'Projeto não encontrado' })
  }

  return NextResponse.json(project)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' }, { status: 400 })
  }

  const { project_manager, tech_responsible, customer_id, name, instituition } =
    await req.json()

  try {
    const stock = await db.projects.update({
      where: {
        id: params.id,
      },
      data: {
        project_manager,
        tech_responsible,
        customer: {
          connect: {
            id: customer_id,
          },
        },
        name,
        instituition,
      },
    })

    if (!stock) {
      return NextResponse.json(
        { message: 'Projeto não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      message: `Projeto com ID: ${stock.id} atualizado com sucesso.`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Erro ao atualizar Projeto.' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const project = await db.projects
    .delete({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' })
  }

  if (!project) {
    return NextResponse.json({ message: 'Projeto não encontrado' })
  }

  return NextResponse.json({ message: `${project?.name}` })
}
