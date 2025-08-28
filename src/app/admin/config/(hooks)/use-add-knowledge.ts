import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";
import {KnowledgeType} from "@/models/knowledge";

const addKnowledge = async (data: any) => {
    const response = await fetch(`/api/admin/config/knowledge`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({data}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useAddKnowledge = (category: KnowledgeType) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => addKnowledge(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['knowledge', category]});
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
