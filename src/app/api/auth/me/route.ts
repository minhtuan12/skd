import {getSession} from "@/lib/session";
import {NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Admin from "@/models/admin";
import {withAuth} from "@/app/api/middleware";

async function getMe(request: Request) {
    try {
        const session = await getSession();

        await connectDb();
        const admin = await Admin.findById(session.user.id).select('-password');
        if (!admin) {
            return NextResponse.json(
                {error: 'Tài khoản không tồn tại'},
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
            {error: 'Đã xảy ra lỗi, vui lòng thử lại sau'},
            {status: 500}
        );
    }
}

export const GET = withAuth(getMe);
