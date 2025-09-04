import {Label} from "@/components/ui/label";
import React from "react";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import {IMap} from "@/models/map";
import {Input} from "@/components/ui/input";
import Image from "next/image";

export default function MapForm({data, handleChangeData, handleDrop}: {
    data: IMap,
    handleChangeData: any,
    handleDrop: any
}) {
    const {
        name,
        image_url,
        data_url
    } = data;

    return <div className={'h-full pb-10'}>
        <div
            className={`grid grid-cols-3 gap-8 h-full`}>
            <div className={'flex flex-col gap-6'}>
                <div className="grid gap-2">
                    <Label required htmlFor="name">Tên bản đồ</Label>
                    <Input
                        id="name" placeholder="Nhập tên bản đồ" value={name}
                        onChange={e => handleChangeData(e.target.value, 'name')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="data_url">Link dữ liệu</Label>
                    <Input
                        id="data_url" placeholder="Nhập link dữ liệu" value={data_url || ''}
                        onChange={e => handleChangeData(e.target.value, 'data_url')}
                    />
                </div>
                <div className={'flex flex-col gap-2'}>
                    <div>Bản đồ hiện tại</div>
                    {image_url ? (typeof image_url === 'string' ?
                        <Image
                            src={image_url as string} alt={name}
                            sizes={'100vw'}
                            width={0}
                            height={0}
                            style={{width: '100%', height: 'auto'}}
                            className={'rounded-lg'}
                        />
                        : <Image
                            src={URL.createObjectURL(image_url as File)} alt={name}
                            sizes={'100vw'}
                            width={0}
                            height={0}
                            style={{width: '100%', height: 'auto'}}
                            className={'rounded-lg'}
                        />) : <div className={'text-gray-500 italic'}>Vui lòng tải ảnh lên</div>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-2 col-span-2 h-full">
                <Label required>Hình ảnh bản đồ</Label>
                <Dropzone
                    accept={{
                        "image/*": [],
                        "video/*": []
                    }}
                    maxFiles={1}
                    maxSize={1024 * 1024 * 50}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={console.error}
                    src={typeof image_url !== 'string' ? [image_url] as File[] : []}
                    className={'h-full'}
                >
                    <DropzoneEmptyState/>
                    <DropzoneContent/>
                </Dropzone>
            </div>
        </div>
    </div>
}
