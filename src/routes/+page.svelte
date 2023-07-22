<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import GoogleMaps from "$components/GoogleMaps.svelte";
  import Egg from "$components/modals/Egg.svelte";
  import Login from "$components/modals/Login.svelte";
  import EggIcon from "$components/svg/Egg.svelte";
  import In from "$components/svg/In.svelte";
  import Locate from "$components/svg/Locate.svelte";
  import Out from "$components/svg/Out.svelte";
  import { getHunterFoundCount } from "$lib/markerUtils";
  import mapStore, { loadingLocation } from "$stores/map";
  import { onDestroy, onMount } from "svelte";
  import type { PageData } from "./$types";
  import LoadingSpinner from "$components/LoadingSpinner.svelte";
  import local from "$lib/local";
  import Info from "$components/modals/Info.svelte";
  export let data: PageData;

  let mapLoaded = false;
  let showModal = false;

  function initHunt() {
    const { markers } = data;
    mapStore.setMarkers(markers);
  }

  $: {
    $page.data.hunter;
    if (mapLoaded && data.markers) {
      initHunt();
    }
  }

  function onBlur() {
    invalidateAll();
  }

  let unsubTrack = () => {};
  function trackUser() {
    // track user creates user marker or just centers the map to the location of the last marker
    const unsub = mapStore.trackUser();
    if (unsub) {
      unsubTrack = unsub;
    }
  }

  let showInfoModal = false;
  onMount(() => {
    if (!local().hasSeenInfo) {
      showInfoModal = true;
    }
  });

  onDestroy(() => {
    unsubTrack();
  });
</script>

<svelte:window on:blur={onBlur} on:focus={onBlur} on:visibilitychange={onBlur} />
<Info bind:showModal={showInfoModal} />
<div class="user-bar">
  {$page.data.hunter.slice(0, 10)}
  <!-- {$mapStore.userMarker?.getPosition()?.lat()}, {$mapStore.userMarker?.getPosition()?.lng()} -->
  <!-- <div>{$page.data.hunter || "signin"}</div> -->
  {#if $page.data.hunter}<form method="POST" use:enhance>
      <button formaction="/?/logout" class="small"> <div class="icon-wrapper"><Out /></div></button>
    </form>{/if}
  {#if !$page.data.hunter}identify<button
      class="small"
      on:click={() => {
        showModal = true;
      }}><In /></button
    >{/if}
</div>

<div class="collected-container">
  <div class="collected-wrapper">
    <div class="egg-wrapper"><EggIcon /></div>
    <div class="num-wrapper">{getHunterFoundCount($page.data.markers, $page.data.hunter)}</div>
  </div>
</div>

<Login bind:showModal />
<Egg />
<GoogleMaps
  globally
  on:load={(e) => {
    mapLoaded = true;
    console.log("+page.svelte:Map Loaded");
  }}
/>
<button class="user-position" on:click={trackUser}>
  {#if $loadingLocation}
    <LoadingSpinner />
  {:else}
    <Locate />
  {/if}
</button>

<style>
  .collected-container {
    position: absolute;
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    height: 80px;
    z-index: 9;
    right: 10px;
    justify-content: center;
  }
  .collected-wrapper {
    background-color: white;
    display: flex;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
  }
  .egg-wrapper {
    flex: 0 1 50%;
  }
  .num-wrapper {
    flex: 0 0 30%;
  }
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
    background-color: black;
    color: white;
    /* border: 2px solid black; */
  }
  .user-bar button.small {
    border: none;
    display: flex;
    background-color: white;
    color: black;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    margin: 5px;
    height: 30px;
  }
  .icon-wrapper {
    width: 25px;
    height: 25px;
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
