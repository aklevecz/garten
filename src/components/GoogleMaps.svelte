<script lang="ts">
  import { PUBLIC_GOOGLE_MAP_KEY } from "$env/static/public";
  import mapStore from "$stores/map";
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  import mapStyles from "$lib/map-styles"; // optional

  export let globally = false;
  let map;

  const key = PUBLIC_GOOGLE_MAP_KEY;
  let src = "";

  let container: HTMLDivElement;
  let zoom = 13;
  let center = $mapStore.center;

  const genGmapApiLink = (key: string) => `https://maps.googleapis.com/maps/api/js?key=${key}&callback=mapLoaded`;

  onMount(() => {
    const mapLoaded = async () => {
      map = new google.maps.Map(container, {
        zoom,
        center,
        styles: mapStyles,
        disableDefaultUI: true,
      });
      await mapStore.setMap(map);
      dispatch("load", { map });
      if (globally) {
        Object.assign(window, { map });
      }
    };

    Object.assign(window, {
      mapLoaded,
    });

    if (typeof google !== "undefined") {
      // console.log("Map script already loaded...");
      mapLoaded();
    } else {
      src = genGmapApiLink(key);
    }
  });
</script>

<!-- This is tailwind css class change with whatever fits to your case. -->
<div class="map-container" bind:this={container} />
<svelte:head>
  {#if src}
    <script defer async {src}></script>
    <script defer async src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
  {/if}
</svelte:head>

<style>
  .map-container {
    width: 100%;
    height: 100%;
  }
</style>
