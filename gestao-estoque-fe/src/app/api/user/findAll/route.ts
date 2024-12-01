import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const db = new PrismaClient()

export async function GET() {
    try {
      const users = await db.user.findMany()
  
      return NextResponse.json({ users })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json(
          { message: 'Erro ao buscar usuários', error: error.message },
          { status: 500 },
        )
      } else {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json(
          { message: 'Erro ao buscar usuários', error: 'Unknown error' },
          { status: 500 },
        )
      }
    }
  }