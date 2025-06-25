import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const userPrefix = `user_${APP_ID}:`

export const getInfo = async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  const sessionId = request.cookies.get('session_id')?.value || v4()

  // 如果用户已登录，使用真实的用户名；否则使用sessionId
  const user = session?.user?.name
    ? userPrefix + session.user.name
    : userPrefix + sessionId

  return {
    sessionId,
    user,
    userInfo: session?.user || null,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
