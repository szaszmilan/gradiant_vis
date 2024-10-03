<script>
  export let progress = 0;
  export let tickPrecision = 10;
  export let maxEpoch = 1000;
</script>

<style>
  .loading-bar-container {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 3px 3px -5px #000, 0 2px 5px #000;
    position: relative;
    margin: 20px 0;
  }

  .loading-bar {
    height: 30px;
    background: linear-gradient(to right, #4caf50, #81c784);
    border-radius: 25px 0 0 25px;
    transition: width 0.4s ease;
  }

  .tick {
    position: absolute;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: #000;
  }

  .tick-label {
    position: absolute;
    top: 35px;
    transform: translateX(-50%);
    font-size: 10px;
    white-space: nowrap;
  }
</style>

<div class="loading-bar-container">
  <div class="loading-bar" style="width: {progress}%; height: 30px; background: linear-gradient(to right, #4caf50, #81c784);"></div>
  {#each Array(Math.floor(100 / tickPrecision)).fill(0) as _, i}
    <div class="tick" style="left: {i * tickPrecision}%;">
      <span class="tick-label">{Math.floor(i * tickPrecision / 100 * maxEpoch)}</span>
    </div>
  {/each}
</div>