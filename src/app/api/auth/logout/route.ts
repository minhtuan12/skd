import {destroySession} from "@/lib/session";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const response = new Response("Đã đăng xuất", {status: 200});
        await destroySession();
        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            {error: 'Đã xảy ra lỗi, vui long thử lại sau'},
            {status: 500}
        );
    }
}
