import {useQuery, useQueryClient} from '@tanstack/react-query';

const fetchTreeTypes = async (q: string, page: number, isPublic: boolean = false) => {
    let url = isPublic ? '/api/config/tree-type' : `/api/admin/config/tree-type?q=${q}&page=${page}`;
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchTreeType = (q: string, page: number, isPublic: boolean = false) => {
    const queryClient = useQueryClient();
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: [isPublic ? 'tree-group' : 'tree-type', q, page],
        queryFn: ({queryKey}) => {
            const [_, q, page] = queryKey
            return fetchTreeTypes(q as string, parseInt(page as string || '1'), isPublic);
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
