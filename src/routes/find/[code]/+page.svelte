<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import Login from "$components/modals/Login.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import api from "$lib/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: isAuthed = Boolean(data.hunter);
  $: markerName = data.marker.name;
  $: markerFound = $page.data.marker.found ? "ALREADY FOUND" : "";
  $: finder = $page.data.marker.finder || "CRACKABLE";
</script>

<div class="list-container">
  <div class="marker-name">{markerName}</div>
  <div class="marker-found">{markerFound}</div>
  <div class="finder">{finder}</div>
</div>
<Egg />
<button
  class="big bottom-black-yellow"
  on:click={() =>
    api.findMarker(data.code).then(() => {
      invalidateAll();
    })}>CRACK</button
>
{#if !isAuthed}
  <Login showModal={true} />
{/if}

<style>
  .list-container {
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1 0 auto;
    padding: 10px;
  }
  .list-container > div {
    font-weight: bold;
    font-size: 2rem;
  }
  .bottom-black-yellow {
    color: yellow;
    background: black;
    padding: 10px 0px;
  }
</style>
