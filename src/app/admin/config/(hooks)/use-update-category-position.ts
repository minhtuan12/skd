import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateCategoryPosition = async (orderIds: string[]) => {
    const response = await fetch(`/api/admin/config/knowledge-category/position`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({data: {orderIds}}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useUpdateCategoryPos = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateCategoryPosition(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['knowledge-category-admin']});
            toast.success('Cập nhật thành công')
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
