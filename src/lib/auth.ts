// lib/auth.ts
import { headers } from 'next/headers'

export async function getCurrentUser() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  const email = headersList.get('x-user-email')
  
  return userId ? { id: userId, email } : null
}