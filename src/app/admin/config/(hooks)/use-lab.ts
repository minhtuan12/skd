import {useQuery} from '@tanstack/react-query';

const fetchLabs = async () => {
    const response = await fetch(`/api/admin/config/lab`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchLabs = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['lab-admin'],
        queryFn: () => {
            return fetchLabs();
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
