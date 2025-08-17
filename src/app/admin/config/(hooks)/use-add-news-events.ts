import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const addNewsEvents = async (data: any, type: string) => {
    const response = await fetch(`/api/admin/config/news-events`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({data: {...data, type}}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useAddNewsEvents = (type: string) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => addNewsEvents(payload, type),
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
