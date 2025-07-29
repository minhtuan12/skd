"use client";

import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Icon, LatLngTuple} from "leaflet";
import VietnamGeo from '@/data/vietnam-geo.json'
import {GeoJsonObject} from "geojson";

const center: LatLngTuple = [16.0, 108.0]; // Vietnam center

interface IProps {
    marks?: LatLngTuple[];
}

const locationIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149060.png", // icon marker
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

export default function LeafletMap({marks}: IProps) {
    return (
        <MapContainer center={center} zoom={5} style={{height: "100%", width: "100%"}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                marks ?
                    marks.map((pos, idx) => (
                        <Marker key={idx} position={pos} icon={locationIcon}>
                            <Popup>Điểm #{idx + 1}</Popup>
                        </Marker>
                    ))
                    : <GeoJSON
                        data={VietnamGeo as GeoJsonObject}
                        style={() => ({
                            stroke: false,
                            fillColor: "#ffa500",
                            fillOpacity: 0.4,
                        })}
                    />
            }
        </MapContainer>
    );
}
