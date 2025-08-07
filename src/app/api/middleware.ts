import {NextRequest, NextResponse} from 'next/server';
import {isAuthenticated} from "@/lib/session";

type ApiHandler = (request: NextRequest) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: ApiHandler): ApiHandler {
    return async (request: NextRequest) => {
        try {
            const isLoggedIn = await isAuthenticated();

            if (!isLoggedIn) {
                return NextResponse.json(
                    {
                        error: 'Unauthorized',
                        message: 'Lỗi xác thực',
                    },
                    {status: 401}
                );
            }

            return await handler(request);
        } catch (error) {
            console.error('Auth middleware error:', error);
            return NextResponse.json(
                {
                    error: 'Internal Server Error',
                    message: 'Đã có lỗi xảy ra'
                },
                {status: 500}
            );
        }
    };
}
