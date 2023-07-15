<script lang="ts">
  import { enhance } from "$app/forms";
  import Modal from "$components/Modal.svelte";
  import In from "$components/svg/In.svelte";

  export let hunter: any = "";
  export let showModal = false;
  //#775bff
  $: {
    console.log("Login.svelte, hunter:", hunter === undefined, hunter);
  }
</script>

<Modal bind:showModal>
  <div class="h2">LOGIN</div>
  <div>
    <form method="POST" action="/?/login" use:enhance>
      <div class="form-control">
        <label for="hunter" class="label">
          <div class="label-text">address</div>
        </label>
        <input name="hunter" class="input" value={hunter} />
      </div>
      <button><In /></button>
    </form>
  </div>
</Modal>

<style>
  .form-control {
    display: flex;
    flex-direction: column;
    margin: 10px 0px;
  }
  label {
    /* font-family: monospace;s */
    font-size: 1rem;
  }
  input {
    width: 80%;
    padding: 5px 2px;
    background: black;
    color: white;
  }
  button {
    border: none;
    width: 58px;
    height: 58px;
    background: black;
    margin: auto;
  }
</style>
