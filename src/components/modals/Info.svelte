<script>
  import Modal from "$components/Modal.svelte";
  import Egg from "$components/svg/Egg.svelte";
  export let showModal = false;
  let eggDim = "30px";
</script>

<Modal bind:showModal>
  <h2>
    <Egg width={eggDim} height={eggDim} style="padding-top:20px;" /> welcome to the hunt! <Egg
      width={eggDim}
      height={eggDim}
    />
  </h2>
  <p class="line">
    there are <Egg width={eggDim} height={eggDim} />'s hidden around the area. find the most & win two passes to FWB
    fest.
  </p>
  <p class="line">
    when you find an egg, scan the QR code on it, and click the CRACK button.feel free to take the card as a souvenior
    :)
  </p>
  <p class="line">
    you will be contacted by a method of your choice. your information will not be stored for any other purpose.
  </p>
  <button
    on:click={() => {
      showModal = false;
    }}>LET'S GO</button
  >
</Modal>

<style>
  span {
    padding-top: 20px;
  }
  h2 {
    margin: 0px 0px 10px;
  }
  button {
    margin: 10px auto 5px;
    display: block;
  }
</style>
