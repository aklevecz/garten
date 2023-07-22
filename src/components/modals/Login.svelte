<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import Modal from "$components/Modal.svelte";
  import In from "$components/svg/In.svelte";

  export let hunter: any = "";
  export let showModal = false;
  //#775bff
  $: {
    hunter = $page.data.hunter;
    // console.log("Login.svelte, hunter:", hunter);
    if (hunter) {
      showModal = false;
    }
    showModal = showModal;
    hunter = hunter;
  }
  let showMyContact = false;
</script>

<Modal bind:showModal>
  <div class="h2">IDENTIFY</div>
  <div>some way to contact you for prizes</div>
  <div class="me-contact">
    you can also use a very unique name and contact me if you think you won <a
      href="#"
      on:click={() => (showMyContact = !showMyContact)}>show contact</a
    > <span class:hide={!showMyContact}>(ariel@yaytso.art - 4159671642)</span>
  </div>

  <div>
    <form method="POST" action="/?/login" use:enhance>
      <div class="form-control">
        <label for="hunter" class="label">
          <div class="label-text">phone/email/whatever</div>
        </label>
        <input name="hunter" class="input" value={hunter || "testing"} />
      </div>
      <button><In /></button>
    </form>
  </div>
</Modal>

<style>
  .hide {
    display: none;
  }
  .form-control {
    display: flex;
    flex-direction: column;
    margin: 10px 0px;
  }
  label {
    /* font-family: monospace;s */
    font-size: 1rem;
    text-transform: uppercase;
    padding-left: 2.3px;
  }
  .label-text {
    font-weight: bold;
    padding: 0px;
    font-size: 1rem;
    letter-spacing: 2px;
  }
  .me-contact {
    font-size: 0.7rem;
  }
  input {
    width: 90%;
    padding: 6px 12px;
    background: black;
    color: white;
    font-size: 1.2rem;
    border-radius: 4px;
    border: none;
  }
  button {
    border: none;
    width: 58px;
    height: 58px;
    background: black;
    margin: auto;
  }
</style>
