import { writable, get } from "svelte/store";
import { mapCenters } from "$lib/constants";
import type { HuntMarker } from "$lib/types";
import mapUtils from "$lib/mapUtils";

type MapStore = {
  map: google.maps.Map | null;
  center: google.maps.LatLngLiteral;
  markers: google.maps.Marker[];
  userMarker: google.maps.Marker | null;
};

function createStore() {
  const mapStore = writable<MapStore>({ map: null, center: mapCenters.laColombe, markers: [], userMarker: null });
  const { set, subscribe, update } = mapStore;

  // maputils, but has store effects
  const createUpdateUserMarker = (position: google.maps.LatLngLiteral) => {
    const mapState = get(mapStore);
    const userMarker = mapState.userMarker
      ? mapState.userMarker
      : mapUtils.createMarker(mapState.map!, position, "user");
    update((m) => ({ ...m, userMarker }));
  };

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
          // icon: mapUtils.svgMarker(),
          icon: {
            // url: `data:image/svg+xml;base64,${svg}`,
            url: "/egg-smoll-map-icon.svg",
            scaledSize: new google.maps.Size(45, 45),
          },
        });
      });
      const renderer = {
        render: ({ count, position }: any) =>
          new google.maps.Marker({
            // label: { text: String(count), color: "red", fontSize: "20px" },
            position,
            icon: {
              // url: `data:image/svg+xml;base64,${svg}`,
              url: "/egg-bunch.svg",
              scaledSize: new google.maps.Size(60, 60),
            },
            // adjust zIndex to be above other markers
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          }),
      };
      setTimeout(() => {
        const markerCluster = new markerClusterer.MarkerClusterer({ map: mapState.map, markers: newMarkers, renderer });
      }, 2000);
      set({
        ...mapState,
        markers: [...newMarkers],
      });
    },
    createMarker: (marker: HuntMarker) => {
      const newMarker = mapUtils.createMarker(get(mapStore).map!, marker.position, marker.name);
      update((m) => ({ ...m, markers: [...m.markers, newMarker] }));
    },
    createUpdateUserMarker,
    trackUser: () => {
      function success(e: any) {
        const lat = e.coords.latitude;
        const lng = e.coords.longitude;
        createUpdateUserMarker({ lat, lng });
      }
      function error(err: any) {
        console.error(`ERROR(${err.code}): ${err.message}`);
      }
      let watchFrame = navigator.geolocation.watchPosition(success, error, { maximumAge: 0, enableHighAccuracy: true });
      return () => navigator.geolocation.clearWatch(watchFrame);
    },
  };
}

const mapStore = createStore();
export default mapStore;
