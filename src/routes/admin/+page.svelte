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
  let showForm = true;
  $: markers = data.markers;
</script>

<div class="container">
  <h1>Admin</h1>
  <div class="button-container"><button on:click={() => (showForm = !showForm)}>form</button></div>

  <div class:hide={!showForm}>
    <div class="marker-container">
      <div class="marker-wrapper heading">
        <div>name</div>
        <div>hunt</div>
        <div>code</div>
        <div>lat</div>
        <div>lng</div>
        <div>custom marker</div>
      </div>
      {#each markers as marker}
        <form
          method="POST"
          action="?/update"
          use:enhance={() => {
            return async ({ update }) => {
              await update({ reset: false });
              // Redo the assignment from the script above
              markers = data.markers;
            };
          }}
        >
          <div class="marker-wrapper">
            <!-- <div>{marker.name}</div> -->
            <input name="name" value={marker.name} />
            <input name="hunt" value={marker.hunt} />
            <input name="code" value={marker.code} />
            <input name="lat" value={marker.position.lat} />
            <input name="lng" value={marker.position.lng} />
            <input name="custom-marker" value={marker.customMarker} />
            <div>{JSON.stringify(marker)}</div>
            <!-- <div>{marker.hunt}</div> -->
            <!-- <div>{marker.code}</div> -->
            <!-- <button on:click={() => onQR(`https://garten-six.vercel.app/find/${marker.code}`)}>qr</button> -->
            <!-- <input name="hunt-name" value={marker.hunt} style="display:none;" /> -->
            <!-- <input name="code" value={marker.code} style="display:none;" /> -->
            <div>
              <button>update</button>
              <button formaction="admin/?/delete">delete</button>
            </div>
          </div>
        </form>
      {/each}
    </div>
    <form class="form-col" method="POST" action="?/add" use:enhance>
      <input placeholder="name" name="name" />
      <input placeholder="hunt" name="hunt" value={data.hunt} />
      <input placeholder="code" name="code" />
      <input placeholder="custom-marker" name="custom-marker" />
      <input placeholder="lat" name="lat" bind:value={position.lat} />
      <input placeholder="lng" name="lng" bind:value={position.lng} />
      <div><button>create</button></div>
    </form>
    <form class="form-col" method="POST" action="?/addHunt" use:enhance>
      <input placeholder="name" name="name" />
      <input placeholder="marker path" name="marker-path" />
      <input placeholder="lat" name="lat" bind:value={position.lat} />
      <input placeholder="lng" name="lng" bind:value={position.lng} />
      <div><button>create hunt</button></div>
    </form>
    <canvas bind:this={canvasRef} width="1275" height="1650" />
  </div>
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
  h1 {
    margin: 0px;
  }
  .hide {
    display: none;
  }
  .button-container {
    display: flex;
  }
  canvas {
    width: 100px;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
  }
  .marker-container {
    margin: 10px 0px;
  }
  .marker-wrapper {
    display: flex;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border: 1px solid black;
    padding: 4px;
  }
  .marker-wrapper.heading {
    background-color: red;
  }
  .form-col {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 50%;
    border: 1px solid black;
    margin: 10px auto;
    padding: 8px;
  }
  .form-col > input {
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
