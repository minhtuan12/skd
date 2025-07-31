'use client';

import {useEffect, useRef} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
    center?: [number, number];
    zoom?: number;
    marks?: [number, number][]
}

const MapLibre = ({center = [105.8544, 21.0285], zoom = 5, marks = []}: Props) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainerRef.current!,
            style: `/maps/style.json`,
            center,
            zoom,
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
        <div ref={mapContainerRef} className="w-full h-full"/>
    );
};

export default MapLibre;
