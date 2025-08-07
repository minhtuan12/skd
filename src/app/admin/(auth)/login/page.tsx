"use client"

import type * as React from "react"
import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Eye, EyeOff, Loader2} from "lucide-react"
import {useLogin} from "@/app/admin/(auth)/(hooks)/use-login";
import Link from "next/link";
import {routes} from "@/constants/routes";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string>("")
    const {mutate, isPending} = useLogin();
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username || !password) {
            setError("Vui lòng điền đầy đủ thông tin")
            return;
        }
        mutate({username, password}, {
            onError: (error) => {
                setError(error as any);
            },
            onSuccess: () => {
                router.push(routes.HomeConfig)
            }
        })
    }

    useEffect(() => {
        if (username || password) {
            setError("")
        }
    }, [username, password]);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 -mt-20">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Trang Quản Trị</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Đăng nhập bằng tài khoản quản trị
                        viên</p>
                </div>

                {/* Login Card */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Chào mừng trở lại</CardTitle>
                        <CardDescription className="text-center">Đăng nhập để truy cập trang quản trị</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label required htmlFor="username">Tên tài khoản
                                    </Label>
                                </div>
                                <Input
                                    className={error ? 'border-[red] border-solid border' : ''}
                                    id="username"
                                    placeholder="Nhập tên tài khoản"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label required htmlFor="password">Mật khẩu</Label>
                                </div>
                                <div className="relative">
                                    <Input
                                        className={error ? 'border-[red] border-solid border' : ''}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isPending}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isPending}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                    </Button>
                                </div>
                            </div>

                            {error ?
                                <div className={'text-[red] text-center w-full mb-1.5 text-sm'}>{error}</div> : ''}
                            <Button type="submit" className="w-full cursor-pointer hover:opacity-90"
                                    disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Đăng nhập
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className={'w-full text-center'}>
                    <Link href={routes.TrangChu} className={'text-sm underline'}>Về trang chủ</Link>
                </div>
            </div>
        </div>
    )
}
