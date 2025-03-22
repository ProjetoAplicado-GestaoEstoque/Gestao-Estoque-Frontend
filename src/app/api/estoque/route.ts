import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const estoque = await db.stockChanges.findMany(
      {
        include: {
          item: true
        }
      }
    )

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
    const { item_id, quantity, description, type } = body

    if (!item_id || !quantity || !type) {
      return NextResponse.json(
        { message: 'Os obrigatórios campos devem ser preenchidos' },
        { status: 400 }
      )
    }

    const newStockChange = await db.stockChanges.create({
      data: {
        item: {
          connect: {
            id: item_id,  // Usando o ID diretamente no 'connect'
          },
        },
        quantity,
        description,
        type        
      },
    })

    const item = await db.item.findUnique({
      where: {
        id: item_id,
      },
    })
    
    item && await db.item.update({
      where: {
        id: item_id,
      },
      data: {
        quantity: type === 'Saída' ? item.quantity - quantity : item.quantity + quantity
      },
    })

    return NextResponse.json({ message: 'Produto criado com sucesso', stockChange: newStockChange }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar Produto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Produto', error: error.message },
        { status: 500 }
      )
    } else {
      console.error('Erro ao criar Produto:', error)
      return NextResponse.json(
        { message: 'Erro ao criar Produto', error: 'Unknown error' },
        { status: 500 }
      )
    }
  }
}
