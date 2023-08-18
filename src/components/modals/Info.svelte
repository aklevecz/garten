<script>
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import Modal from "$components/Modal.svelte";
  import EggAnimated from "$components/animated/EggAnimated.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import api from "$lib/api";

  export let showModal = false;
  function toggleModal() {
    showModal = !showModal;
  }
  let eggDim = "50px";
  let info = $page.data.info;
  let favoriteArtist = $page.data.favoriteArtist;
  let style = `overflow:visible;width:${eggDim};height:${eggDim};margin-left:-20px;`;
  const inlineEgg = {
    component: Egg,
    options: {
      width: eggDim,
      height: eggDim,
      viewBox: "-2 -4 16 16",
      style,
    },
  };

  let sending = false;
  let sent = false;
  async function onRSVP() {
    let start = performance.now();
    sending = true;
    await api.rsvp(info, favoriteArtist);
    invalidate("find");
    let end = performance.now();
    let timeout = 2000 - (end - start);
    setTimeout(() => {
      sending = false;
      sent = true;
    }, timeout);
  }
</script>

<Modal bind:showModal>
  <h2>
    show#1 <svelte:component this={inlineEgg.component} {...inlineEgg.options} />
  </h2>
  {#if !sending && !sent}
    <p class="line">let's hatch your egg & see what's inside</p>
    <p class="line">leave your info for deets</p>
    <div class="input-wrapper">
      <label for="info">number</label>
      <input name="info" type="tel" autocomplete="tel" placeholder="3236099839" bind:value={info} />
    </div>
    <div class="input-wrapper">
      <label for="favorite-artist">favorite artist</label>
      <input name="favorite-artist" type="text" placeholder="your mom" bind:value={favoriteArtist} />
    </div>
    <button on:click={onRSVP}>send it</button>
  {/if}
  {#if sending}
    <EggAnimated />
  {/if}
  {#if sent}
    <p class="line" style="text-align:center;font-size:2.5rem;">see you there :)</p>
    <button on:click={toggleModal}>ok</button>
  {/if}
</Modal>

<style>
  h2 {
    /* text-align: center; */
    margin: 18px 0px 0px;
  }
  .line {
    font-size: 1.5rem;
    font-weight: bold;
  }
  label {
    font-weight: bold;
  }
  .input-wrapper {
    margin-bottom: 10px;
  }
  input {
    width: 100%;
    padding: 8px 4px;
    font-size: 1rem;
    margin-top: 4px;
  }
  button {
    margin: 10px auto 5px;
    display: block;
    padding: 8px 10px;
  }
</style>
