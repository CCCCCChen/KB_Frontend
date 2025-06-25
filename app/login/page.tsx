'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import LoginForm from '@/app/components/login/login-form'

export default function LoginPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // 检查CAS登录成功的参数
    useEffect(() => {
        const casUser = searchParams.get('cas_user')
        const casLogin = searchParams.get('cas_login')
        
        if (casLogin === 'success' && casUser) {
            console.log('CAS login successful, signing in user:', casUser)
            
            // 使用NextAuth的credentials provider登录
            signIn('credentials', {
                username: casUser,
                callbackUrl: '/',
                redirect: true
            }).then((result) => {
                console.log('NextAuth signIn result:', result)
                if (result?.ok) {
                    router.push('/')
                }
            }).catch((error) => {
                console.error('NextAuth signIn error:', error)
            })
        }
    }, [searchParams, router])
    
    // 处理CAS登录
    const handleCasLogin = () => {
        // 获取客户端环境变量
        const casBaseUrl = process.env.NEXT_PUBLIC_CAS_BASE_URL
        const casServiceUrl = process.env.NEXT_PUBLIC_CAS_SERVICE_URL
        
        // 检查环境变量是否设置
        if (!casBaseUrl || !casServiceUrl) {
            console.error('CAS环境变量未设置!')
            console.error(`NEXT_PUBLIC_CAS_BASE_URL: ${casBaseUrl}`)
            console.error(`NEXT_PUBLIC_CAS_SERVICE_URL: ${casServiceUrl}`)
            alert('CAS配置错误：请检查环境变量设置')
            return
        }

        // 构建CAS登录URL
        const serviceUrl = encodeURIComponent(casServiceUrl)
        const casUrl = `${casBaseUrl}/login?service=${serviceUrl}`

        console.log('重定向到CAS URL:', casUrl)
        window.location.href = casUrl
    }

    return (
        <LoginForm onCasLogin={handleCasLogin} />
    )
}
