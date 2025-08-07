import connectDb from "@/lib/db";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";
import {getIronSession} from "iron-session";
import {sessionOptions} from "@/lib/session";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        await connectDb();

        const {username, password} = await request.json();

        if (!username || !password) {
            return new Response("Thiếu username hoặc password", {status: 400});
        }

        const user = await Admin.findOne({username});
        if (!user) {
            return new Response("Tài khoản không đúng", {status: 401});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response("Tài khoản không đúng", {status: 401});
        }

        const response = new Response(JSON.stringify({message: "Đăng nhập thành công"}), {
            status: 200,
            headers: {"Content-Type": "application/json"},
        });

        const session = await getIronSession(request, response, sessionOptions);
        (session as any).user = {id: user._id.toString(), username: user.username, isLoggedIn: true};
        await session.save();

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            {error: 'Đã xảy ra lỗi, vui long thử lại sau'},
            {status: 500}
        );
    }
}
