<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import Modal from "$components/Modal.svelte";
  import In from "$components/svg/In.svelte";

  export let email: string = "";
  export let address: string = "";
  export let showModal = false;
  $: {
    address = $page.data.address;
    if (address) {
      showModal = false;
    }
    showModal = showModal;
    address = address;
  }
</script>

<Modal bind:showModal>
  <div class="h2">IDENTIFY</div>
  <div>provide your wallet & email to get updates and prizes</div>
  <div>
    <form method="POST" action="/?/loginEmailAndAddress" use:enhance>
      <div class="form-control">
        <label for="email" class="label">
          <div class="label-text">email</div>
        </label>
        <input name="email" class="input" value={email || ""} />
      </div>
      <div class="form-control">
        <label for="address" class="label">
          <div class="label-text">address</div>
        </label>
        <input name="address" class="input" value={address || ""} />
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
