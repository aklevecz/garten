<script lang="ts">
  import { page } from "$app/stores";
  import userStore from "$stores/user";

  // import type { LayoutData } from "./$types";
  // export let data: LayoutData;
  $: {
    console.log("+layout.svelte, $page.data:", $page.data);
    if ($page.data.hunter) {
      userStore.init($page.data.hunter);
    }
  }
</script>

<slot />

<style>
  :root {
    --green: #84ff00;
  }
  :global(*) {
    box-sizing: border-box;
  }
  :global(html, body) {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    font-family: Roboto;
  }
  :global(svg) {
    width: 100%;
    height: 100%;
  }
  :global(.h2) {
    font-size: 2.5rem;
    font-weight: bold;
  }
  :global(button) {
    background: black;
    color: white;
    font-weight: bold;
    padding: 2px 10px;
    border-radius: 10px;
  }
  :global(button.big) {
    font-size: 2rem;
    padding: 4px 20px;
  }
  :global(button.small) {
    width: 50px;
    height: 50px;
  }
</style>
