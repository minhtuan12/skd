import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useEffect} from "react";
import {routes} from "@/constants/routes";
import {useDispatch} from "react-redux";
import {setNews, setNewsEventsResearches} from "@/redux/slices/config";

const fetchNewsEvents = async (type: string) => {
    const response = await fetch(`/api/admin/config/news-events?type=${type}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch config');
    }

    return response.json();
};

export const useNewsEvents = (type: string, autoFetch = true) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const {
        data,
        isLoading: loading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['news-events', type],
        queryFn: ({queryKey}) => {
            const [, type] = queryKey
            return fetchNewsEvents(type as string)
        },
        retry: false,
        enabled: !!type && autoFetch
    });

    useEffect(() => {
        if (data?.news_events) {
            switch (type) {
                case 'all':
                    dispatch(setNewsEventsResearches(data.news_events));
                    return;
                default:
                    dispatch(setNews(data.news_events));
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
