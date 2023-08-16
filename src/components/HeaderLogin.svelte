<script lang="ts">
  import Login from "$components/modals/Login.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import In from "$components/svg/In.svelte";
  import Out from "$components/svg/Out.svelte";
  import { getHunterFoundCount } from "$lib/markerUtils";
  import type { HuntMarker } from "$lib/types";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";

  $: hunter = $page.data.hunter || "";
  $: markers = ($page.data.markers as HuntMarker[]) || [];
  let showModal = false;
</script>

<div class="header hunter">
  <div class="hunter-name" class:hide={!hunter}>
    {hunter?.slice(0, 20)}
    {hunter.length > 20 ? "..." : ""}
  </div>

  <div class:hide={!hunter} class="collected-container">
    <div class="egg-wrapper"><Egg /></div>
    <div>{getHunterFoundCount(markers, hunter)}</div>
  </div>
  <div class="buttons">
    <form method="POST" use:enhance>
      {#if hunter}<button formaction="/?/logout"><Out /></button>{/if}
    </form>
    <!-- if using login button {#if !hunter}<button
        style="width:150px;"
        on:click={() => {
          showModal = true;
        }}
        ><div>identify</div>
        <div class="egg-wrapper"><In /></div></button
      >{/if} -->
    {#if !hunter}
      <div>who are you?</div>
    {/if}
    <Login bind:showModal />
  </div>
</div>

<style>
  button {
    background: none;
    border: none;
    font-weight: bold;
    width: 50px;
    height: 50px;
  }

  .hunter {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* gap: 50px; */
    width: 100vw;
    /* text-align: center; */
    padding: 2px 10px;
  }
  .hunter-name {
    /* flex: 1 0 auto; */
  }
  .collected-container {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    height: 30px;
  }
  .egg-wrapper {
    width: 30px;
    height: 30px;
  }
  .buttons {
    /* flex: 1 0 auto; */
  }
  button {
    display: flex;
    color: black;
    /* height: 50px; */
    /* width: 150px; */
  }
  .hide {
    display: none;
  }
</style>
