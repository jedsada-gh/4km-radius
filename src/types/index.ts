import { LatLngLiteral } from 'leaflet';

export type BaseLocationEvent = {
  onLocationChange: (latlng: LatLngLiteral) => void;
};

export type MyLocationEvent = {
  zoom: number;
  onForceUpdateLocation: (latlng: LatLngLiteral) => void;
} & BaseLocationEvent;

export type SelectLocationEvent = {
  zoom: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedLocation: (data: any) => void;
};
