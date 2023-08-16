<script lang="ts">
  import HeaderLogin from "$components/HeaderLogin.svelte";
  console.log("/find/+layout.svelte rendered");
</script>

<div class="layout-container">
  <HeaderLogin />
  <slot />
</div>

<style>
  .layout-container {
    height: 100%;
    min-height: 50px;
    display: flex;
    flex-direction: column;
  }
</style>
