// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { SelectLocationEvent } from '../types';

const SearchLocation = ({ zoom, onSelectedLocation }: SelectLocationEvent) => {
  const map = useMap();
  const searchController = useMemo(() => {
    return new GeoSearchControl({
      provider: new OpenStreetMapProvider({
        params: {
          'accept-language': 'th',
          countrycodes: 'th',
          addressdetails: 2,
        },
      }),
      style: 'bar',
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('geosearch/showlocation', (e: any) => {
      onSelectedLocation(e);
      setTimeout(() => {
        map.setZoom(zoom);
      }, 500);
    });

    map.addControl(searchController);

    return () => {
      map.removeControl(searchController);
      map.clearAllEventListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default SearchLocation;
