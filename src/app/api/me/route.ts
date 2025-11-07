// app/api/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || 'mysecretkey'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) return NextResponse.json({ userId: null })

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY))
    return NextResponse.json({ userId: (payload as any).id,userName: (payload as any).username, userRole: (payload as any).role })
  } catch {
    return NextResponse.json({ userId: null })
  }
}
