<script lang="ts">
  import { enhance } from "$app/forms";
  import Modal from "$components/Modal.svelte";

  export let hunter: any = "";
  export let showModal = false;

  $: {
    console.log("Login.svelte, hunter:", hunter === undefined, hunter);
  }
</script>

<Modal bind:showModal>
  <div>
    <form method="POST" action="/?/login" use:enhance>
      <div class="form-control">
        <label for="hunter" class="label">
          <span class="label-text">Your address</span>
          <input name="hunter" class="input" value={hunter} />
        </label>
      </div>
      <button>login</button>
      <button formaction="/?/logout">logout</button>
    </form>
  </div>
</Modal>
