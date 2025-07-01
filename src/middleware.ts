import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/projetos', '/clientes', '/produtos', '/fornecedor'],
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (req.nextUrl.pathname.startsWith('/auth')) {
    if (token) return NextResponse.redirect(new URL('/projetos', req.url))
    return NextResponse.next()
  }

  if (config.matcher.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) return NextResponse.redirect(new URL('auth', req.url))
    return NextResponse.next()
  }

  return NextResponse.next()
}
