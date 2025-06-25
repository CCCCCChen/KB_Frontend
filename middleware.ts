import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const { pathname } = request.nextUrl

    // 调试信息
    // console.log('Middleware - pathname:', pathname)
    // console.log('Middleware - token:', !!token)
    // if (token) {
    //     console.log('Middleware - user:', token.name)
    // }

    // 允许访问登录页面和API路由
    if (pathname.startsWith('/login') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/cas')) {
        return NextResponse.next()
    }

    // 检查NextAuth token
    if (!token) {
        // console.log('Middleware - redirecting to login')
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // console.log('Middleware - allowing access')

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
