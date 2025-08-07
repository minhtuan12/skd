import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "sonner";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";

const saveConfig = async (data: any, page: string) => {
    const response = await fetch(`/api/admin/config`, {
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify({data, page}),
    });

    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Đã có lỗi xảy ra');
    }

    return response.json();
};

export const useSaveConfig = (page: string) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending: loading,
        isSuccess,
        isError,
        error,
    } = useMutation({
        mutationFn: (payload: any) => saveConfig(payload, page),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['config', page]});
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
