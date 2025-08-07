import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useEffect} from "react";
import {routes} from "@/constants/routes";
import {useDispatch} from "react-redux";
import {setHomeConfig} from "@/redux/slices/config";

const fetchConfig = async (page: string) => {
    const response = await fetch(`/api/admin/config?page=${page}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch config');
    }

    return response.json();
};

export const useConfig = (page: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const {
        data,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['config', page],
        queryFn: ({queryKey}) => {
            const [, currentPage] = queryKey
            return fetchConfig(currentPage as string)
        },
        retry: false,
        enabled: !!page
    });

    useEffect(() => {
        if (data?.config) {
            switch (page) {
                case 'home':
                    dispatch(setHomeConfig(data.config.home))
                    return;
            }
        }
    }, [data]);

    useEffect(() => {
        if (error && error.message.includes('401')) {
            queryClient.clear();
            router.push(routes.DangNhapAdmin);
        }
    }, [error, queryClient, router]);

    return {
        config: data || null,
        loading,
        error: error?.message || null,
        refetch,
    };
};
