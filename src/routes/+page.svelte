<script lang="ts">
  import GoogleMaps from "$components/GoogleMaps.svelte";

  let map: any = null;
</script>

<GoogleMaps
  {map}
  globally
  on:load={() => {
    console.log("MAP SAYS IM LOADED");
  }}
/>
