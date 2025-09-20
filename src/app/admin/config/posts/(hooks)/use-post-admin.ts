import {useQuery} from '@tanstack/react-query';

const fetchSections = async (key: string) => {
    if (key) {
        const response = await fetch(`/api/admin/config/post?key=${key}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useFetchPostAdmin = (key: string | undefined) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['post-admin', key],
        queryFn: () => fetchSections(key as string),
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
