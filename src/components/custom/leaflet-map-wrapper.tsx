"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../ui/leaflet-map"), {
    ssr: false,
});

export default function LeafletWrapper({...props}) {
    return <LeafletMap {...props} />;
}
