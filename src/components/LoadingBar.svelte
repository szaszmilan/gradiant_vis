<script>
  export let progress = 0;
  export let tickPrecision = 10;
  export let maxEpoch = 1000;
</script>

<style>
  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #eee;
    border-radius: 5px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background-color: #2c3e50;
    transition: width 0.3s ease;
  }

  .tick-marks {
    position: relative;
    width: 100%;
    height: 5px;
    margin-top: 2px;
  }

  .tick {
    position: absolute;
    width: 1px;
    height: 100%;
    background-color: #ccc;
  }
</style>

<div class="progress-bar">
  <div class="progress" style="width: {progress}%;"></div>
</div>