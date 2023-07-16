<script lang="ts">
  import { modalKeys } from "$lib/constants";
  import { eggModal } from "$stores/modal";
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";

  export let showModal: boolean; // boolean

  let dialog: HTMLDialogElement; // HTMLDialogElement
  $: if (dialog && showModal) dialog.showModal();
  $: {
    if (!showModal && dialog) {
      dialog.close();
      showModal = false;
      eggModal.set({ showModal: false, data: { title: "", found: false, finder: "" } });
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="modal-container"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <!-- svelte-ignore a11y-autofocus -->
  <button class="modal-close" autofocus on:click={() => dialog.close()}>x</button>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot name="header" />
    <slot />
    <!-- svelte-ignore a11y-autofocus -->
  </div>
</dialog>

<style>
  dialog {
    max-width: 400px;
    width: 90%;
    border-radius: 0.2em;
    border: none;
    padding: 0;
    position: relative;
  }
  .modal-close {
    position: absolute;
    right: 1px;
    top: -2px;
    background: none;
    font-size: 30px;
    outline: none;
  }
  dialog::backdrop {
    background: #84ff005d;
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  button {
    display: block;
    border: none;
    color: black;
  }
</style>
