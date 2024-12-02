import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
  try {
    const customers = await db.customer.findMany({
      include: {
        projects: true,
      },
    })

    return NextResponse.json({ customers })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar clientes', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json(
        { message: 'Erro ao buscar clientes', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cnpj, email } = body

    if (!cnpj || !email) {
      return NextResponse.json(
        { message: 'CNPJ e email são obrigatórios' },
        { status: 400 }
      )
    }

    const existingCustomer = await db.customer.findFirst({
      where: {
        OR: [
          { cnpj },
          { email }
        ]
      }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'Cliente já existe com este CNPJ ou email' },
        { status: 409 }
      )
    }

    const newCustomer = await db.customer.create({
      data: {
        cnpj,
        email,
      },
    })

    return NextResponse.json({ message: 'Cliente criado com sucesso', customer: newCustomer }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao criar cliente:', error)
      return NextResponse.json(
        { message: 'Erro ao criar cliente', error: error.message },
        { status: 500 }
      )
    } else {
      console.error('Erro ao criar cliente:', error)
      return NextResponse.json(
        { message: 'Erro ao criar cliente', error: 'Unknown error' },
        { status: 500 }
      )
    }
  }
}
