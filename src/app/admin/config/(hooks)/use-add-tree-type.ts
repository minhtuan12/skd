import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const addTreeType = async (data: any) => {
    const response = await fetch(`/api/admin/config/tree-type`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({data}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useAddTreeType = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => addTreeType(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tree-type']});
            toast.success('Thêm mới thành công');
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
