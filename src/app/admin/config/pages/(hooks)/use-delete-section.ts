import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const deleteSection = async (id: any) => {
    if (id) {
        const response = await fetch(`/api/admin/config/section/${id}`, {
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

export const useDeleteSection = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => deleteSection(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['section-admin']});
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
