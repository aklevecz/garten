import { mapCenters } from "$lib/constants";
import type { HuntMarker, Hunts } from "./types";

// HUNT#<hunt_name>
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
// HUNT#hunt_name#MARKER#marker_name/id
const markers: HuntMarker[] = [
  { name: "fwb-fest-1", hunt: "fwb-fest", position: { ...mapCenters.laColombe } },
  {
    name: "fwb-fest-2",
    hunt: "fwb-fest",
    position: { lat: mapCenters.laColombe.lat + 0.0001, lng: mapCenters.laColombe.lng + 0.0001 },
  },
];

const getActiveHunt = () => {
  return hunts["fwb-fest"];
};

const getMarkers = (hunt: Hunts) => {
  return markers.filter((m) => m.hunt === hunt);
};

const checkMarker = (name: string) => markers.find((m) => m.name === name)?.found;

export default { getMarkers, checkMarker, getActiveHunt };
