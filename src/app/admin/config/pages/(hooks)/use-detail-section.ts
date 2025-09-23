import {useQuery} from '@tanstack/react-query';

const fetchDetailSection = async (id: string) => {
    if (id) {
        const response = await fetch(`/api/admin/config/section/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useFetchSectionAdmin = (id: string) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['detail-section', id],
        queryFn: () => fetchDetailSection(id),
        enabled: !!id
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
