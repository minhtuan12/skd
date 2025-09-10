import React from "react";
import MapWrapper from "@/components/custom/map-wrapper";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {BookText, MapPin} from "lucide-react";
import {ILab} from "@/models/lab";

const tilerApiKey = process.env.MAP_TILER_API_KEY!
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

async function fetchLabs() {
    const res = await fetch(`${baseUrl}/api/config/lab`,
        {cache: 'no-store', credentials: 'include'}
    );

    if (!res.ok) {
        throw new Error('Failed to fetch lab');
    }
    return res.json();
}

export default async function CacTrungTamQuanTracDat() {
    const places = [
        {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        },
        {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        },
        {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        },
        {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        }, {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        }, {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        }, {
            name: 'Trung tam 1, Ha Noi',
            phone: '0987654321',
            time: '8h00 - 21h00'
        },

    ]
    const {labs} = await fetchLabs();

    return <div className={'box-border pb-40 flex flex-col gap-6 mt-6 lg:px-30 px-10 max-sm:px-6'}>
        <div className={'flex flex-col gap-6 h-full'}>
            <h1 className={'font-semibold text-center text-xl'}>CÁC TRUNG TÂM QUAN TRẮC ĐẤT</h1>
            <div
                className={'max-md:h-[1000px] h-[650px] pt-6 px-3 pb-3 bg-[#f6f4f4] rounded-lg flex gap-2 flex-col md:flex-row max-md:gap-4'}>
                <div className={'gap-3 flex flex-col w-full max-md:h-1/3 md:w-1/3'}>
                    <div className={'h-8'}>
                        <Input placeholder={'Nhập vị trí để tìm trung tâm gần nhất'}
                               className={'h-full bg-white !py-4'}/>
                    </div>
                    <div className={'flex flex-col flex-1 min-h-0'}>
                        <div className={'bg-gray-500 font-medium p-1 text-center text-white'}>
                            Có <b>{places.length}</b> trung tâm gần vị trí hiện tại của bạn
                        </div>
                        <div className={'flex-1 min-h-0 overflow-y-auto'}>
                            {
                                labs?.map((lab: ILab, i: number) => (
                                    <div key={i}
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
                        zoom={8}
                        rollEnabled={true}
                        interactive={true}
                        tilerApiKey={tilerApiKey}
                        // marks={[labs.map((lab: ILab) => lab.location.coordinates.reverse())]}
                    />
                </div>
            </div>
        </div>
    </div>
}
