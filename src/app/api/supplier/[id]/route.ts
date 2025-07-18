/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const db = new PrismaClient()

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'ID do fornecedor não encontrado!' },
      { status: 404 },
    )
  }

  await db.supplier
    .delete({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  return NextResponse.json({ error: 'Deletedo com sucesso!' }, { status: 201 })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supplier = await db.supplier
    .findUnique({
      where: {
        id: params.id,
      },
    })
    .catch((err) => console.log(err))

  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' })
  }

  if (!supplier) {
    return NextResponse.json({ message: 'Fornecedor não encontrado' })
  }

  return NextResponse.json(supplier)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!params.id) {
    return NextResponse.json({ message: 'ID não encontrado' }, { status: 400 })
  }

  const { corporate_name, cnpj, phone, email, address } = await req.json()

  try {
    const stock = await db.supplier.update({
      where: {
        id: params.id,
      },
      data: {
        corporate_name,
        cnpj,
        email,
        phone,
        address,
      },
    })

    if (!stock) {
      return NextResponse.json(
        { message: 'Fornecedor não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      message: `Fornecedor com ID: ${stock.id} atualizado com sucesso.`,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Erro ao atualizar Fornecedor.' },
      { status: 500 },
    )
  }
}
