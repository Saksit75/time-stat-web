import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const SECRET_KEY = process.env.SECRET_KEY || 'mysupersecret'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // ตรวจสอบข้อมูล login (ในที่นี้ใช้ข้อมูลจำลอง)
    // ในโปรเจคจริงควรตรวจสอบกับฐานข้อมูล
    if (username === 'admin' && password === 'password') {
      // สร้าง JWT token
      const token = await new SignJWT({ 
        username: username,
        userId: '1',
        role: 'admin'
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // หมดอายุใน 24 ชั่วโมง
        .sign(new TextEncoder().encode(SECRET_KEY))

      // สร้าง response และตั้งค่า cookie
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login สำเร็จ',
        user: { username, role: 'admin' }
      })

      // ตั้งค่า access_token cookie
      response.cookies.set('access_token', token, {
        httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
        secure: process.env.NODE_ENV === 'production', // ใช้ HTTPS ใน production
        sameSite: 'lax', // CSRF protection
        maxAge: 24 * 60 * 60, // 24 ชั่วโมง (เป็นวินาที)
        path: '/' // ใช้ได้ทุก path
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    )
  }
}

