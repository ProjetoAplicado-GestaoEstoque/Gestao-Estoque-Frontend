/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const stock = await db.stockChanges
    .delete({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' })
  }

  if (!stock) {
    return NextResponse.json({ message: 'Estoque não encontrado' })
  }

  return NextResponse.json({ message: `${stock?.id}` })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const stock = await db.stockChanges.findUnique({
      where: { id: params.id },
      include: { item: true },
    })

    if (!stock) {
      return NextResponse.json(
        { message: 'Estoque não encontrado.' },
        { status: 404 }, // Not Found
      )
    }

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Database Error:', error)

    return NextResponse.json(
      { message: 'Erro ao buscar o estoque. Tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' }, { status: 400 })
  }

  const { item_id, quantity, type } = await req.json()

  try {
    const stock = await db.stockChanges.update({
      where: {
        id: params.id,
      },
      data: {
        item_id,
        quantity,
        type,
      },
    })

    if (!stock) {
      return NextResponse.json(
        { message: 'Estoque não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      message: `Estoque com ID: ${stock.id} atualizado com sucesso.`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Erro ao atualizar estoque.' },
      { status: 500 },
    )
  }
}
