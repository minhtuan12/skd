import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const addCategoryToKnowledge = async (data: any) => {
    if (data.knowledgeId) {
        const response = await fetch(`/api/admin/config/knowledge/page`, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({data}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useAddCategoryToKnowledge = (categoryId: string = '') => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => addCategoryToKnowledge(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [`knowledge-${categoryId}`, categoryId]});
        },
        onError: (error) => {
            toast.error(error?.message || 'Đã có lỗi xảy ra');
        }
    });

    return {
        mutate,
        isSuccess,
        isError,
        loading,
        error: error?.message || null,
    };
};
