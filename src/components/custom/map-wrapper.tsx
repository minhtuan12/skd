"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../ui/leaflet-map"), {
    ssr: false,
});

const MapLibre = dynamic(() => import("../ui/map-libre"), {
    ssr: false,
});

export default function MapWrapper({...props}) {
    return <MapLibre {...props} />;
}
