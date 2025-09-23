import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const deleteOnePost = async (id: any) => {
    if (id) {
        const response = await fetch(`/api/admin/config/post/multiple/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => deleteOnePost(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['post-list-admin']});
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
