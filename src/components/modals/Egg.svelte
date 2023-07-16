<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import Egg from "$components/svg/Egg.svelte";
  import EggCracked from "$components/svg/EggCracked.svelte";
  import { eggModal } from "$stores/modal";
</script>

<Modal bind:showModal={$eggModal.showModal}>
  <div class="h2">{$eggModal.data?.title}</div>
  {#if $eggModal.data.finder}<div>cracked by: {$eggModal.data.finder}</div>{:else}<div>
      waiting to be cracked...
    </div>{/if}
  {#if $eggModal.data.found} <EggCracked />{:else}<Egg />{/if}
</Modal>
