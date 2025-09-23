'use client'

import React, {useEffect, useMemo, useState} from "react";
import {setBreadcrumb} from "@/redux/slices/admin";
import {useDispatch} from "react-redux";
import {Loader2} from "lucide-react";
import {TreeView} from "@/components/tree-view";
import {useFetchSectionAdmin} from "@/app/admin/config/pages/(hooks)/use-section-admin";
import {ISection, SectionType} from "@/models/section";
import SectionForm from "@/app/admin/config/pages/section-form";
import {useUpdateOneSection} from "@/app/admin/config/pages/(hooks)/use-update-one-section";
import {toast} from "sonner";

const sections = [
    {
        id: '1',
        name: 'Thông tin chính sách',
        key: 'policy',
        isDefault: true
    },
    {
        id: '2',
        name: 'Bản đồ',
        key: 'map',
        isDefault: true
    },
    {
        id: '3',
        name: 'Ngân hàng kiến thức',
        key: 'knowledge',
        isDefault: true
    },
    {
        id: '4',
        name: 'Tin tức và sự kiện',
        key: 'news',
        isDefault: true
    },
    {
        id: '5',
        name: 'Hỏi đáp và liên hệ',
        key: 'contact',
        isDefault: true
    },
    {
        id: '6',
        name: 'Giới thiệu',
        key: 'introduction',
        isDefault: true
    },
];

function buildTree(
    {
        headerKey,
        parentId,
        allSections,
        isFirstLevel
    }: {
        headerKey: string,
        parentId: string | null,
        allSections: any[],
        isFirstLevel: boolean
    }): any {
    return allSections
        .filter(s => {
            if (isFirstLevel) {
                return s.header_key === headerKey && !s.parent_id;
            } else {
                return s.parent_id === parentId;
            }
        })
        .map(s => ({
            ...s,
            id: s._id,
            children: buildTree({
                headerKey,
                parentId: s._id,
                allSections,
                isFirstLevel: false
            })
        }))
        .map(i => {
            if (i?.children?.length > 0) {
                return i;
            }
            const {children, ...item} = i;
            return {...item, draggable: false, droppable: false};
        })
        .map((i: any) => {
            if (i.type !== SectionType.list) return i;
            const {children, ...nonChildren} = i
            return nonChildren;
        });
}

export default function () {
    const dispatch = useDispatch();
    const {data, loading} = useFetchSectionAdmin();
    const [selectedSection, setSelectedSection] = useState<(ISection & {
        id: string,
        isDefault?: boolean
    }) | null>(null);
    const {mutate: updateOneSection, loading: loadingUpdateOne} = useUpdateOneSection();

    const headers: any[] = useMemo(() => {
        if (data?.sections) {
            return sections.map(item => {
                return {
                    ...item,
                    children: buildTree({
                        headerKey: item.key,
                        parentId: null,
                        allSections: data.sections,
                        isFirstLevel: true
                    })
                }
            })
        }
        return sections;
    }, [data]);

    function handleDragPage(startItem: any, endItem: any) {
        let newItem = startItem;
        if (endItem?.isDefault) {
            newItem = {
                ...newItem,
                parent_id: null,
                header_key: endItem.key
            }
        } else if (!endItem.parent_id) {
            newItem = {
                ...newItem,
                parent_id: endItem._id,
                header_key: endItem.header_key
            }
        } else {
            newItem = {
                ...newItem,
                parent_id: endItem.parent_id,
                header_key: endItem.header_key
            }
        }

        updateOneSection(newItem, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            }
        })
    }

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: ''},
            {title: 'Quản lý các trang'}
        ]))
    }, [])

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Quản lý các trang</h2>
        </div>
        {
            (loading || loadingUpdateOne) ? <Loader2 className={'animate-spin w-8 h-8'}/> :
                <div className={'w-full flex justify-between gap-10'}>
                    <div className={'max-h-[calc(100vh-147px)] overflow-y-auto w-1/3'}>
                        <TreeView
                            activeItemId={selectedSection?.id}
                            data={headers}
                            onSelectChange={(item: any) => {
                                setSelectedSection(item);
                            }}
                            onDocumentDrag={handleDragPage}
                        />
                    </div>
                    <div className={'w-2/3 h-full shadow-lg border border-gray-300 rounded-md py-5 px-7'}>
                        {
                            selectedSection ?
                                <SectionForm data={selectedSection as any} setSelectedSection={setSelectedSection}/> :
                                <i className={'flex justify-center items-center h-full text-gray-500 text-lg'}>
                                    Chọn 1 trang bên trái
                                </i>
                        }
                    </div>
                </div>
        }
    </>
}
