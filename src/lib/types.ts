import type { Writable } from "svelte/store";

export type Hunts = "fwb-fest" | "fwb-flower";
export type HuntMarker = {
  name: string;
  hunt: Hunts;
  position: google.maps.LatLngLiteral;
  code: string;
  found?: boolean;
  finder?: string;
};

export type EggModal = Writable<{
  showModal: boolean;
  data: {
    title: string;
    found: boolean;
    finder: string;
  };
}>;
