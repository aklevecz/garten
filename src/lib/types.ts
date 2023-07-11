export type Hunts = "fwb-fest" | "fwb-flower";
export type HuntMarker = {
  name: string;
  hunt: Hunts;
  position: google.maps.LatLngLiteral;
  found?: boolean;
};
