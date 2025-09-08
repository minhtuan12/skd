import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateKnowledge = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/knowledge/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({data}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateKnowledge = (categoryId: string) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateKnowledge(payload),
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
