import {useQuery, useQueryClient} from '@tanstack/react-query';

const fetchSubCategory = async (categoryId: string) => {
    const response = await fetch(`/api/config/knowledge-category/${categoryId}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchSubCategory = (categoryId: string) => {
    const queryClient = useQueryClient();
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['sub-category', categoryId],
        enabled: !!categoryId,
        queryFn: () => {
            return fetchSubCategory(categoryId);
        }
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
