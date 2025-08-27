'use client';

import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {cn} from "@/lib/utils";

interface Props {
    center?: [number, number];
    zoom?: number;
    marks?: [number, number][];
    className?: string;
    interactive?: boolean;
    tilerApiKey?: string;
}

const MapLibre = (
    {
        center = [105.8544, 21.0285],
        zoom = 5,
        marks = [],
        className = '',
        interactive = false,
        tilerApiKey,
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
            marks.forEach((loc: [number, number]) => {
                const popup = new maplibregl.Popup({offset: 25});
                new maplibregl.Marker({color: "#1081e0"})
                    .setLngLat(loc)
                    .setPopup(popup)
                    .addTo(map);
            });
        }

        return () => map.remove();
    }, [center, zoom]);

    return (
        <div ref={mapContainerRef} className={cn('w-full h-full', className)}/>
    );
};

export default MapLibre;
