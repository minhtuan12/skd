import {useQuery} from '@tanstack/react-query';

const fetchPostList = async (key: string) => {
    if (key) {
        const response = await fetch(`/api/admin/config/post/all?key=${key}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useFetchAllPosts = (key: string) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['all-post-admin', key],
        queryFn: () => fetchPostList(key as string),
        enabled: !!key
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
