import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo XML não enviado' },
        { status: 400 },
      )
    }

    const xmlText = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml')

    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      return NextResponse.json({ error: 'XML inválido' }, { status: 400 })
    }

    const tipoOperacao =
      xmlDoc.querySelector('ide > tpNF')?.textContent === '0'
        ? 'Entrada'
        : 'Saída'

    const produtos: unknown[] = []
    const itens = xmlDoc.querySelectorAll('det > prod')

    itens.forEach((prod) => {
      const getText = (tag: string) =>
        prod.querySelector(tag)?.textContent?.trim() ?? null

      produtos.push({
        codigo: getText('cProd'),
        descricao: getText('xProd'),
        ncm: getText('NCM'),
        cfop: getText('CFOP'),
        un: getText('uCom'),
        quantidade: getText('qCom')
          ? parseFloat(getText('qCom')!.replace(',', '.'))
          : null,
        valorUnitario: getText('vUnCom')
          ? parseFloat(getText('vUnCom')!.replace(',', '.'))
          : null,
        valorTotal: getText('vProd')
          ? parseFloat(getText('vProd')!.replace(',', '.'))
          : null,
        tipoOperacao,
      })
    })

    if (produtos.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum produto encontrado no XML' },
        { status: 404 },
      )
    }

    return NextResponse.json({ produtos })
  } catch (error) {
    console.error('Erro ao processar XML:', error)
    return NextResponse.json(
      { error: 'Falha ao processar o XML' },
      { status: 500 },
    )
  }
}
