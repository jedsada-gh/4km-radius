import { useMap } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { MyLocationEvent } from '../types';

const MyLocation = ({
  zoom,
  onLocationChange,
  onForceUpdateLocation,
}: MyLocationEvent) => {
  const map = useMap();
  const { Locate } = L.Control;
  const myLocation = useRef<LatLngLiteral>();
  const locate = useMemo(() => {
    return new Locate({
      flyTo: true,
      initialZoomLevel: zoom,
      drawCircle: false,
      showPopup: false,
      showCompass: true,
      cacheLocation: true,
      strings: { title: 'Location' },
      locateOptions: { enableHighAccuracy: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      locate.addTo(map);
      locate.start();

      const myLocBtn = document.getElementsByClassName(
        'leaflet-bar-part leaflet-bar-part-single'
      );

      for (let index = 0; index < myLocBtn.length; index++) {
        const element = myLocBtn[index];
        element.addEventListener('click', () => {
          if (myLocation.current) {
            onForceUpdateLocation(myLocation.current);
          }
        });
      }

      map.on('locationfound', (e) => {
        myLocation.current = e.latlng;
        onLocationChange(e.latlng);
      });

      map.on('locationerror', () => {
        myLocation.current = map.getCenter();
        onLocationChange(myLocation.current);
        console.error("can't get the current user location");
      });
    } catch (e) {
      myLocation.current = map.getCenter();
      onLocationChange(myLocation.current);
    }

    return () => {
      locate.stop();
      map.stop();
      map.clearAllEventListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Locate, map]);

  return null;
};

export default MyLocation;
