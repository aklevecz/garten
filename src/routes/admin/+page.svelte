<script lang="ts">
  import { enhance } from "$app/forms";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import Locate from "$components/svg/Locate.svelte";
  import mapUtils from "$lib/mapUtils";
  import { redirect } from "@sveltejs/kit";
  import type { PageData } from "./$types";

  export let data: PageData;

  let map: google.maps.Map;
  let mapContainer: HTMLDivElement;
  let position = { lat: 0, lng: 0 };

  let canvasRef: HTMLCanvasElement;
  $: {
    if (map && data.markers) {
      for (const marker of data.markers) {
        mapUtils.createMarker(map, marker.position, marker.name, mapUtils.eggIcon());
      }
    }
  }

  function onLoad(e: CustomEvent) {
    map = e.detail.map as google.maps.Map;
    // for (const marker of data.markers) {
    //   mapUtils.createMarker(map, marker.position, marker.name, mapUtils.eggIcon());
    // }
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
    position = { lat, lng };
    // @ts-ignore
    placeMarker.addListener("drag", (e: any) => {
      lat = e.latLng.lat();
      lng = e.latLng.lng();
      position = { lat, lng };
    });
  };

  const onQR = async (qrString: string) => {
    // @ts-ignore
    const qr = (await import("qrcode")).default;
    let eggImg = new Image();
    const canvasDims = { width: 1275, height: 1650 };
    const ctx = canvasRef.getContext("2d")!;
    eggImg.onload = () => {
      qr.toDataURL(qrString, {
        width: 1080,
        type: "terminal",
        color: {
          light: "#4C4D4D",
          dark: "#FFF",
        },
      }).then((url: string) => {
        let img = new Image();
        img.src = url;

        const imgDim = 1200;
        ctx.drawImage(
          eggImg,
          // canvasDims.width * 0.5 - imgDim / 2,
          // canvasDims.height * 0.5 - imgDim / 2,
          0,
          0,
          canvasDims.width,
          canvasDims.height
        );

        img.onload = () => {
          const dim = 150;

          ctx?.drawImage(img, canvasDims.width * 0.5 - dim * 0.5 + 200, canvasDims.height - 500, dim, dim);
        };
      });
    };
    eggImg.src = "http://localhost:5173/egg-qr-template.png";
  };
</script>

<div class="container">
  <h1>Admin</h1>
  <div class="marker-container">
    {#each data.markers as marker}
      <div class="marker-wrapper">
        <div>{marker.name}</div>
        <div>{marker.hunt}</div>
        <div>{marker.code}</div>
        <button on:click={() => onQR(`https://garten-six.vercel.app/find/${marker.code}`)}>qr</button>
      </div>
    {/each}
  </div>
  <form method="POST" action="?/add" use:enhance>
    <input placeholder="name" name="name" />
    <input placeholder="hunt" name="hunt" value={data.hunt} />
    <input placeholder="code" name="code" />
    <input placeholder="lat" name="lat" bind:value={position.lat} />
    <input placeholder="lng" name="lng" bind:value={position.lng} />
    <div><button>create</button></div>
  </form>
  <canvas bind:this={canvasRef} width="1275" height="1650" />
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
  canvas {
    width: 100px;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
  }
  .marker-wrapper {
    display: flex;
    gap: 8px;
    border: 1px solid black;
    margin: 10px;
    padding: 4px;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 50%;
  }
  form > input {
    width: 200px;
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
