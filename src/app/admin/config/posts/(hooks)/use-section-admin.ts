import {useQuery} from '@tanstack/react-query';

const fetchSections = async () => {
    const response = await fetch('/api/admin/config/section', {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchSectionAdmin = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['section-admin'],
        queryFn: fetchSections
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
