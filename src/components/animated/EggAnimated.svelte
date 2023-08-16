<script>
  import Egg from "$components/svg/Egg.svelte";
</script>

<div class="bouncing-icon"><Egg /></div>

<style>
  .bouncing-icon {
    overflow: visible;
    animation: bounce infinite alternate 1s;
  }
  @keyframes bounce {
    0% {
      transform: scale(0.2);
    }
    100% {
      transform: scale(0.7);
    }
  }
</style>
