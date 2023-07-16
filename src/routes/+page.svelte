<script lang="ts">
  import { invalidate, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import Login from "$components/modals/Login.svelte";
  import In from "$components/svg/In.svelte";
  import Locate from "$components/svg/Locate.svelte";
  import Out from "$components/svg/Out.svelte";
  import mapStore from "$stores/map";
  import type { PageData } from "./$types";
  export let data: PageData;

  let mapLoaded = false;
  let showModal = false;

  function initHunt() {
    const { markers } = data;
    mapStore.setMarkers(markers);
  }

  $: {
    if (mapLoaded && data.markers) {
      initHunt();
    }
  }
</script>

<svelte:window on:blur={invalidateAll} on:focus={invalidateAll} />
<div class="user-bar">
  <!-- <div>{$page.data.hunter || "signin"}</div> -->
  {#if $page.data.hunter}<form method="POST">
      <button formaction="/?/logout" class="small">{$page.data.hunter.slice(0, 10)}<Out /></button>
    </form>{/if}
  {#if !$page.data.hunter}<button
      class="small"
      on:click={() => {
        showModal = true;
      }}>signin<In /></button
    >{/if}
</div>
<Login bind:showModal />
<GoogleMaps
  globally
  on:load={(e) => {
    mapLoaded = true;
    console.log("+page.svelte:Map Loaded");
  }}
/>
<button class="user-position" on:click={() => mapStore.trackUser()}><Locate /></button>

<style>
  .user-bar {
    display: flex;
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 99;
    background-color: none;
    align-items: center;
    justify-content: space-between;
    padding: 4px 2px 4px 12px;
    gap: 4px;
    font-size: 12px;
    border-radius: 10px;
  }
  .user-bar button.small {
    display: flex;
    background-color: white;
    color: black;
    align-items: center;
    border-radius: 10px;
    width: 120px;
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
