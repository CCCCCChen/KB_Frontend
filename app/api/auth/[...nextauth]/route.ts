import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        // 添加CredentialsProvider以支持开发环境模拟登录
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" }
            },
            async authorize(credentials, req) {
                // 开发环境允许模拟登录
                if (process.env.NODE_ENV === 'development') {
                    return { id: credentials?.username || '1', name: credentials?.username || 'user' }
                }

                // 生产环境也允许CAS用户登录
                if (credentials?.username) {
                    return {
                        id: credentials.username,
                        name: credentials.username,
                        email: `${credentials.username}@example.com`
                    }
                }

                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login' // 自定义登录页
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
