import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const deleteCategory = async (id: string) => {
    if (id) {
        const response = await fetch(`/api/admin/config/knowledge-category/delete/${id}`, {
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

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => deleteCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['knowledge-category-admin']});
            toast.success('Xóa thành công')
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
