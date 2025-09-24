'use client'

import React from "react";
import {Label} from "@/components/ui/label";
import {Loader2} from "lucide-react";
import {INewsAndEvents} from "@/models/config";
import {useConfig} from "@/app/admin/config/(hooks)/use-config";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {IPolicyDocument} from "@/models/policy-document";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {useUpdateIntroduction} from "@/app/admin/config/(hooks)/use-update-introduction";
import {Image} from "@tiptap/extension-image"

interface IProps {
    title: string,
    content: string,
    handleChangeContent: any,
    handleUpdate: any,
    loadingUpdate: boolean,
    loading: boolean
}

export default function IntroductionForm({title, content, handleChangeContent, handleUpdate, loadingUpdate, loading}: IProps) {
    const handleSubmit = () => {
        if (!content) {
            toast.warning('Vui lòng nhập nội dung!')
            return;
        }
        handleUpdate();
    }

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
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
                    <SimpleEditor
                        content={generateJSON(content, [StarterKit, Image])}
                        handleChange={({editor}: any) => handleChangeContent(editor.getHTML())}
                    />
                    <div className={'h-2 mt-2'}></div>
                </div>
        }
    </>
}
