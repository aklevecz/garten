import { writable } from "svelte/store";
import { mapCenters } from "../libs/constants";

type MapStore = {
  map: google.maps.Map | null;
  center: google.maps.LatLngLiteral;
};

function createStore() {
  const mapStore = writable<MapStore>({ map: null, center: mapCenters.fwbFest });
  const { subscribe } = mapStore;

  return {
    subscribe,
    createMarker: (loc: google.maps.LatLng) => {},
  };
}

const mapStore = createStore();
export default mapStore;
