// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { SearchLocationEvent } from '../types';
import { Icon } from 'leaflet';

const SearchLocation = ({
  zoom,
  onSelectedLocation,
  onClearCircleRadius,
}: SearchLocationEvent) => {
  const map = useMap();
  const searchController = useMemo(() => {
    return new GeoSearchControl({
      marker: {
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
      },
      provider: new OpenStreetMapProvider({
        params: {
          'accept-language': 'th',
          countrycodes: 'th',
          addressdetails: 2,
        },
      }),
      style: 'bar',
      searchLabel: 'ค้นหาสถานที่',
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

    const resetBtn = document.getElementsByClassName('reset');

    for (let index = 0; index < resetBtn.length; index++) {
      const element = resetBtn[index];
      element.addEventListener('click', () => {
        onClearCircleRadius();
      });
    }

    return () => {
      map.removeControl(searchController);
      map.clearAllEventListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default SearchLocation;
