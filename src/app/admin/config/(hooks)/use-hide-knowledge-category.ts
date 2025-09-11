import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const changeVisibility = async (id: string) => {
    if (id) {
        const response = await fetch(`/api/admin/config/knowledge-category/${id}`, {
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

export const useChangeCategoryVisibility = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => changeVisibility(payload),
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
