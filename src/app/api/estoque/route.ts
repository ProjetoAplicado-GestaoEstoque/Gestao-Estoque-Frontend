/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const estoque = await db.stockChanges.findMany({
      include: {
        item: true,
      },
    })

    return NextResponse.json({ estoque })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar estoques:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar estoques', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar estoques:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar estoques', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { item_id, quantity, description, type, documentUrl, documentName } =
      body

    if (!item_id || !quantity || !type) {
      return NextResponse.json(
        { message: 'Os obrigatórios campos devem ser preenchidos' },
        { status: 400 },
      )
    }

    const newStockChange = await db.stockChanges.create({
      data: {
        item: {
          connect: {
            id: item_id,
          },
        },
        quantity,
        description,
        type,
        documentUrl,
        documentName,
      },
    })

    const item = await db.item.findUnique({
      where: {
        id: item_id,
      },
    })

    if (item) {
      // Calcular nova quantidade
      let newQuantity
      if (type === 'saída' || type === 'Saída') {
        newQuantity = item.quantity - quantity
      } else {
        newQuantity = item.quantity + quantity
      }

      // Se a quantidade ficar zero ou negativa, marcar como deletado (soft delete)
      if (newQuantity <= 0) {
        await db.item.update({
          where: {
            id: item_id,
          },
          data: {
            quantity: 0, // Zerar a quantidade
            deletedAt: new Date(), // Marcar como deletado
          },
        })
      } else {
        // Atualizar apenas a quantidade
        await db.item.update({
          where: {
            id: item_id,
          },
          data: {
            quantity: newQuantity,
          },
        })
      }
    }

    return NextResponse.json(
      { message: 'Produto criado com sucesso', stockChange: newStockChange },
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
