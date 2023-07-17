import type { HuntMarker } from "./types";

export const getHunterFound = (markers: HuntMarker[], hunter: string) => {
  return markers.filter((m) => m.finder === hunter);
};

export const getHunterFoundCount = (markers: HuntMarker[], hunter: string) => getHunterFound(markers, hunter).length;
