import type { Writable } from "svelte/store";

export type Hunts = "fwb-fest" | "bao-eggs";
export type Hunt = {
  name: string;
  position: google.maps.LatLngLiteral;
  markerPath: string;
};
export type HuntMarker = {
  name: string;
  hunt: Hunts;
  position: google.maps.LatLngLiteral;
  code: string;
  found?: boolean;
  finder?: string;
  isCracker?: boolean;
};

export type EggModal = Writable<{
  showModal: boolean;
  data: {
    title: string;
    found: boolean;
    finder: string;
    isCracker: boolean;
  };
}>;
