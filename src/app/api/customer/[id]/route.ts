import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'ID do cliente não informado.' },
      { status: 404 },
    )
  }

  const customer = await db.customer
    .delete({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  return NextResponse.json(customer)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const customer = await db.customer
    .findUnique({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' })
  }

  if (!customer) {
    return NextResponse.json({ message: 'Cliente não encontrado' })
  }

  return NextResponse.json(customer)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' }, { status: 400 })
  }

  const { cnpj, email } = await req.json()

  try {
    const customer = await db.customer.update({
      where: {
        id: params.id,
      },
      data: {
        cnpj,
        email,
      },
    })

    if (!customer) {
      return NextResponse.json(
        { message: 'Cliente não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      message: `Cliente com CNPJ ${customer.cnpj} atualizado com sucesso.`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Erro ao atualizar cliente.' },
      { status: 500 },
    )
  }
}
