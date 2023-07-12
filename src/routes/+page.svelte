<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import Modal from "$components/Modal.svelte";
  import Login from "$components/modals/Login.svelte";
  import mapStore from "$stores/map";
  import type { PageData } from "./$types";
  export let data: PageData;

  let coords = { lat: 0, lng: 0 };
  function initHunt() {
    const { markers } = data;
    mapStore.setMarkers(markers);
    function success(e: any) {
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
      mapStore.createUpdateUserMarker(coords);
    }
  }

  $: {
    console.log("+page.svelte, $page.data:", $page.data);
  }

  let showModal = false;
</script>

<button
  on:click={() => {
    showModal = true;
  }}
  class="lat-lng">{JSON.stringify(coords)} - {$page.data.hunter || "not logged in"}</button
>
<Login hunter={data.hunter} bind:showModal />
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
