'use client'

import { Input } from "@/components/ui/input";
import { ILab } from "@/models/lab";
import { BookText, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { toast } from "sonner";
import * as turf from "@turf/turf";
import { formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapWrapper = dynamic(() => import("@/components/custom/map-wrapper"), {
    ssr: false,
});

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

function isPointInProvince(point: any, provinceFeature: any) {
    const pt = turf.point([point[0], point[1]]);
    return turf.booleanPointInPolygon(pt, provinceFeature);
}

export default function ({ labs, tilerApiKey }: any) {
    const [selectedLoc, setSelectedLoc] = React.useState<number[]>([]);
    const [nearLabs, setNearLabs] = React.useState<any>([]);
    const [features, setFeatures] = React.useState<any>(null);
    const [selectedProvince, setSelectedProvince] = React.useState<any>(null);
    const [selectedTarget, setSelectedTarget] = React.useState<any>(null);
    const [filteredLabs, setFilteredLabs] = React.useState(labs);

    function handleSelect(name: any) {
        if (name === 'all') {
            setSelectedProvince('all');
            return;
        }
        const provinceFeature = features.find(
            (f: any) => f.properties.GID_1 === name
        );

        setSelectedProvince(provinceFeature);
    }

    function handleSelectTarget(target: any) {
        setSelectedTarget(target);
    }

    const popupHTMLs = React.useMemo(() => {
        return filteredLabs.map((lab: ILab) => ({
            location: lab.location.coordinates,
            popup: `<div class="p-3 max-w-xs text-sm">
      <h3 class="font-semibold text-base text-gray-800 mb-2">${lab.name}</h3>
      <div class="space-y-1 text-gray-700 flex flex-col">
        <div class="'flex"><span class="font-semibold">• Lĩnh vực chỉ định:</span> ${lab.category}</div>
        <div class="'flex"><span class="font-semibold">• Địa chỉ:</span> ${lab.address}</div>
        <div class="'flex"><span class="font-semibold">• Thời gian cấp lần đầu:</span> ${formatDate(lab.first_license_date as string)}</div>
        <div class="'flex"><span class="font-semibold">• Hiệu lực:</span> ${formatDate(lab.validity_time as string)}</div>
        <div class="'flex"><span class="font-semibold">• Quyết định:</span> ${lab.decision}</div>
      </div>
    </div>`
        }))
    }, [filteredLabs]);

    React.useEffect(() => {
        setFilteredLabs(labs);
    }, [labs]);

    React.useEffect(() => {
        if (typeof navigator !== "undefined" && "geolocation" in navigator) {
            const marks = filteredLabs.map((item: ILab) => item.location.coordinates);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setNearLabs(filterNearby([longitude, latitude], marks));
                },
                (err) => {
                    toast.warning("Không lấy được vị trí hiện tại");
                }
            );
        }
    }, [filteredLabs])

    React.useEffect(() => {
        async function fetchProvinces() {
            const res = await fetch(process.env.NEXT_PUBLIC_VN_GEOJSON_URL!);
            const geojson = await res.json();
            setFeatures(geojson.features);
        }

        fetchProvinces();
    }, []);

    React.useEffect(() => {
        let result = labs;

        if (selectedProvince && selectedProvince !== "all") {
            result = result.filter((item: ILab) =>
                isPointInProvince(item.location.coordinates, selectedProvince)
            );
        }

        if (selectedTarget && selectedTarget !== "all") {
            result = result.filter((item: ILab) =>
                item.category?.toLowerCase()?.includes(
                    selectedTarget === "fertilizer" ? "phân" : "đất"
                )
            );
        }

        setFilteredLabs(result);
    }, [selectedProvince, selectedTarget]);

    return <>
        <div
            className={'max-md:h-[1000px] h-[650px] pt-4 px-3 pb-3 bg-[#f6f4f4] rounded-lg flex gap-2 flex-col md:flex-row max-md:gap-4'}>
            <div className={'gap-3 flex flex-col w-full max-md:h-1/3 md:w-1/4'}>
                <div className={'h-9'}>
                    <Input
                        placeholder={'Nhập vị trí để tìm trung tâm gần nhất'}
                        className={'h-full bg-white !py-4 !text-base'}
                    />
                </div>
                <div className={'flex flex-col flex-1 min-h-0'}>
                    <div className={'bg-gray-500 font-medium p-1 text-center text-white'}>
                        Có <b>{nearLabs.length}</b> trung tâm gần vị trí hiện tại của bạn
                    </div>
                    <div className={'flex-1 min-h-0 overflow-y-auto'}>
                        {
                            filteredLabs?.map((lab: ILab, i: number) => (
                                <div key={i}
                                    onClick={() => setSelectedLoc(lab.location.coordinates)}
                                    className={'py-2 px-4 border-b border-gray-100 bg-white box-border flex flex-col gap-0.5 cursor-pointer hover:bg-gray-100'}>
                                    <div className={'font-medium text-[red] text-[17px]'}>{lab.name}</div>
                                    <div className={'text-gray-400 gap-3 font-medium flex items-center'}>
                                        <BookText className={'w-3 h-3'} />{lab.category}
                                    </div>
                                    <div className={'text-gray-400 gap-3 font-medium flex items-center'}>
                                        <MapPin className={'w-3 h-3'} />{lab.address}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={'flex flex-col gap-3 w-full max-md:h-2/3 md:w-3/4'}>
                <div
                    className={'flex gap-10 w-full justify-center items-center h-9 max-sm:flex-col max-sm:gap-2 max-sm:my-6'}>
                    <Select value={selectedProvince?.properties?.GID_1 || ''} onValueChange={handleSelect}>
                        <SelectTrigger className="w-[200px] bg-white !text-base">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"} className={'!text-base'}>Tất cả</SelectItem>
                            {
                                features?.map((item: any, index: number) => <SelectItem
                                    className={'!text-base'}
                                    key={index}
                                    value={item?.properties?.GID_1 || ''}
                                >
                                    {item?.properties?.NAME_1 || ''}
                                </SelectItem>)
                            }
                        </SelectContent>
                    </Select>

                    <Select value={selectedTarget || ''} onValueChange={handleSelectTarget}>
                        <SelectTrigger className="w-[200px] bg-white !text-base">
                            <SelectValue placeholder="Chọn chỉ tiêu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"} className={'!text-base'}>Tất cả</SelectItem>
                            <SelectItem value={"fertilizer"} className={'!text-base'}>Phân bón</SelectItem>
                            <SelectItem value={"soil"} className={'!text-base'}>Đất</SelectItem>
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
