import { comparePassword } from '@/modules/auth/services/crypt'
import { createToken } from '@/modules/auth/services/token'
import { ISignIn } from '@/modules/auth/types/types'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function POST(nextRequest: Request) {
  try {
    const body: ISignIn = await nextRequest.json()

    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    const passwordMatch = await comparePassword(body.password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Senha inválida' }, { status: 401 })
    }

    createToken(user)

    return NextResponse.json({ message: 'Login realizado com sucesso!' })
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
