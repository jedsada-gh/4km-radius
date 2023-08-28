import './App.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol';
import 'leaflet-geosearch/dist/geosearch.css';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import { LatLng, LatLngLiteral, Marker } from 'leaflet';
import { useRef, useState } from 'react';
import MyLocation from './components/MyLocation';
import SearchLocation from './components/SearchLocation';
import CustomMarker from './components/CustomMarker';

export default function App() {
  const [location, setLocation] = useState<LatLngLiteral>({
    lat: 18.7883,
    lng: 98.9853,
  });
  const [isShowCircle, setShowCircle] = useState<boolean>(false);
  const searchMarker = useRef<Marker>();
  const pinMarker = useRef<Marker>();

  return (
    <div>
      <MapContainer center={location} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyLocation
          onLocationChange={(latlng) => {
            if (
              searchMarker.current?.getLatLng() === undefined &&
              pinMarker.current?.getLatLng() === undefined
            ) {
              setLocation(latlng);
              setShowCircle(true);
            }
          }}
          onForceUpdateLocation={(latlng) => {
            searchMarker.current?.remove();
            pinMarker.current?.remove();
            setLocation(latlng);
            setShowCircle(true);
          }}
          onLocationError={() => {
            setShowCircle(false);
          }}
        />
        <SearchLocation
          onSelectedLocation={(data) => {
            searchMarker.current = data.marker;
            setLocation({
              lat: data.location.raw.lat,
              lng: data.location.raw.lon,
            });
          }}
        />
        <CustomMarker
          onSelectedLocation={(data) => {
            pinMarker.current = data.marker;
            setLocation(data.latlng);
            setShowCircle(true);
          }}
        />
        {isShowCircle ? (
          <Circle
            center={location as LatLng}
            pathOptions={{ fillColor: 'blue' }}
            radius={4000}
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
