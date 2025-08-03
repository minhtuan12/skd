import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

export const sessionOptions = {
    password: process.env.SESSION_KEY!,
    cookieName: "skd-session",
    cookieOptions: {
        // secure: process.env.NODE_ENV === "production",
        maxAge: 30
    },
};

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: string;
            email: string;
        };
    }
}

export interface SessionData {
    user: {
        id?: string;
        username?: string;
        isLoggedIn?: boolean;
    }
}

export async function getSession() {
    return await getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function destroySession() {
    const session = await getSession();
    session.destroy();
}

export async function isAuthenticated() {
    const session = await getSession();
    return session?.user?.isLoggedIn === true && !!session?.user?.id;
}
