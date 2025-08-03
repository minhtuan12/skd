import {getSession, isAuthenticated} from "@/lib/session";
import {NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                {error: 'Lỗi xác thực'},
                {status: 401}
            );
        }

        const session = await getSession();

        await connectDb();
        const admin = await Admin.findById(session.user.id).select('-password');
        if (!admin) {
            return NextResponse.json(
                {error: 'Tài khooản không tồn tại'},
                {status: 404}
            );
        }

        return NextResponse.json({
            _id: admin._id,
            username: admin.username,
        });
    } catch (error) {
        console.error('Get admin error:', error);
        return NextResponse.json(
            {error: 'Đã xảy ra lỗi, vui long thử lại sau'},
            {status: 500}
        );
    }
}
