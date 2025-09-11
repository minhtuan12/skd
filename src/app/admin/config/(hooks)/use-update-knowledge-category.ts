import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateCategory = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/knowledge-category/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({data: {name: data.name, children: data.children}}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateCategory(payload),
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
