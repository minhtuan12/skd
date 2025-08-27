import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateTreeType = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/tree-type/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({data: {name: data.name}}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateTreeType = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateTreeType(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tree-type', '', 1]});
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
