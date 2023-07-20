<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import EggCracked from "$components/svg/EggCracked.svelte";
  import { eggModal } from "$stores/modal";
</script>

<Modal bind:showModal={$eggModal.showModal}>
  <div class="h2">{$eggModal.data?.title}</div>
  {#if $eggModal.data.found}<div class:is-cracker={$eggModal.data.isCracker} class="cracked">cracked</div>{:else}<div
      style="letter-spacing:3px;"
    >
      waiting to be cracked...
    </div>{/if}
  {#if $eggModal.data.found} <EggCracked />{:else}<Egg />{/if}
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
</style>
