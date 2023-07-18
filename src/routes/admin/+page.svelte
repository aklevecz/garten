<script lang="ts">
  import { enhance } from "$app/forms";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import Locate from "$components/svg/Locate.svelte";
  import mapUtils from "$lib/mapUtils";
  import type { PageData } from "./$types";

  export let data: PageData;

  let map: google.maps.Map;
  let mapContainer: HTMLDivElement;
  let position = { lat: 0, lng: 0 };

  function onLoad(e: CustomEvent) {
    map = e.detail.map as google.maps.Map;

    for (const marker of data.markers) {
      mapUtils.createMarker(map, marker.position, marker.name, mapUtils.eggIcon());
    }

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
      if (places && places.length && places[0].geometry && places[0].geometry.location) {
        // const placeMarker = new google.maps.Marker({ position: places[0].geometry.location, map, draggable: true });
        const placeMarker = mapUtils.createMarker(map, places[0].geometry.location, "place");
        let location = places[0].geometry.location;
        let lat = location?.lat()!;
        let lng = location?.lng()!;
        position = { lat, lng };
        placeMarker.addListener("drag", (e: any) => {
          lat = e.latLng.lat();
          lng = e.latLng.lng();
          position = { lat, lng };
        });
      }
    });
  }

  const onMarkClick = () => {
    const center = map.getCenter();
    const placeMarker = new google.maps.Marker({
      map,
      position: center,
      draggable: true,
    });
    let lat = center!.lat();
    let lng = center!.lng();
    // @ts-ignore
    placeMarker.addListener("drag", (e: any) => {
      lat = e.latLng.lat();
      lng = e.latLng.lng();
      position = { lat, lng };
    });
  };
</script>

<div class="container">
  <h1>Admin</h1>
  <div class="marker-container">
    {#each data.markers as marker}
      <div class="marker-wrapper">
        <div>{marker.name}</div>
        <div>{marker.hunt}</div>
      </div>
    {/each}
  </div>
  <form method="POST" action="?/add" use:enhance>
    <input placeholder="name" name="name" />
    <input placeholder="hunt" name="hunt" value={data.hunt} />
    <input placeholder="code" name="code" />
    <input placeholder="lat" name="lat" bind:value={position.lat} />
    <input placeholder="lng" name="lng" bind:value={position.lng} />
    <button>submit</button>
  </form>
  <div class="map-container" bind:this={mapContainer}>
    <GoogleMaps height="100%" on:load={onLoad} />
  </div>
</div>

<button
  class="user-position"
  on:click={() => {
    navigator.geolocation.getCurrentPosition((e) => {
      const lat = e.coords.latitude;
      const lng = e.coords.longitude;
      position = { lat, lng };
      map.setCenter({ lat, lng });
    });
  }}><Locate /></button
>
<button class="user-position" style="bottom:100px;" on:click={onMarkClick}>MARK</button>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
  }
  .marker-container {
    display: flex;
  }
  .marker-wrapper {
    border: 1px solid black;
    margin: 10px;
    padding: 4px;
  }
  form {
    display: flex;
    flex-direction: column;
    width: 50%;
  }
  .map-container {
    flex: 1 0 auto;
    background-color: red;
  }
  .user-position {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 9;
    width: 80px;
    height: 80px;
    background: rgb(255, 0, 162);
    border-radius: 50%;
    border: 10px solid white;
  }
</style>
