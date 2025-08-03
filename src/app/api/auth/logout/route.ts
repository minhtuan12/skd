import {destroySession} from "@/lib/session";

export async function POST(request: Request) {
    const response = new Response("Đã đăng xuất", {status: 200});
    await destroySession();
    return response;
}
