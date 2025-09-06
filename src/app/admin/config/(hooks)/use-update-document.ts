import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const updateDocument = async (data: any) => {
    if (data._id) {
        const response = await fetch(`/api/admin/config/policy-document/${data._id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({data}),
        });

        if (!response.ok) {
            const res = await response.json();
            throw new Error(res.error || 'Đã có lỗi xảy ra');
        }

        return response.json();
    }
};

export const useUpdateDocument = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => updateDocument(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['policy-document']});
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
