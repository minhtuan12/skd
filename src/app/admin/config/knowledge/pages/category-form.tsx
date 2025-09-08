import {Label} from "@/components/ui/label";
import React from "react";
import {Input} from "@/components/ui/input";
import {IKnowledgeCategory} from "@/models/knowledge-category";
import {X} from "lucide-react";
import {toast} from "sonner";

export default function CategoryForm({data, handleChangeData}: {
    data: IKnowledgeCategory,
    handleChangeData: any,
}) {
    const {
        name,
        children
    } = data;

    return <div className={'h-full pb-10'}>
        <div
            className={`grid grid-cols-3 gap-8 h-full`}>
            <div className={'flex flex-col gap-6'}>
                <div className="grid gap-2">
                    <Label required htmlFor="name">Tên trang</Label>
                    <Input
                        placeholder={'Nhập tên trang'}
                        value={name || ''}
                        onChange={e => handleChangeData(e.target.value, 'name')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Nhóm vấn đề</Label>
                    <Input
                        placeholder="Nhập tên nhóm vấn đề rồi Enter"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                if (children?.some(i => (i as IKnowledgeCategory).name.toLowerCase() === e.currentTarget.value.trim().toLowerCase())) {
                                    toast.warning('Nhóm vấn đề này đã tồn tại');
                                } else {
                                    handleChangeData([...(children || []), {name: e.currentTarget.value.trim()}], 'children');
                                    e.currentTarget.value = "";
                                }
                            }
                        }}
                    />
                </div>
                <div className={'text-[14px]'}>
                    Các nhóm vấn đề:
                    <div className="flex flex-col gap-2 mt-1">
                        {children?.length === 0 ? <span className={'text-gray-600 italic'}>Trống</span> :
                            (children as IKnowledgeCategory[])?.map((child: IKnowledgeCategory, index) => (
                                <div
                                    className={'box-border py-1.5 px-4 border rounded-md flex items-center justify-between'}
                                    key={index}
                                >
                                    {child.name as string}
                                    <X className={'w-4.5 h-4.5 cursor-pointer'} onClick={() => {
                                        handleChangeData([
                                            ...(children as IKnowledgeCategory[]).slice(0, index),
                                            ...(children as IKnowledgeCategory[]).slice(index + 1)
                                        ], 'children')
                                    }}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}
