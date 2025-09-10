import {Label} from "@/components/ui/label";
import React from "react";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/date-picker";
import {ILab} from "@/models/lab";
import {Textarea} from "@/components/ui/textarea";

export default function MapForm({data, handleChangeData}: {
    data: ILab,
    handleChangeData: any,
}) {
    const {
        name,
        category,
        address,
        location,
        first_license_date,
        validity_time,
        decision,
    } = data;

    return <div className={'h-full pb-10'}>
        <div className={`grid grid-cols-3 gap-8 h-full`}>
            <div className={'flex flex-col gap-6'}>
                <div className="grid gap-2">
                    <Label required htmlFor="name">Tên tổ chức</Label>
                    <Input
                        id="name" placeholder="Nhập tên tổ chức" value={name}
                        onChange={e => handleChangeData(e.target.value, 'name')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label required htmlFor="category">Lĩnh vực chỉ định</Label>
                    <Input
                        id="category" placeholder="Nhập lĩnh vực" value={category}
                        onChange={e => handleChangeData(e.target.value, 'category')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label required htmlFor="address">Địa chỉ</Label>
                    <Textarea
                        id="address" placeholder="Nhập địa chỉ" value={address}
                        onChange={e => handleChangeData(e.target.value, 'address')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label required>Kinh độ</Label>
                    <Input
                        min={0}
                        onWheel={(e) => {e.currentTarget.blur()}}
                        type={'number'}
                        placeholder="Nhập kinh độ" value={location.coordinates[0]}
                        onChange={e => handleChangeData(e.target.value, 'lng')}
                    />
                </div>
                <div className="grid gap-2">
                    <Label required>Vĩ độ</Label>
                    <Input
                        min={0}
                        onWheel={(e) => {e.currentTarget.blur()}}
                        type={'number'}
                        placeholder="Nhập vĩ độ" value={location.coordinates[1]}
                        onChange={e => handleChangeData(e.target.value, 'lat')}
                    />
                </div>
            </div>
            <div className={'flex flex-col gap-6'}>
                <div className="grid gap-2">
                    <Label required htmlFor="first_license_date" className={'gap-0'}>Thời gian cấp lần đầu</Label>
                    <DatePicker date={new Date(first_license_date)} setDate={(date) => {
                        handleChangeData(date, 'first_license_date')
                    }}/>
                </div>
                <div className="grid gap-2">
                    <Label required htmlFor="validity_time" className={'gap-0'}>Hiệu lực chỉ định</Label>
                    <DatePicker date={new Date(validity_time)} setDate={(date) => {
                        handleChangeData(date, 'validity_time')
                    }}/>
                </div>
                <div className="grid gap-2">
                    <Label required htmlFor="decision" className={'gap-0'}>Quyết định chỉ định</Label>
                    <Textarea
                        placeholder="Nhập quyết định chỉ định" value={decision}
                        onChange={e => handleChangeData(e.target.value, 'decision')}
                    />
                </div>
            </div>
        </div>
    </div>
}
