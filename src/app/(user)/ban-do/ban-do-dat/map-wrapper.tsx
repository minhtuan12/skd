'use client'

import InteractiveMap from "@/app/(user)/ban-do/ban-do-dat/interactive-map";
import {IMap} from "@/models/map";
import MapList from "@/app/(user)/ban-do/ban-do-dat/map-list";
import React, {useState} from "react";
import Image from "next/image";

export default function MapWrapper({maps}: { maps: IMap[] }) {
    const [chosenMap, setChosenMap] = useState<null | { url: string, type: string }>(null);

    return <div className={'flex flex-col gap-14'}>
        {maps ? <>
        {chosenMap ?
            <div className={'lg:px-26 px-10 max-sm:px-6 mx-auto'}>
                {
                    chosenMap.type === 'image' ?
                        <Image
                            src={chosenMap.url}
                            alt={chosenMap.url} width={0} height={0}
                            sizes={'100vw'}
                            style={{width: 'auto', height: 'auto'}}
                            className={'object-cover'}
                        /> :
                        <InteractiveMap
                            chosenMap={chosenMap.url}
                            catalog={maps
                                .filter((item: IMap) => item.data_url)
                                .map((item: IMap) => ({
                                    name: item.name,
                                    data_url: item.data_url,
                                }))
                            }
                        />
                }
            </div> : ''
        }
            <div className={'bg-gray-50 lg:px-26 px-10 max-sm:px-6 py-12'}>
                <MapList maps={maps} setChosenMap={setChosenMap}/>
            </div>
        </> : ''
        }
    </div>
}
