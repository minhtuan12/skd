import {useQuery} from '@tanstack/react-query';

const fetchIntroduction = async (page: string) => {
    const response = await fetch(`/api/admin/config/introduction?page=${page}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchIntroduction = (page: string) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: [`introduction-${page}`, page],
        queryFn: ({queryKey}) => {
            const [_, page] = queryKey;
            return fetchIntroduction(page);
        },
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
