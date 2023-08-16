import { mapCenters } from "$lib/constants";
import mapUtils from "$lib/mapUtils";
import type { Hunt, HuntMarker } from "$lib/types";
import { get, writable } from "svelte/store";
import { eggModal } from "./modal";
import userStore from "./user";

export const loadingLocation = writable(false);

type MapStore = {
  map: google.maps.Map | null;
  center: google.maps.LatLngLiteral;
  markers: google.maps.Marker[];
  userMarker: google.maps.Marker | null;
  watchinglocation: boolean;
};

function createStore() {
  const mapStore = writable<MapStore>({
    map: null,
    center: mapCenters.laColombe,
    markers: [],
    userMarker: null,
    watchinglocation: false,
  });
  const { set, subscribe, update } = mapStore;

  // maputils, but has store effects
  const createUpdateUserMarker = (position: google.maps.LatLngLiteral) => {
    const mapState = get(mapStore);
    const markerExists = Boolean(mapState.userMarker);
    const userMarker = markerExists
      ? mapState.userMarker
      : mapUtils.createMarker(mapState.map!, position, "user", mapUtils.smilerIcon());
    userMarker?.setPosition(position);
    update((m) => ({ ...m, userMarker }));
    return { markerExists };
  };

  return {
    subscribe,
    setMap: (map: google.maps.Map) => {
      update((m) => ({ ...m, map }));
    },
    initHunt: (hunt: Hunt) => {
      const mapState = get(mapStore);
      mapState.map?.setCenter(hunt.position);
    },
    setMarkers: (markers: HuntMarker[], iconUrl: string) => {
      const mapState = get(mapStore);
      const scalar = 3;
      const newMarkers = markers.map((marker) => {
        const mark = new google.maps.Marker({
          position: marker.position,
          map: mapState.map,
          title: marker.name,
          // icon: mapUtils.svgMarker(),
          icon: {
            // url: `data:image/svg+xml;base64,${svg}`,
            url:
              //  marker.customMarker || "/" + iconUrl,
              marker.found && marker.finder === get(userStore).hunter
                ? "/egg-broken-smoll-map-icon-yours.svg"
                : marker.found
                ? "/egg-broken-smoll-map-icon-others.svg"
                : "/egg-smoll-map-icon.svg",
            scaledSize: new google.maps.Size(11 * scalar, 17 * scalar),
          },
        });
        mark.addListener("click", () => {
          console.log(marker);
          eggModal.set({
            showModal: true,
            data: {
              title: marker.name,
              found: marker.found || false,
              finder: marker.finder || "",
              isCracker: marker.isCracker || false,
              customMarker: marker.customMarker || null,
            },
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
      const { watchinglocation, userMarker, map } = get(mapStore);
      if (watchinglocation && userMarker && map) {
        const coords = userMarker.getPosition();
        const lat = coords?.lat()!;
        const lng = coords?.lng()!;
        map.panTo({ lat, lng });
        // return false so that the page does not update the unsub for the tracking -- janky
        return false;
      }
      loadingLocation.set(true);
      let centered = false;
      function success(e: any) {
        const lat = e.coords.latitude;
        const lng = e.coords.longitude;
        console.log(lat, lng);
        if (!centered) {
          centered = true;
          map!.panTo({ lat, lng });
        }

        const { markerExists } = createUpdateUserMarker({ lat, lng });

        if (!markerExists) {
          let interval = setInterval(animateMarker, 500);
          function animateMarker() {
            const markerEl: Element | null = document.querySelector("img[src='/smiler.svg']");
            if (markerEl) {
              (markerEl as HTMLElement).style.setProperty("animation", "pulse 1000ms infinite ease-in alternate");
              clearInterval(interval);
            }
          }
        }
        update((m) => ({ ...m, watchinglocation: true }));
        loadingLocation.set(false);
      }
      function error(err: any) {
        console.error(`ERROR(${err.code}): ${err.message}`);
      }
      let watchFrame = navigator.geolocation.watchPosition(success, error, { maximumAge: 0, enableHighAccuracy: true });
      return () => {
        navigator.geolocation.clearWatch(watchFrame);
        console.log("clearing watch");
      };
    },
  };
}

const mapStore = createStore();
export default mapStore;
