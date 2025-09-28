import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateFooter = async (data: any) => {
    const response = await fetch(`/api/admin/config/footer`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({
            data
        }),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useUpdateFooter = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateFooter(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['footer']});
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
