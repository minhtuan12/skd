import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateMap = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/maps/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({data: {name: data.name, image_url: data.image_url, data_url: data.data_url}}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateMap = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateMap(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['map-admin']});
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
