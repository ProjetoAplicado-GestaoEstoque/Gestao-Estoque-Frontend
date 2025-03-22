import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function GET() {
  try {
    const supplier = await db.supplier.findMany();

    return NextResponse.json({ supplier });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar fornecedor:", error);
      return NextResponse.json(
        { message: "Erro ao buscar fornecedor", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Erro ao buscar fornecedor:", error);
      return NextResponse.json(
        { message: "Erro ao buscar fornecedor", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { corporate_name, cnpj, phone, email, address } = body;

    if (!corporate_name || !cnpj || !phone) {
      return NextResponse.json(
        { message: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const newFornecedor = await db.supplier.create({
      data: {
        corporate_name,
        cnpj,
        phone,
        email,
        address,
      },
    });

    return NextResponse.json(
      { message: "Fornecedor criado com sucesso", fornecedor: newFornecedor },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao criar Fornecedor:", error);
      return NextResponse.json(
        { message: "Erro ao criar Fornecedor", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Erro ao criar Fornecedor:", error);
      return NextResponse.json(
        { message: "Erro ao criar Fornecedor", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
