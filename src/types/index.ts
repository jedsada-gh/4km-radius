import { LatLngLiteral } from 'leaflet';

export type BaseLocationEvent = {
  onLocationChange: (latlng: LatLngLiteral) => void;
};

export type MyLocationEvent = {
  onLocationError: (message: string) => void;
  onForceUpdateLocation: (latlng: LatLngLiteral) => void;
} & BaseLocationEvent;

export type SelectLocationEvent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedLocation: (data: any) => void;
};
