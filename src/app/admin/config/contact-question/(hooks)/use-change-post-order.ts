import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updatePostOrder = async (data: any) => {
    const response = await fetch(`/api/admin/config/post/order`, {
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

export const useUpdatePostOrder = (key: string) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updatePostOrder(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['post-list-admin', key]});
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
