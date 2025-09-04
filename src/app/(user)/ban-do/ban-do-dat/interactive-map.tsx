'use client'

import {useEffect, useRef} from 'react';
import {IMap} from "@/models/map";

export default function InteractiveMap({catalog, chosenMap}: { catalog: Partial<IMap>[], chosenMap: string | null }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let result: any = [];
        catalog.map((item) => {
            const layer = (new URLSearchParams(item.data_url as string) as any).get('layers').split(':').pop();
            result.push({
                "id": item.data_url,
                "type": 'wms',
                "name": item.name,
                "url": item.data_url,
                "layers": layer,
                "isEnabled": chosenMap === item.data_url,
            })
        });

        const startParam = encodeURIComponent(JSON.stringify({
            "version": "0.0.03",
            "initSources": [
                {
                    "catalog": result,
                    "catalogIsUserSupplied": true,
                },
            ]
        }));

        if (iframeRef.current) {
            iframeRef.current.src = `https://data.vietnam.opendevelopmentmekong.net/terriamap/?lang=en_US&explorer=true&country_code=odv#/map-explorer/map=2d&start=${startParam}`;
        }
    }, [catalog, chosenMap]);

    return <iframe
        ref={iframeRef}
        className="w-full border-2 border-blue-300 rounded-lg"
        width="100%"
        height="650"
        title="Interactive Map"
    />
}
