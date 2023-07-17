<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import Login from "$components/modals/Login.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import In from "$components/svg/In.svelte";
  import Out from "$components/svg/Out.svelte";
  import api from "$lib/api";
  import { getHunterFound, getHunterFoundCount } from "$lib/markerUtils";
  import type { HuntMarker } from "$lib/types";
  import gameStore from "$stores/game";
  import { onMount } from "svelte";

  $: hunter = $page.data.hunter || "";
  $: markers = ($page.data.markers as HuntMarker[]) || [];
  let showModal = false;

  // wont do anything currently
  // onMount(() => {
  //   gameStore.init($page.data.eggsCollected);
  // });
</script>

<div class="layout-container">
  <div class="hunter">
    <div class:hide={!hunter}>
      {hunter?.slice(0, 20)}
      {hunter.length > 20 ? "..." : ""}
    </div>

    <div class="collected-container"><Egg /> {getHunterFoundCount(markers, hunter)}</div>
    <form method="POST" use:enhance>
      {#if hunter}<button formaction="/?/logout"><Out /></button>{/if}
    </form>
    {#if !hunter}<button
        on:click={() => {
          showModal = true;
        }}><In /></button
      >{/if}
    <Login bind:showModal />
  </div>
  <slot />
</div>

<style>
  button {
    background: none;
    border: none;
    font-weight: bold;
    width: 50px;
    height: 50px;
  }

  .layout-container {
    height: 100%;
    min-height: 50px;
    display: flex;
    flex-direction: column;
  }
  .hunter {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* gap: 50px; */
    width: 100%;
    text-align: center;
    padding: 2px 10px;
  }
  .collected-container {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    height: 30px;
  }
  .hide {
    display: none;
  }
</style>
