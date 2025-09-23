import {useQuery} from '@tanstack/react-query';

const fetchPostList = async (key: string) => {
    if (key) {
        const response = await fetch(`/api/admin/config/post/list?key=${key}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useFetchPostList = (key: string) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['post-list-admin', key],
        queryFn: () => fetchPostList(key as string),
        enabled: !!key,
        staleTime: 0,
        refetchOnMount: true
    });

    return {
        refetch,
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
