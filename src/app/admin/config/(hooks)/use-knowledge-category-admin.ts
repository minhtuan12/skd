import {useQuery} from '@tanstack/react-query';

const fetchKnowledgeCategory = async () => {
    const response = await fetch('/api/admin/config/knowledge-category', {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchKnowledgeCategoryAdmin = () => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useQuery({
        queryKey: ['knowledge-category-admin'],
        queryFn: fetchKnowledgeCategory
    });

    return {
        data,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
