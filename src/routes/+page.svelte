<script lang="ts">
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import mapStore from "$stores/map";
  export let data;

  let coords = { lat: 0, lng: 0 };
  function initHunt() {
    const { markers } = data;
    mapStore.setMarkers(markers);
    function success(e: any) {
      console.log(e);
      coords.lat = e.coords.latitude;
      coords.lng = e.coords.longitude;
      coords = coords;
    }
    function error(err: any) {
      console.error(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.watchPosition(success, error, { maximumAge: 0, enableHighAccuracy: true });
  }

  $: {
    if (coords.lat && coords.lng && $mapStore.map) {
      $mapStore.map.setCenter(coords);
      mapStore.createMarker({ name: "test", hunt: "fwb-fest", position: coords });
    }
  }
</script>

<div class="lat-lng">{JSON.stringify(coords)}</div>
<GoogleMaps
  globally
  on:load={(e) => {
    initHunt();
    console.log("+page.svelte:Map Loaded");
  }}
/>

<style>
  .lat-lng {
    position: absolute;
    left: 10px;
    top: 10px;
    color: red;
    z-index: 99;
  }
</style>
