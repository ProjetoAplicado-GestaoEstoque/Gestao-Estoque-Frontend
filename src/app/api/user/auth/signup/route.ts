import { ISignUp } from '@/modules/auth/types/types'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function POST(nextRequest: Request) {
  try {
    const body: ISignUp = await nextRequest.json()
    await db.user.create({
      data: {
        full_name: body.full_name,
        email: body.email,
        password: body.password,
        role: body.role,
      },
    })

    return NextResponse.json({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao tentar criar usuário:', error)
      return NextResponse.json(
        { message: 'Erro ao tentar criar usuário', error: error.message },
        { status: 500 },
      )
    } else {
      console.error('Erro ao tentar criar usuário:', error)
      return NextResponse.json(
        { message: 'Erro ao tentar criar usuário', error: 'Unknown error' },
        { status: 500 },
      )
    }
  }
}
