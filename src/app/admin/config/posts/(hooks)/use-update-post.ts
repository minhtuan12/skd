import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateOneSection = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/post/${data._id}`, {
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

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateOneSection(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['post-admin']});
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
