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
  class="lat-lng">{JSON.stringify($mapStore.userMarker?.getPosition())} - {$page.data.hunter || "not logged in"}</button
>
<Login hunter={data.hunter} bind:showModal />
<GoogleMaps
  globally
  on:load={(e) => {
    initHunt();
    console.log("+page.svelte:Map Loaded");
  }}
/>
<button class="user-position" on:click={() => mapStore.trackUser()}>USER POSITION</button>

<style>
  .lat-lng {
    position: absolute;
    left: 10px;
    top: 10px;
    color: red;
    z-index: 99;
  }
  .user-position {
    position: absolute;
    bottom: 10px;
    z-index: 9;
  }
</style>
