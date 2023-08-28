import { useMap } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { MyLocationEvent } from '../types';

const MyLocation = ({
  onLocationChange,
  onLocationError,
  onForceUpdateLocation,
}: MyLocationEvent) => {
  const map = useMap();
  const { Locate } = L.Control;
  const myLocation = useRef<LatLngLiteral>();
  const locate = useMemo(() => {
    return new Locate({
      flyTo: true,
      initialZoomLevel: 13.9,
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
      onLocationError && onLocationError("Can't get the current user location");
    });

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
