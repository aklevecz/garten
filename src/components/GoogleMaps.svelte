<script>
  import { PUBLIC_GOOGLE_MAP_KEY } from "$env/static/public";
  import mapStore from "$stores/map";
  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  //import mapStyles from './map-styles'; // optional

  export let globally = false;
  export let map;

  let src = "";
  const key = PUBLIC_GOOGLE_MAP_KEY;

  // @ts-ignore
  let container;
  let zoom = 8;
  let center = $mapStore.center;

  onMount(() => {
    Object.assign(window, {
      mapLoaded: () => {
        // @ts-ignore
        map = new google.maps.Map(container, {
          zoom,
          center,
          // styles: mapStyles
        });
        dispatch("load", true);
        if (globally) {
          Object.assign(window, { map });
        }
      },
    });

    //Assign
    src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=mapLoaded`;
  });
</script>

<!-- This is tailwind css class change with whatever fits to your case. -->
<div class="w-full h-full" bind:this={container} />
<svelte:head>
  {#if src}
    <script {src}></script>
  {/if}
</svelte:head>
