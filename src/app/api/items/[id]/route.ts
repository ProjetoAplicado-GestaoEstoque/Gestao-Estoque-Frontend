import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const items = await db.item
    .delete({
      where: {
        id: params.id,
      },
      include: { project: true, supplier: true },
    })
    .catch((err) => console.log(err));

  if (!params.id) {
    return NextResponse.json({ message: "ID não encontrado" });
  }

  if (!items) {
    return NextResponse.json({ message: "Produtos não encontrado" });
  }

  return NextResponse.json({ message: `${items?.name}` });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const items = await db.item
    .findUnique({
      where: {
        id: params.id,
      },
      include: { project: true, supplier: true },
    })
    .catch((err) => console.log(err));

  if (!params.id) {
    return NextResponse.json({ message: "ID não encontrado" });
  }

  if (!items) {
    return NextResponse.json({ message: "Produtos não encontrado" });
  }

  return NextResponse.json(items);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ message: "ID não encontrado" }, { status: 400 });
  }

  const { name, storage, description, quantity } = await req.json();

  try {
    const item = await db.item.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        storage,
        description,
        quantity,
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Produto com ID: ${item.id} atualizado com sucesso.`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao atualizar produto." },
      { status: 500 }
    );
  }
}
