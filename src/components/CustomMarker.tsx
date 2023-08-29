import { useMap } from 'react-leaflet';
import { SelectLocationEvent } from '../types';
import L, { Marker } from 'leaflet';
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
      const newMarker = L.marker(e.latlng);
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
