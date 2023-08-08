<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import EggCracked from "$components/svg/EggCracked.svelte";
  import type { Hunt, Hunts } from "$lib/types";
  import { eggModal } from "$stores/modal";

  const config: { [key in Hunts | string]: any } = {
    "fwb-fest": { message: "hf", buttonIcon: "/noggles.svg" },
    "bao-eggs": { message: "waiting to be cracked..." },
  };

  export let hunt: Hunt;

  let eigthWallURL = "";
  $: {
    const data = $eggModal.data;
    eigthWallURL = `https://park.yaytso.art/?poster=${data.title}`;
    console.log(eigthWallURL);
  }
</script>

<Modal bind:showModal={$eggModal.showModal}>
  <div class="h2">{$eggModal.data?.title}</div>
  {#if $eggModal.data.found}<div class:is-cracker={$eggModal.data.isCracker} class="cracked">cracked</div>{:else}<div style="letter-spacing:3px;">
      {config[hunt.name].message}
    </div>{/if}
  {#if hunt.name === "bao-eggs"}
    {#if $eggModal.data.found} <EggCracked />{:else}<Egg />{/if}
  {:else if $eggModal.data?.customMarker && $eggModal.data?.customMarker.includes("svg")}<object
      title="modal-graphic"
      data={$eggModal.data?.customMarker}
    />{:else if $eggModal.data?.customMarker}<img alt="oops" src={$eggModal.data?.customMarker} />{:else}
    <Egg />
  {/if}
  <button
    on:click={() => {
      window.open(eigthWallURL);
    }}><object title="button-icon" data={config[hunt.name].buttonIcon} /></button
  >
</Modal>

<style>
  .cracked {
    margin-top: 20px;
    margin-bottom: -30px;
    text-align: center;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: bold;
    color: red;
  }
  .is-cracker {
    color: var(--green);
  }
  object {
    height: 100%;
  }
  button {
    width: 80px;
    height: 50px;
    margin: auto;
    display: block;
    background-color: black;
    display: flex;
    justify-content: center;
    border-radius: 20px;
    border: none;
  }
  img {
    width: 100%;
    padding: 12px;
  }
</style>
