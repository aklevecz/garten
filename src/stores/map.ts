import { writable, get } from "svelte/store";
import { mapCenters } from "$lib/constants";
import type { HuntMarker } from "$lib/types";
import mapUtils from "$lib/mapUtils";

function circlePath(cx: number, cy: number, r: number) {
  return (
    "M " +
    cx +
    " " +
    cy +
    " m -" +
    r +
    ", 0 a " +
    r +
    "," +
    r +
    " 0 1,1 " +
    r * 2 +
    ",0 a " +
    r +
    "," +
    r +
    " 0 1,1 -" +
    r * 2 +
    ",0"
  );
}

type MapStore = {
  map: google.maps.Map | null;
  center: google.maps.LatLngLiteral;
  markers: google.maps.Marker[];
};

function createStore() {
  const mapStore = writable<MapStore>({ map: null, center: mapCenters.laColombe, markers: [] });
  const { set, subscribe, update } = mapStore;

  return {
    subscribe,
    setMap: (map: google.maps.Map) => {
      update((m) => ({ ...m, map }));
    },
    setMarkers: (markers: HuntMarker[]) => {
      const mapState = get(mapStore);
      const newMarkers = markers.map((marker) => {
        return new google.maps.Marker({
          position: marker.position,
          map: mapState.map,
          title: marker.name,
          icon: mapUtils.svgMarker(),
        });
      });

      set({
        ...mapState,
        markers: [...newMarkers],
      });
    },
    createMarker: (marker: HuntMarker) => {
      const newMarker = mapUtils.createMarker(get(mapStore).map!, marker);
      update((m) => ({ ...m, markers: [...m.markers, newMarker] }));
    },
  };
}

const mapStore = createStore();
export default mapStore;
