import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";

const deleteFiles = async (publicIds: string[]) => {
    const response = await fetch(`/api/admin/cloud-files`, {
        credentials: 'include',
        method: 'DELETE',
        body: JSON.stringify({data: {publicIds}}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useDeleteFiles = () => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => deleteFiles(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['uploaded-files']});
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
