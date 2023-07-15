<script lang="ts">
  // import type { LayoutData } from "./$types";
  // export let data: LayoutData;
</script>

<slot />

<style>
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
  :global(.h2) {
    font-size: 2.5rem;
    font-weight: bold;
  }
  :global(button) {
    background: black;
    color: white;
    font-weight: bold;
    padding: 2px 10px;
  }
  :global(button.big) {
    font-size: 2rem;
    padding: 4px 20px;
  }
</style>
