import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {IAdmin} from "@/models/admin";
import {useEffect} from "react";
import {routes} from "@/constants/routes";

const fetchMe = async (): Promise<IAdmin> => {
    const response = await fetch('/api/auth/me', {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
};

export const useMe = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: admin,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,
    });

    useEffect(() => {
        if (error && error.message.includes('401')) {
            queryClient.clear();
            router.push(routes.DangNhapAdmin);
        }
    }, [error, queryClient, router]);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            queryClient.clear();
            router.push(routes.DangNhapAdmin);
        }
    };

    return {
        admin: admin || null,
        loading,
        error: error?.message || null,
        refetch,
        logout,
    };
};
