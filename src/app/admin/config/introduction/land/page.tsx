'use client'

import React, {useEffect, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {useDispatch} from "react-redux";
import {useUpdateIntroduction} from "@/app/admin/config/(hooks)/use-update-introduction";
import {toast} from "sonner";
import {useFetchIntroduction} from "@/app/admin/config/(hooks)/use-introduction";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export default function () {
    const dispatch = useDispatch();
    const {error, loading, data} = useFetchIntroduction('land');
    const {mutate, loading: loadingUpdate, isSuccess, isError, error: errorUpdate} = useUpdateIntroduction();
    const [content, setContent] = useState(data?.introduction?.land || '');

    const handleUpdate = () => {
        mutate({
            page: 'land',
            content
        }, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            },
        });
    }

    const handleSubmit = () => {
        if (content === '<p></p>') {
            toast.warning('Vui lòng nhập nội dung!')
            return;
        }
        handleUpdate();
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Giới thiệu về sức khỏe đất'}
        ]))
    }, [])

    useEffect(() => {
        if (data?.introduction?.land) {
            setContent(data?.introduction.land);
        }
    }, [data?.introduction?.land]);

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Giới thiệu về sức khỏe đất</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleSubmit} disabled={loadingUpdate}>
                    {loadingUpdate &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Cập nhật
                </Button>
            </div>
        </div>
        {
            loading ? <Loader2 className={'animate-spin'}/> :
                <div className="space-y-2 min-h-full h-auto flex-1 mt-0.5">
                    <Label required htmlFor="description" className={'mb-4'}>Nội dung</Label>
                    {content ?
                        <SimpleEditor
                            content={generateJSON(content, [StarterKit])}
                            handleChange={({editor}: any) => setContent(editor.getHTML())}
                        /> : ''
                    }
                    <div className={'h-2 mt-2'}></div>
                </div>
        }
    </>
}
