<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import Login from "$components/modals/Login.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import EggCracked from "$components/svg/EggCracked.svelte";
  import api from "$lib/api";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: cracked = $page.data.marker.finder && $page.data.marker.found;
  $: isAuthed = Boolean(data.hunter);
  $: markerName = data.marker.name;
  $: finder = $page.data.hunter || "CRACKABLE";

  $: buttonText = cracked ? "CRACKED" : "CRACK";

  $: wasCracker = data.marker.finder === $page.data.hunter;

  $: markerFound = wasCracker ? "YOU GOT IT :)" : cracked ? "TOO LATE :(" : "CLAIMABLE";
</script>

<div class="list-container">
  <div>
    <div class="label">egg_name</div>
    <div class="marker-name">{markerName}</div>
  </div>
  <div>
    <div class="label">status</div>
    <div class:was-cracked={wasCracker} class="marker-found">{markerFound}</div>
  </div>
</div>
{#if cracked}
  <EggCracked />
{:else}
  <Egg />
{/if}
<button
  disabled={cracked}
  class="big bottom-black-yellow"
  on:click={() =>
    api.findMarker(data.code).then(() => {
      invalidateAll();
    })}>{buttonText}</button
>
{#if !isAuthed}
  <Login showModal={true} />
{/if}

<style>
  .list-container {
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1 0 auto;
    padding: 10px;
  }
  .list-container > div {
    font-weight: bold;
    font-size: 2rem;
  }
  .bottom-black-yellow {
    color: yellow;
    background-color: red;
    border: none;
    padding: 10px 0px;
  }
  button {
    border-radius: 0px;
  }
  button:disabled {
    background-color: grey;
    color: lightgrey;
  }
  .label {
    font-size: 8px !important;
  }
  .was-cracked {
    color: var(--green);
  }
</style>
