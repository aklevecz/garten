import { mapCenters } from "$lib/constants";
import mapUtils from "$lib/mapUtils";
import type { HuntMarker } from "$lib/types";
import { get, writable } from "svelte/store";
import { eggModal } from "./modal";
import userStore from "./user";

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
      : mapUtils.createMarker(mapState.map!, position, "user", mapUtils.smilerIcon());
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
        const mark = new google.maps.Marker({
          position: marker.position,
          map: mapState.map,
          title: marker.name,
          // icon: mapUtils.svgMarker(),
          icon: {
            // url: `data:image/svg+xml;base64,${svg}`,
            url:
              marker.found && marker.finder === get(userStore).hunter
                ? "/egg-broken-smoll-map-icon-yours.svg"
                : marker.found
                ? "/egg-broken-smoll-map-icon-others.svg"
                : "/egg-smoll-map-icon.svg",
            scaledSize: new google.maps.Size(45, 45),
          },
        });
        mark.addListener("click", () => {
          eggModal.set({
            showModal: true,
            data: { title: marker.name, found: marker.found || false, finder: marker.finder || "" },
          });
        });
        return mark;
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
        // @ts-ignore
        const markerCluster = new markerClusterer.MarkerClusterer({ map: mapState.map, markers: newMarkers, renderer });
      }, 2000);
      set({
        ...mapState,
        markers: [...newMarkers],
      });
      return newMarkers;
    },
    createMarker: (marker: HuntMarker) => {
      const newMarker = mapUtils.createMarker(get(mapStore).map!, marker.position, marker.name);
      update((m) => ({ ...m, markers: [...m.markers, newMarker] }));
    },
    createUpdateUserMarker,
    trackUser: () => {
      console.log("trackling");
      let centered = false;
      function success(e: any) {
        console.log("sccesss");
        const lat = e.coords.latitude;
        const lng = e.coords.longitude;

        if (!centered) {
          centered = true;
          get(mapStore).map?.panTo({ lat, lng });
        }

        createUpdateUserMarker({ lat, lng });

        let interval = setInterval(animateMarker, 500);
        function animateMarker() {
          const markerEl: Element | null = document.querySelector("img[src='/smiler.svg']");
          if (markerEl) {
            (markerEl as HTMLElement).style.setProperty("animation", "pulse 1000ms infinite ease-in alternate");
            clearInterval(interval);
          }
        }
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
