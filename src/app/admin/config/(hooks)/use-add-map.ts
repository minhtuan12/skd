import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const addMap = async (data: any) => {
    const response = await fetch(`/api/admin/config/maps`, {
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

export const useAddMap = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => addMap(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['map-admin']});
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
