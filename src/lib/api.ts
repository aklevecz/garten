import type { HuntMarker } from "./types";

const endpoints = {
  markers: "/api/markers",
};

const getMarkers = (): Promise<{ markers: HuntMarker[] }> => fetch(endpoints.markers).then((r) => r.json());

const findMarker = async (code: string) => {
  const res = await fetch(endpoints.markers, { method: "POST", body: JSON.stringify({ code }) });
  const data = await res.json();
  if (res.status !== 200) {
    throw Error(data.message);
  }
  return data;
};

export default { getMarkers, findMarker };
