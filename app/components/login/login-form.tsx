'use client'

interface LoginFormProps {
    onCasLogin: () => void
}

export default function LoginForm({ onCasLogin }: LoginFormProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>

                <button
                    onClick={onCasLogin}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    CAS登录
                </button>
            </div>
        </div>
    )
}
