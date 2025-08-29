import {useQuery, useQueryClient} from '@tanstack/react-query';

const fetchMaps = async () => {
    const response = await fetch(`/api/admin/config/maps`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchMaps = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['map-admin'],
        queryFn: () => {
            return fetchMaps();
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
