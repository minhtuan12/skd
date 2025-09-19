import {useQuery} from '@tanstack/react-query';

const fetchUploadedFiles = async () => {
    const response = await fetch(`/api/admin/cloud-files`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchUploadedFiles = (condition: boolean) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['uploaded-files'],
        queryFn: () => {
            return fetchUploadedFiles();
        },
        enabled: condition
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
