import { useMap } from 'react-leaflet';
import { SelectLocationEvent } from '../types';
import L, { Icon, Marker } from 'leaflet';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useCallback, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

const CustomMarker = ({ zoom, onSelectedLocation }: SelectLocationEvent) => {
  const oldMarker = useRef<Marker>();
  const provider = useMemo(() => {
    return new OpenStreetMapProvider({
      params: {
        'accept-language': 'th',
        countrycodes: 'th',
        addressdetails: 2,
      },
    });
  }, []);
  const map = useMap();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceQuery = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounce(async (e: any) => {
      let label = 'unknown';
      try {
        const results = await provider.search({
          query: `${e.latlng.lat}, ${e.latlng.lng}`,
        });
        label = results?.[0]?.label;
      } catch (e) {
        console.error(e);
      }

      oldMarker.current?.remove();
      const newMarker = L.marker(e.latlng, {
        icon: new Icon({
          iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      });
      oldMarker.current = newMarker;
      newMarker.bindPopup(label).openPopup();
      newMarker.addTo(map);
      onSelectedLocation({ latlng: e.latlng, marker: newMarker });
      map.flyTo(e.latlng, zoom, { animate: true });
    }, 500),
    []
  );

  map.on('click', async (e) => {
    debounceQuery(e);
  });
  return null;
};

export default CustomMarker;
