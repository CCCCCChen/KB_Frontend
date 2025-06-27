import { NextResponse } from 'next/server'
import CAS from 'node-cas'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const ticket = searchParams.get('ticket')

    if (!ticket) {
        return NextResponse.json({ error: 'Missing ticket parameter' }, { status: 400 })
    }

    try {
        // 正确实例化CAS（使用库要求的参数名）
        const cas = new CAS({
            cas_url: process.env.CAS_BASE_URL!,
            service_url: process.env.CAS_SERVICE_URL!
        })

        // 手动验证CAS ticket
        const casLoginUrl = `${process.env.CAS_BASE_URL}/serviceValidate`
        const serviceUrl = encodeURIComponent(process.env.CAS_SERVICE_URL!)
        const validateUrl = `${casLoginUrl}?ticket=${ticket}&service=${serviceUrl}`

        try {
            const response = await fetch(validateUrl)
            const xmlText = await response.text()

            // 简单的XML解析来检查验证结果
            if (xmlText.includes('<cas:authenticationSuccess>')) {
                // 提取用户名
                const userMatch = xmlText.match(/<cas:user>([^<]+)<\/cas:user>/)
                const username = userMatch ? userMatch[1] : 'unknown'

                // CAS验证成功，重定向到登录页面并传递用户信息
                console.log('CAS validation successful for user:', username)

                // 重定向到登录页面，让前端处理登录
                const redirectUrl = new URL('/login', request.url)
                redirectUrl.searchParams.set('cas_user', username)
                redirectUrl.searchParams.set('cas_login', 'success')

                return NextResponse.redirect(redirectUrl)
            } else {
                console.error('CAS validation failed. Response:', xmlText)
                return NextResponse.json({ error: 'Ticket validation failed' }, { status: 401 })
            }
        } catch (fetchError) {
            console.error('CAS validation fetch error:', fetchError)
            return NextResponse.json({ error: 'CAS server communication failed' }, { status: 500 })
        }
    } catch (error) {
        console.error('CAS validation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
