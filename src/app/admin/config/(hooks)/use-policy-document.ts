import {useQuery} from '@tanstack/react-query';

const fetchPolicyDocument = async (page: number) => {
    const response = await fetch(`/api/admin/config/policy-document?page=${page}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchPolicyDocument = (page: number) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [`policy-document`, page],
        queryFn: () => fetchPolicyDocument(page),
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
