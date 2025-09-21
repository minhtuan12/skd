'use client';

import {memo, useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {cn} from "@/lib/utils";

interface Props {
    center?: [number, number];
    zoom?: number;
    marks?: any;
    className?: string;
    interactive?: boolean;
    tilerApiKey?: string;
    exactLoc?: number[]
}

const MapLibre = (
    {
        center = [107.3, 16.0285],
        zoom = 4.2,
        marks = [],
        className = '',
        interactive = false,
        tilerApiKey,
        exactLoc = [],
        ...props
    }: Props) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainerRef.current!,
            style: (interactive && tilerApiKey) ? `https://api.maptiler.com/maps/streets/style.json?key=${tilerApiKey}` : '/maps/style.json',
            center,
            zoom,
            ...props,
        });

        if (marks.length > 0) {
            marks.forEach((item: any) => {
                if (Array.isArray(item)) {
                    const popup = new maplibregl.Popup({offset: 25});
                    new maplibregl.Marker({color: "#1081e0"})
                        .setLngLat(item as [number, number])
                        .setPopup(popup)
                        .addTo(map);
                } else {
                    const popup = new maplibregl.Popup({offset: 25}).setHTML(item.popup);
                    new maplibregl.Marker({color: "#1081e0"})
                        .setLngLat(item.location)
                        .setPopup(popup)
                        .addTo(map);
                }
            });
        }

        if (exactLoc?.length > 0) {
            map.flyTo({
                center: exactLoc as [number, number],
                zoom: 12,
                essential: true
            });
        }

        if (tilerApiKey && interactive) {
            map.on('load', () => {
                map.addSource('islands', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {name: 'Quần đảo Hoàng Sa (Việt Nam)'},
                                geometry: {type: 'Point', coordinates: [112.0, 16.5]},
                            },
                            {
                                type: 'Feature',
                                properties: {name: 'Quần đảo Trường Sa (Việt Nam)'},
                                geometry: {type: 'Point', coordinates: [114.0, 10.0]},
                            },
                        ],
                    },
                });

                map.addLayer({
                    id: 'island-labels',
                    type: 'symbol',
                    source: 'islands',
                    layout: {
                        'text-field': ['get', 'name'],
                        'text-font': ['Open Sans Bold'],
                        'text-size': 14,
                        'text-offset': [0, 0],
                        'text-anchor': 'center',
                    },
                    paint: {
                        'text-color': '#b17036',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 2,
                    },
                });
            });
        }

        return () => map.remove();
    }, [center, zoom, exactLoc]);

    return (
        <div ref={mapContainerRef} className={cn('w-full h-full', className)}/>
    );
};

export default memo(MapLibre);
