import {useQuery} from '@tanstack/react-query';

const fetchKnowledge = async (categoryId: string) => {
    const response = await fetch(`/api/admin/config/knowledge?category=${categoryId}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchKnowledge = (categoryId: string) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [`knowledge-${categoryId}`, categoryId],
        queryFn: ({queryKey}) => {
            const [_, categoryId] = queryKey
            return fetchKnowledge(categoryId);
        },
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
