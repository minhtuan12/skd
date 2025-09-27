import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const deleteNewsEvents = async (id: string) => {
    if (id) {
        const response = await fetch(`/api/admin/config/news-events/${id}`, {
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

export const useDeleteNewsEvents = (type: string) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => deleteNewsEvents(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['news-events', type]});
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
