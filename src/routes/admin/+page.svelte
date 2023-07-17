<script lang="ts">
  import { enhance } from "$app/forms";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  function onLoad(e: CustomEvent) {
    let map = e.detail.map as google.maps.Map;
    // new google.maps.Marker({ position: map.getCenter(), map, draggable: true });
    const input = document.createElement("input") as HTMLInputElement;
    input.style.width = "300px";
    const searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places && places.length && places[0].geometry) {
        const placeMarker = new google.maps.Marker({ position: places[0].geometry.location, map, draggable: true });
        placeMarker.addListener("drag", console.log);
      }
    });
  }
</script>

<h1>Admin</h1>
{#each data.markers as marker}
  <div class="marker-container">
    <div>{marker.name}</div>
    <div>{marker.hunt}</div>
    <div>{Object.values(marker.position).join(", ")}</div>
  </div>
{/each}
<form method="POST" action="?/add" use:enhance>
  <input name="name" />
  <button>submit</button>
</form>
<GoogleMaps height="300px" on:load={onLoad} />

<style>
  .marker-container {
    margin: 10px;
  }
</style>
