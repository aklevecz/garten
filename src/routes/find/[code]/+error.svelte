<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  let container: HTMLDivElement;
  const link = "https://miro.medium.com/v2/resize:fit:996/0*zEU6Xyz5z72H6Lhh.gif";
  setInterval(function () {
    if (browser) {
      let img = document.createElement("div");
      img.classList.add("img");
      let imgi = document.createElement("img");
      imgi.src = link;
      img.appendChild(imgi);
      container.appendChild(img);
    }
  }, 100);
</script>

<h1>{$page.status}: {$page.error?.message}</h1>
<div class="container" bind:this={container}>
  <!-- <img alt="the code does not exist" src={link} /> -->
  <!-- <div class="img" /> -->
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap-reverse;
    flex-direction: row-reverse;
    width: 100vw;
    height: 100vh;
  }
  :global(img) {
    width: 100%;
    height: 100%;
  }
  :global(.img) {
    background-color: red;
    border: 1px solid black;
    flex: 1 1 20%;
  }
</style>
