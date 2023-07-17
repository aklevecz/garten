import type { HuntMarker } from "./types";

const endpoints = {
  markers: "/api/markers",
};

const getMarkers = (): Promise<{ markers: HuntMarker[] }> => fetch(endpoints.markers).then((r) => r.json());

const findMarker = (code: string) => {
  return fetch(endpoints.markers, { method: "POST", body: JSON.stringify({ code }) }).then((r) => r.json());
};

export default { getMarkers, findMarker };
