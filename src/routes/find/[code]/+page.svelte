<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import Info from "$components/modals/Info.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import api from "$lib/api";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: cracked = $page.data.marker.finder && $page.data.marker.found;
  $: isAuthed = Boolean(data.hunter);
  $: markerName = data.marker.name;
  $: buttonText = isAuthed && cracked ? "ACTIVATED" : cracked ? "STEAL" : "ACTIVATE";
  $: isCracker = $page.data.isCracker;
  $: markerFound = isCracker ? "ACTIVATED" : cracked ? "ACTIVATED" : "INACTIVE";

  $: info = $page.data.info;

  $: notTheirMarker = !isCracker && isAuthed;

  let error = "";

  function onActivate() {
    api
      .claimEgg(data.code, data.marker.name)
      .then(() => {
        invalidateAll();
      })
      .catch((err) => {
        error = err;
      });
  }

  let showModal = false;
  function toggleModal() {
    showModal = true;
  }
</script>

<Info bind:showModal />
<div class="container">
  <div class="info-container">
    <div>
      <div class="label">egg_name</div>
      <div class="marker-name">{markerName}</div>
    </div>
    <div>
      <div class="label">status</div>
      <div class:was-cracked={isCracker} class="marker-found">{markerFound}</div>
    </div>
  </div>
  <div class:hide={!error} class="error">{error}</div>
  {#if isCracker}
    <div style="font-size:2rem;text-align:center;">
      <div>this is your egg</div>
      <div>to be hatched</div>
    </div>
  {/if}
  <div class="egg-wrapper"><Egg style="position:absolute;" /></div>
  {#if isAuthed && !info}<button class="rsvp-button" on:click={toggleModal}>RSVP</button>{/if}
  {#if info}<button class="big bottom-black-yellow black-white" on:click={toggleModal}>YOU ARE RSVP'D</button>{/if}
  {#if !isAuthed}<button class="big bottom-black-yellow" disabled={isAuthed && cracked} on:click={onActivate}
      >{buttonText}</button
    >{/if}
  {#if notTheirMarker}<button on:click={onActivate} class="rsvp-button">STEAL</button>{/if}
</div>

<!-- {#if cracked}
  <EggCracked />
  <div class="faded"><Egg style="max-height:50vh;" /></div>
{:else}
  <Egg />
{/if}
<button disabled={cracked} class="big bottom-black-yellow" on:click={onFind}>{buttonText}</button> -->

<style>
  .container {
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    /* gap: 20px; */
    flex: 1 0 auto;
    justify-content: space-between;
  }
  .container > div {
    font-weight: bold;
    font-size: 2rem;
    padding: 10px;
  }
  .info-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .bottom-black-yellow {
    color: yellow;
    background-color: red;
    border: none;
    padding: 10px 0px;
  }
  .black-white {
    background-color: black;
    color: white;
  }
  .rsvp-button {
    font-size: 2rem;
    padding: 10px 0px;
    border-radius: 50px;
    margin: 0px 40px 12px;
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
  .error {
    color: red;
    text-align: center;
  }
  .faded {
    opacity: 0.1;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
  }
  .egg-wrapper {
    position: relative;
    flex: 0 0 30%;
    width: 100%;
    padding: 0px !important;
    margin: 20px auto;
  }
</style>
