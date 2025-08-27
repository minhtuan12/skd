import {useQuery} from '@tanstack/react-query';

const fetchTreeTypes = async (q: string, page: number) => {
    const response = await fetch(`/api/admin/config/tree-type?q=${q}&page=${page}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchTreeType = (q: string, page: number) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['tree-type', q, page],
        queryFn: ({queryKey}) => {
            const [_, q, page] = queryKey
            return fetchTreeTypes(q as string, parseInt(page as string || '1'));
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
