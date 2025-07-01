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
    const {
      name,
      storage,
      description,
      precoUnitario,
      quantity,
      supplier_id,
      project_id,
    } = body

    console.log('Dados recebidos para criar Produto:', supplier_id);


    if (!name) return NextResponse.json(
      { message: 'Nome do produto é obrigatório' },
      { status: 400 },
    )
    if (!storage) return NextResponse.json(
      { message: 'Local de armazenamento é obrigatório' },
      { status: 400 },
    )
    if (!precoUnitario && precoUnitario !== 0) return NextResponse.json(
      { message: 'Preço unitário é obrigatório' },
      { status: 400 },
    )
    if (!quantity && quantity !== 0) return NextResponse.json(
      { message: 'Quantidade é obrigatória' },
      { status: 400 },
    )
    if (!supplier_id) return NextResponse.json(
      { message: 'ID do fornecedor é obrigatório' },
      { status: 400 },
    )
    if (!project_id) return NextResponse.json(
      { message: 'ID do projeto é obrigatório' },
      { status: 400 },
    )

    const newItem = await db.item.create({
      data: {
        name,
        quantity,
        precoUnitario: Number(precoUnitario),
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
