import {NextRequest, NextResponse} from 'next/server';
import {isAuthenticated} from "@/lib/session";

type ApiHandler = (request: NextRequest) => Promise<NextResponse> | NextResponse;
type ApiHandlerContext<T = any> = (
    request: NextRequest,
    context: { params: Promise<T> }
) => Promise<NextResponse> | NextResponse;


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

export function withAuthWithContext<T extends Record<string, string> = {}>(
    handler: ApiHandlerContext<T>
): ApiHandlerContext<T> {
    return async (request: NextRequest, context: { params: Promise<T> }) => {
        try {
            const isLoggedIn = await isAuthenticated();

            if (!isLoggedIn) {
                return NextResponse.json(
                    {error: "Unauthorized", message: "Lỗi xác thực"},
                    {status: 401}
                );
            }

            return await handler(request, context);
        } catch (error) {
            console.error("Auth middleware error:", error);
            return NextResponse.json(
                {error: "Internal Server Error", message: "Đã có lỗi xảy ra"},
                {status: 500}
            );
        }
    };
}
