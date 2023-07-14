<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";

  $: hunter = $page.data.hunter;
</script>

<div class="layout-container">
  <div class="hunter">
    {hunter}
    <form method="POST" use:enhance><button formaction="/?/logout">out</button></form>
  </div>
  <slot />
</div>

<style>
  button {
    background: none;
    border: none;
    font-weight: bold;
  }
  .layout-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .hunter {
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    padding: 2px;
  }
</style>
