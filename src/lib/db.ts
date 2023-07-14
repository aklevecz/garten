import { mapCenters } from "$lib/constants";
import type { HuntMarker, Hunts } from "./types";

function genRandomLoc(center: { lat: number; lng: number }): HuntMarker {
  const radius = 0.05;
  const lat = center.lat + radius * (Math.random() - 0.5);
  const lng = center.lng + radius * (Math.random() - 0.5);
  return { position: { lat, lng }, name: "fuck", hunt: "fwb-fest", code: "code", found: false };
}

const randomLocs = [];

for (let i = 0; i < 20; i++) {
  randomLocs.push(genRandomLoc(mapCenters.laColombe));
}

// HUNT#<hunt_name> HUNT#<hunt_name>
const hunts: { [hunt in Hunts]: any } = {
  "fwb-fest": {
    name: "fwb-fest",
    center: mapCenters.laColombe,
  },
  "fwb-flower": {
    name: "fwb-flower",
    center: mapCenters.fwbFest,
  },
};
// @todo markers hunt mapping
// @todo marker groups?
// MARKER#marker_name/id HUNT#<hunt_name>
let markers: HuntMarker[] = [
  ...randomLocs,
  { name: "fwb-fest-1", hunt: "fwb-fest", position: { ...mapCenters.laColombe }, code: "shrimp" },
  {
    name: "fwb-fest-2",
    hunt: "fwb-fest",
    position: { lat: mapCenters.laColombe.lat + 0.0001, lng: mapCenters.laColombe.lng + 0.0001 },
    code: "pimp",
  },
];

const getActiveHunt = () => {
  return hunts["fwb-fest"];
};

const getMarkers = (hunt: Hunts) => {
  return markers.filter((m) => m.hunt === hunt);
};

const checkMarker = (name: string) => markers.find((m) => m.name === name)?.found;

const getMarkerByCode = (code: string) => markers.find((m) => m.code === code);

const claimMarker = (claimedMarker: HuntMarker, finder: string) => {
  const filteredMarkers = markers.filter((marker) => marker.name !== claimedMarker.name);
  markers = [...filteredMarkers, { ...claimedMarker, found: true, finder }];
};

export default { getMarkers, checkMarker, getActiveHunt, getMarkerByCode, claimMarker };
