import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateLab = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/lab/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({
                data: {
                    name: data.name,
                    category: data.category,
                    address: data.address,
                    location: data.location,
                    first_license_date: data.first_license_date,
                    validity_time: data.validity_time,
                    decision: data.decision,
                }
            }),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateLab = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateLab(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lab-admin']});
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
