import {useQuery} from '@tanstack/react-query';

const fetchPolicyDocument = async () => {
    const response = await fetch(`/api/admin/config/policy-document`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchPolicyDocument = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['policy-document'],
        queryFn: fetchPolicyDocument,
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
