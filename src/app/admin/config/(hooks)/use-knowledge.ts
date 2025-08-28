import {useQuery} from '@tanstack/react-query';
import {KnowledgeType} from "@/models/knowledge";

const fetchKnowledge = async (category: KnowledgeType) => {
    const response = await fetch(`/api/admin/config/knowledge?category=${category}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useFetchKnowledge = (category: KnowledgeType) => {
    const {
        data,
        isPending: loading,
        isSuccess,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [category, category],
        queryFn: ({queryKey}) => {
            const [_, category] = queryKey
            return fetchKnowledge(category as KnowledgeType);
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
