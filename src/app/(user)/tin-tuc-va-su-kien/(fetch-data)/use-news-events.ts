import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useEffect} from "react";
import {routes} from "@/constants/routes";
import {fetchNewsEvents} from "@/app/(user)/tin-tuc-va-su-kien/(fetch-data)/fetch-news-events";

export const useNewsEvents = (type: 'news' | 'events', page = 1) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['news-events', type + page.toString()],
        queryFn: ({queryKey}) => {
            const [, type, page] = queryKey
            return fetchNewsEvents(type as any, parseInt(page || '1'));
        },
        retry: false,
    });

    useEffect(() => {
        if (error && error.message.includes('401')) {
            queryClient.clear();
            router.push(routes.DangNhapAdmin);
        }
    }, [error, queryClient, router]);

    return {
        data: data || null,
        loading,
        error: error?.message || null,
        refetch,
    };
};
