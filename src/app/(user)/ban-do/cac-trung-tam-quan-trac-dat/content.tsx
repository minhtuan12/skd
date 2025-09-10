'use client'

import {Input} from "@/components/ui/input";
import {ILab} from "@/models/lab";
import {BookText, MapPin} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import MapWrapper from "@/components/custom/map-wrapper";
import React from "react";
import {toast} from "sonner";

function haversineDistance([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function filterNearby(
    current: [number, number],
    marks: [number, number][],
    maxDistanceKm: number = 8
) {
    return marks.filter((mark) => {
        const dist = haversineDistance(current, mark);
        return dist <= maxDistanceKm;
    });
}

export default function ({labs, tilerApiKey, popupHTMLs}: any) {
    const [selectedLoc, setSelectedLoc] = React.useState<number[]>([]);
    const [nearLabs, setNearLabs] = React.useState<any>([]);

    React.useEffect(() => {
        if (typeof navigator !== "undefined" && "geolocation" in navigator) {
            const marks = labs.map((item: ILab) => item.location.coordinates);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const {latitude, longitude} = pos.coords;
                    setNearLabs(filterNearby([longitude, latitude], marks));
                },
                (err) => {
                    toast.warning("Không lấy được vị trí hiện tại");
                }
            );
        }
    }, [labs]);

    return <>
        <div
            className={'max-md:h-[1000px] h-[650px] pt-6 px-3 pb-3 bg-[#f6f4f4] rounded-lg flex gap-2 flex-col md:flex-row max-md:gap-4'}>
            <div className={'gap-3 flex flex-col w-full max-md:h-1/3 md:w-1/3'}>
                <div className={'h-8'}>
                    <Input placeholder={'Nhập vị trí để tìm trung tâm gần nhất'}
                           className={'h-full bg-white !py-4'}/>
                </div>
                <div className={'flex flex-col flex-1 min-h-0'}>
                    <div className={'bg-gray-500 font-medium p-1 text-center text-white'}>
                        Có <b>{nearLabs.length}</b> trung tâm gần vị trí hiện tại của bạn
                    </div>
                    <div className={'flex-1 min-h-0 overflow-y-auto'}>
                        {
                            labs?.map((lab: ILab, i: number) => (
                                <div key={i}
                                     onClick={() => setSelectedLoc(lab.location.coordinates)}
                                     className={'py-2 px-4 border-b border-gray-100 bg-white box-border flex flex-col gap-0.5 cursor-pointer hover:bg-gray-100'}>
                                    <div className={'font-medium text-[red] text-[17px]'}>{lab.name}</div>
                                    <div className={'text-gray-400 gap-3 font-medium flex items-center'}>
                                        <BookText className={'w-3 h-3'}/>{lab.category}
                                    </div>
                                    <div className={'text-gray-400 gap-3 font-medium flex items-center'}>
                                        <MapPin className={'w-3 h-3'}/>{lab.address}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={'flex flex-col gap-3 w-full max-md:h-2/3 md:w-2/3'}>
                <div
                    className={'flex gap-10 w-full justify-center items-center h-8 max-sm:flex-col max-sm:gap-2 max-sm:my-6'}>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Chọn tỉnh/thành phố"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"hanoi"}>Hà Nội</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Chọn quận/huyện"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"hanoi1"}>Hà Nội 1</SelectItem>
                            <SelectItem value={"hanoi2"}>Hà Nội 2</SelectItem>
                            <SelectItem value={"hanoi3"}>Hà Nội 3</SelectItem>
                            <SelectItem value={"hanoi4"}>Hà Nội 4</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <MapWrapper
                    zoom={4}
                    rollEnabled={true}
                    interactive={true}
                    tilerApiKey={tilerApiKey}
                    marks={popupHTMLs}
                    exactLoc={selectedLoc}
                />
            </div>
        </div>
    </>
}
