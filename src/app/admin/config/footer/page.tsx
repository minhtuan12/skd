'use client'

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setBreadcrumb} from "@/redux/slices/admin";
import {routes} from "@/constants/routes";
import {Loader2} from "lucide-react";
import {INewsAndEvents} from "@/models/config";
import {Button} from "@/components/ui/button";
import {IPolicyDocument} from "@/models/policy-document";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useFetchFooter} from "@/app/admin/config/(hooks)/use-footer";
import {useUpdateFooter} from "@/app/admin/config/(hooks)/use-update-footer";
import {IFooter} from "@/models/footer";
import {toast} from "sonner";

export default function () {
    const dispatch = useDispatch();
    const {loading, data} = useFetchFooter();
    const {loading: loadingUpdate, mutate: updateFooter} = useUpdateFooter();
    const [footer, setFooter] = useState<IFooter>({
        about_us: {
            text: '',
            email: '',
            facebook: '',
            youtube: ''
        },
        contact: {
            address: '',
            email: '',
            phone: ''
        },
        sponsors: []
    });

    useEffect(() => {
        dispatch(setBreadcrumb([
            {title: 'Cấu hình', href: routes.HomeConfig},
            {title: 'Footer'}
        ]))
    }, []);

    const handleChangeInput = (value: string, key: string, index: number = -1) => {
        if (key !== 'sponsors') {
            const [parent, field] = key.split('.');
            setFooter({
                ...footer,
                [parent]: {
                    ...footer?.[parent as keyof typeof footer] as any,
                    [field]: value
                }
            } as any);
        } else {
            setFooter({
                ...footer,
                sponsors: [
                    ...footer?.sponsors.slice(0, index),
                    value,
                    ...footer?.sponsors.slice(index + 1)
                ]
            } as any)
        }
    }

    // call api update config
    const handleSubmitUpdateConfig = () => {
        const updatedConfig = {
            ...footer,
            sponsors: footer.sponsors.filter(i => i)
        }
        updateFooter(updatedConfig, {
            onSuccess: () => {
                toast.success('Cập nhật thành công');
            },
        });
    }

    useEffect(() => {
        if (data?.footer) {
            setFooter(data?.footer);
        }
    }, [data]);

    return <>
        <div className="flex items-center justify-between space-y-2 flex-wrap">
            <h2 className="text-3xl font-bold tracking-tight">Footer</h2>
            <div
                className={'flex items-center gap-4 flex-wrap max-[400px]:justify-between max-[400px]:w-full'}>
                <Button onClick={handleSubmitUpdateConfig} disabled={loadingUpdate}>
                    {(loadingUpdate) &&
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Cập nhật
                </Button>
            </div>
        </div>
        {
            loading ? <Loader2 className={'animate-spin'}/> :
                <div className={'space-y-10'}>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'font-semibold'}>• VỀ CHÚNG TÔI</div>
                        <div className={'space-y-3'}>
                            <Textarea onChange={e => handleChangeInput(e.target.value, 'about_us.text')}
                                      placeholder={'Giới thiệu'} value={footer?.about_us.text}/>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-24'}>Facebook:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'about_us.facebook')}
                                       placeholder={'Nhập link facebook'} value={footer?.about_us.facebook}/>
                            </div>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-24'}>Youtube:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'about_us.youtube')}
                                       placeholder={'Nhập link youtube'} value={footer?.about_us.youtube}/>
                            </div>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-24'}>Email:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'about_us.email')}
                                       placeholder={'Nhập email'} value={footer?.about_us.email}/>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'font-semibold'}>• LIÊN HỆ</div>
                        <div className={'space-y-3'}>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-35'}>Địa chỉ:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'contact.address')}
                                       placeholder={'Nhập địa chỉ'} value={footer?.contact.address}/>
                            </div>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-35'}>Số điện thoại:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'contact.phone')}
                                       placeholder={'Nhập số điện thoại'} value={footer?.contact.phone}/>
                            </div>
                            <div className={'flex gap-2 items-center'}>
                                <span className={'w-35'}>Email:</span>
                                <Input onChange={(e: any) => handleChangeInput(e.target.value, 'contact.email')}
                                       placeholder={'Nhập email'} value={footer?.contact.email}/>
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'font-semibold flex items-center gap-10'}>
                            <span>• ĐỐI TÁC & NHÀ TÀI TRỢ</span>
                            <div className={'text-blue-500 cursor-pointer'}
                                 onClick={() => setFooter((prev: any) => ({
                                     ...prev,
                                     sponsors: [...prev.sponsors, ''] as any
                                 }))}>
                                + Thêm mới
                            </div>
                        </div>
                        <div className={'space-y-3'}>
                            {
                                footer?.sponsors?.map((s: string, index: number) =>
                                    <div className={'flex items-center gap-10'} key={index}>
                                        <Input value={s} className={'w-120'}
                                               onChange={e => handleChangeInput(e.target.value, 'sponsors', index)}/>
                                        <div
                                            onClick={() => setFooter((prev: any) => ({
                                                ...prev,
                                                sponsors: [
                                                    ...prev.sponsors.slice(0, index),
                                                    ...prev.sponsors.slice(index + 1),
                                                ]
                                            }))}
                                            className={'text-red-500 cursor-pointer'}
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
        }
    </>
}
