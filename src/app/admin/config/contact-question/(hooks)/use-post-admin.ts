import {useQuery} from '@tanstack/react-query';

const fetchPostList = async (key: string, sectionId: string) => {
    if (key) {
        let url = `/api/admin/config/post/list?key=${key}`;
        if (sectionId) {
            url += `&sectionId=${sectionId}`;
        }
        const response = await fetch(url, {
            credentials: 'include',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useFetchPostList = (key: string, sectionId = '') => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['post-list-admin', key + sectionId],
        queryFn: () => fetchPostList(key as string, sectionId),
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
