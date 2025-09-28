import {useQuery} from '@tanstack/react-query';

const fetchFooter = async () => {
    const url = `/api/admin/config/footer`;
    const response = await fetch(url, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchFooter = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['footer'],
        queryFn: ({queryKey}) => {
            return fetchFooter();
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
