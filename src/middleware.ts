import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey'

interface JWTPayload {
  id: string
  username: string
  role?: string
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  // Public paths ที่ไม่ต้อง auth
  const publicPaths = ['/login', '/register', '/forgot-password']
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  )

  if (isPublicPath) {
    // ถ้ามี token แล้ว redirect ไป home
    if (token) {
      try {
        await jwtVerify(token, new TextEncoder().encode(SECRET_KEY))
        return NextResponse.redirect(new URL('/', request.url))
      } catch {
        // Token invalid, ให้เข้าหน้า public ได้
      }
    }
    return NextResponse.next()
  }

  // Protected routes - ต้องมี token
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname) // เก็บ path เดิมไว้
    return NextResponse.redirect(url)
  }

  // Verify token
  try {
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(SECRET_KEY)
    ) as { payload: JWTPayload }
    
    // เพิ่ม user data เข้า headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.id)
    requestHeaders.set('x-user-username', payload.username)
    if (payload.role) {
      requestHeaders.set('x-user-role', payload.role)
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (err) {
    console.error('JWT verification failed:', err)
    
    // ลบ cookie และ redirect
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('access_token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}