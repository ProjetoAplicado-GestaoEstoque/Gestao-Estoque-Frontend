/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const items = await db.item.findMany({
      include: {
        project: true,
        supplier: true,
      },
    })

    return NextResponse.json({ items })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar items:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar items', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar items:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar items', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, storage, description, quantity, supplier_id, project_id } =
      body

    if (!name || !storage || !quantity || !supplier_id || !project_id) {
      return NextResponse.json(
        {
          message:
            'Os campos Nome, Local de armazenamento e Quantidade devem ser preenchidos',
        },
        { status: 400 },
      )
    }

    const newItem = await db.item.create({
      data: {
        name,
        quantity,
        storage,
        description,
        supplier: {
          connect: {
            id: supplier_id,
          },
        },
        project: {
          connect: {
            id: project_id,
          },
        },
      },
    })

    return NextResponse.json(
      { message: 'Produto criado com sucesso', item: newItem },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar Produto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Produto', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao criar Produto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Produto', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
